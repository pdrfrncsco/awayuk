import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../services';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationsContext';
import { getProfileImageUrl } from '../../utils/getProfileImageUrl';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  ClockIcon,
  UserCircleIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

function ServicesExplorer() {
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [servicesList, setServicesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedLocation, setSelectedLocation] = useState('todas');
  const [selectedPrice, setSelectedPrice] = useState('todas');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const parsePriceValue = (priceText) => {
    if (!priceText || typeof priceText !== 'string') return null;
    const numeric = priceText.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
    const match = numeric.match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');

      const membersResp = await services.members.getMembers({ page: 1, limit: 40 });
      const verified = (membersResp?.results || []).filter((m) => m.isVerified);
      const profilePromises = verified.map((m) => services.profile.getUserProfile(m.id));
      const profiles = await Promise.all(profilePromises);
      const aggregated = [];
      for (const prof of profiles) {
        const owner = {
          id: prof?.id,
          name: prof?.full_name || `${prof?.first_name || ''} ${prof?.last_name || ''}`.trim() || prof?.username,
          email: prof?.email,
          location: prof?.location,
          profession: prof?.profession,
          category: prof?.category,
          avatar: prof?.profile_image,
        };
        const items = Array.isArray(prof?.services) ? prof.services : [];
        for (const s of items) {
          if (s?.is_active) {
            aggregated.push({
              id: s.id,
              name: s.name,
              description: s.description,
              priceText: s.price,
              priceValue: parsePriceValue(s.price),
              duration: s.duration,
              image: s.image,
              owner,
            });
          }
        }
      }
      setServicesList(aggregated);
    } catch (err) {
      setError('Erro ao carregar serviços. Tente novamente.');
      showToast({ type: NOTIFICATION_TYPES.ERROR, title: 'Erro', message: err?.message || 'Falha ao carregar serviços' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categoryOptions = useMemo(() => {
    const cats = new Set();
    for (const s of servicesList) {
      if (s.owner?.category) cats.add(s.owner.category);
    }
    return ['todas', ...Array.from(cats)];
  }, [servicesList]);

  const locationOptions = useMemo(() => {
    const locs = new Set();
    for (const s of servicesList) {
      if (s.owner?.location) locs.add(s.owner.location);
    }
    return ['todas', ...Array.from(locs)];
  }, [servicesList]);

  const priceOptions = [
    { value: 'todas', label: 'Todos os preços' },
    { value: '0-50', label: 'Até £50' },
    { value: '50-200', label: '£50 - £200' },
    { value: '200-1000', label: '£200 - £1000' },
    { value: '1000+', label: '£1000+' },
  ];

  const inPriceRange = (priceValue) => {
    if (!selectedPrice || selectedPrice === 'todas') return true;
    if (priceValue == null) return true;
    if (selectedPrice === '0-50') return priceValue <= 50;
    if (selectedPrice === '50-200') return priceValue > 50 && priceValue <= 200;
    if (selectedPrice === '200-1000') return priceValue > 200 && priceValue <= 1000;
    if (selectedPrice === '1000+') return priceValue > 1000;
    return true;
  };

  const filteredServices = useMemo(() => {
    return servicesList.filter((s) => {
      const matchesSearch = [s.name, s.description, s.owner?.name, s.owner?.profession]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'todas' || (s.owner?.category === selectedCategory);
      const matchesLocation = selectedLocation === 'todas' || (s.owner?.location === selectedLocation);
      const matchesPrice = inPriceRange(s.priceValue);
      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [servicesList, searchTerm, selectedCategory, selectedLocation, selectedPrice]);

  const ServiceCard = ({ item, isListView = false }) => (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${isListView ? 'flex' : ''}`}>
      <div className={`${isListView ? 'w-28 h-28 flex-shrink-0' : 'h-40'} bg-gray-100 flex items-center justify-center`}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
        ) : (
          <UserCircleIcon className="h-10 w-10 text-gray-400" />
        )}
      </div>
      <div className={`p-5 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-red-600 font-semibold">
              <CurrencyPoundIcon className="h-5 w-5 mr-1" />
              <span>{item.priceText || 'A combinar'}</span>
            </div>
            {item.duration && (
              <div className="mt-1 flex items-center justify-end text-xs text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <img
            src={getProfileImageUrl({ profile_image: item.owner?.avatar, name: item.owner?.name })}
            alt={item.owner?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{item.owner?.name}</p>
            <p className="text-xs text-gray-500">{item.owner?.profession}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{item.owner?.location || '—'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/perfil/${item.owner?.id}`}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section>
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="mt-2 text-sm">Explore serviços oferecidos por membros aprovados</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="relative w-full sm:w-1/2">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar serviços ou prestadores"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Grelha"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Lista"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <FunnelIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt === 'todas' ? 'Todas' : opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Localização</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {locationOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt === 'todas' ? 'Todas' : opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    {priceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-2 text-gray-600">A carregar serviços...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={loadServices}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Ajuste os filtros ou tente pesquisar com outro termo.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((item) => (
                  <ServiceCard key={`${item.id}-${item.owner?.id}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((item) => (
                  <ServiceCard key={`${item.id}-${item.owner?.id}`} item={item} isListView={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesExplorer;