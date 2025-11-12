import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../services';
import VisitorAction from '../../components/common/VisitorAction';
import { useAuth } from '../../contexts/AuthContext';

const EventsExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'popular' | 'location' | 'title'
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState(() => new Set(JSON.parse(localStorage.getItem('savedEvents') || '[]')));
  const [sharedId, setSharedId] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const isMember = user && user.role === 'member';

  // Carregar preferências de filtros do localStorage
  useEffect(() => {
    const prefsStr = localStorage.getItem('eventsExplorerFilters');
    if (prefsStr) {
      try {
        const prefs = JSON.parse(prefsStr);
        setSearchTerm(prefs.searchTerm ?? '');
        setSelectedLocation(prefs.selectedLocation ?? '');
        setSelectedCategory(prefs.selectedCategory ?? '');
        setSelectedDate(prefs.selectedDate ?? '');
        setViewMode(prefs.viewMode ?? 'grid');
        setSortBy(prefs.sortBy ?? 'date');
        setSortDir(prefs.sortDir ?? 'asc');
        setItemsPerPage(prefs.itemsPerPage ?? 9);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await services.eventsService.getEvents();
        
        if (response && response.results) {
          setEvents(response.results);
          
          // Extrair localizações e categorias únicas
          const uniqueLocations = [...new Set(response.results.map(event => event.location))];
          const uniqueCategories = [...new Set(response.results.map(event => event.category))];
          
          setLocations(uniqueLocations);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        setError('Ocorreu um erro ao carregar os eventos. Tente novamente.');
        // Fallback para dados mock já está implementado no serviço
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || event.location === selectedLocation;
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesDate = !selectedDate || event.date >= selectedDate;
      
      return matchesSearch && matchesLocation && matchesCategory && matchesDate;
    });
  }, [events, searchTerm, selectedLocation, selectedCategory, selectedDate]);

  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'popular') {
        const pa = a.registered / (a.capacity || 1);
        const pb = b.registered / (b.capacity || 1);
        cmp = pb - pa; // mais popular primeiro
      } else if (sortBy === 'location') {
        cmp = (a.location || '').localeCompare(b.location || '');
      } else if (sortBy === 'title') {
        cmp = (a.title || '').localeCompare(b.title || '');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filteredEvents, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedEvents.slice(start, start + itemsPerPage);
  }, [sortedEvents, page, itemsPerPage]);

  // Reset da página quando filtros/ordenção mudam
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedLocation, selectedCategory, selectedDate, sortBy, sortDir, itemsPerPage, viewMode]);

  // Guardar preferências
  useEffect(() => {
    const prefs = {
      searchTerm,
      selectedLocation,
      selectedCategory,
      selectedDate,
      viewMode,
      sortBy,
      sortDir,
      itemsPerPage
    };
    try { localStorage.setItem('eventsExplorerFilters', JSON.stringify(prefs)); } catch (_) {}
  }, [searchTerm, selectedLocation, selectedCategory, selectedDate, viewMode, sortBy, sortDir, itemsPerPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleShare = (event) => {
    try {
      const url = `${window.location.origin}/evento/${event.slug || event.id}`;
      navigator.clipboard?.writeText(url);
      setSharedId(event.id);
      setTimeout(() => setSharedId(null), 1500);
    } catch (_) {}
  };

  const toggleSaved = (eventId) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      try { localStorage.setItem('savedEvents', JSON.stringify([...next])); } catch (_) {}
      return next;
    });
  };

  const getAvailabilityStatus = (capacity, registered) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: 'Quase Esgotado', color: 'text-red-600 bg-red-100' };
    if (percentage >= 70) return { status: 'Poucos Lugares', color: 'text-orange-600 bg-orange-100' };
    return { status: 'Disponível', color: 'text-green-600 bg-green-100' };
  };

  const EventCard = ({ event }) => {
    const availability = getAvailabilityStatus(event.capacity, event.registered);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            {event.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-star mr-1"></i>
                Destaque
              </span>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
              {availability.status}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {event.price}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {event.category}
            </span>
            <span className="text-xs text-gray-500">
              <i className="fas fa-users mr-1"></i>
              {event.registered}/{event.capacity}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-calendar-alt mr-2 text-red-500"></i>
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-clock mr-2 text-red-500"></i>
              <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
              <span>{event.venue}, {event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-user mr-2 text-red-500"></i>
              <span>{event.organizer}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{event.tags.length - 3} mais</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link 
              to={`/evento/${event.slug || event.id}`}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-3 rounded text-sm hover:opacity-90 transition-opacity text-center"
            >
              <i className="fas fa-eye mr-1"></i>
              Ver Detalhes
            </Link>
            <button onClick={() => handleShare(event)} className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors flex items-center">
              <i className="fas fa-share-alt"></i>
              {sharedId === event.id && (
                <span className="ml-2 text-xs text-green-600">Copiado!</span>
              )}
            </button>
            <VisitorAction
              actionType="favorite"
              isAuthenticated={isAuthenticated}
              isMember={isMember}
              buttonText={savedIds.has(event.id) ? 'Guardado' : 'Guardar'}
              buttonClassName={`bg-gray-100 ${savedIds.has(event.id) ? 'text-red-600' : 'text-gray-700'} py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors`}
              onAction={() => toggleSaved(event.id)}
            />
          </div>
        </div>
      </div>
    );
  };

  const EventListItem = ({ event }) => {
    const availability = getAvailabilityStatus(event.capacity, event.registered);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
            {event.featured && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                <i className="fas fa-star text-xs"></i>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {event.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${availability.color}`}>
                    {availability.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{event.price}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt mr-1 text-red-500"></i>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock mr-1 text-red-500"></i>
                    <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-1 text-red-500"></i>
                    <span>{event.venue}, {event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-users mr-1 text-red-500"></i>
                    <span>{event.registered}/{event.capacity} inscritos</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 4).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <Link 
                  to={`/evento/${event.slug || event.id}`}
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-4 rounded text-sm hover:opacity-90 transition-opacity text-center"
                >
                  <i className="fas fa-eye mr-1"></i>
                  Ver Detalhes
                </Link>
                <div className="flex gap-1">
                  <button onClick={() => handleShare(event)} className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center">
                    <i className="fas fa-share-alt"></i>
                    {sharedId === event.id && (
                      <span className="ml-2 text-xs text-green-600">Copiado!</span>
                    )}
                  </button>
                  <VisitorAction
                    actionType="favorite"
                    isAuthenticated={isAuthenticated}
                    isMember={isMember}
                    buttonText={savedIds.has(event.id) ? 'Guardado' : 'Guardar'}
                    buttonClassName={`bg-gray-100 ${savedIds.has(event.id) ? 'text-red-600' : 'text-gray-700'} py-1 px-2 rounded text-sm hover:bg-gray-200 transition-colors`}
                    onAction={() => toggleSaved(event.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Eventos da Comunidade
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra e participe de eventos da comunidade angolana em todo o Reino Unido
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Título, descrição ou organizador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localidade
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as localidades</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Mínima
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visualização
              </label>
              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md ${
                    viewMode === 'grid' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-th mr-1"></i>
                  Grade
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md border-l ${
                    viewMode === 'list' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-list mr-1"></i>
                  Lista
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="date">Data</option>
                  <option value="popular">Popularidade</option>
                  <option value="location">Localidade</option>
                  <option value="title">Título</option>
                </select>
                <select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                  className="w-24 py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''} encontrado{sortedEvents.length !== 1 ? 's' : ''}
            </p>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('');
                setSelectedCategory('');
                setSelectedDate('');
                setSortBy('date');
                setSortDir('asc');
                setItemsPerPage(9);
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpar filtros
            </button>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <label className="text-sm text-gray-700">Resultados por página</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-24 py-1 px-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {[...Array(itemsPerPage)].map((_, idx) => (
              <div key={idx} className={viewMode === 'grid' ? 'bg-white rounded-lg shadow-md overflow-hidden animate-pulse' : 'bg-white rounded-lg shadow-md p-4 animate-pulse'}>
                <div className={viewMode === 'grid' ? 'h-48 bg-gray-200' : 'h-24 w-24 bg-gray-200 rounded-lg'}></div>
                <div className={viewMode === 'grid' ? 'p-4 space-y-3' : 'mt-4 space-y-3'}>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {paginatedEvents.map(event => 
              viewMode === 'grid' 
                ? <EventCard key={event.id} event={event} />
                : <EventListItem key={event.id} event={event} />
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && sortedEvents.length > itemsPerPage && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={page === totalPages}
            >
              Seguinte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsExplorer;