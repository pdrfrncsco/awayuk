import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import eventService from '../../services/eventService';

const EventList = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  // Filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    date: searchParams.get('date') || '',
    is_free: searchParams.get('is_free') || '',
    is_online: searchParams.get('is_online') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents(filters);
      setEvents(response.results || response.data || []);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        totalPages: Math.ceil(response.count / 20)
      });
    } catch (err) {
      setError(err.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await eventService.getEventCategories();
      setCategories(response.results || response.data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Atualizar URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      city: '',
      type: '',
      date: '',
      is_free: '',
      is_online: '',
      page: 1
    };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      networking: 'fas fa-users',
      workshop: 'fas fa-tools',
      conference: 'fas fa-microphone',
      meetup: 'fas fa-coffee',
      webinar: 'fas fa-video',
      social: 'fas fa-glass-cheers',
      business: 'fas fa-briefcase',
      cultural: 'fas fa-palette',
      other: 'fas fa-calendar'
    };
    return icons[type] || icons.other;
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('events.title')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('events.subtitle')}
              </p>
            </div>
            {isAuthenticated && (
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/eventos/criar"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90 transition duration-300"
                >
                  <i className="fas fa-plus mr-2"></i>
                  {t('events.create')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('events.search_placeholder')}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <i className="fas fa-filter mr-2"></i>
                  {t('common.filters')}
                </button>
                {Object.values(filters).some(v => v && v !== 1) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    {t('common.clear_filters')}
                  </button>
                )}
              </div>
            </div>

            {/* Filtros expandidos */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('events.category')}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">{t('common.all')}</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('events.type')}
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">{t('common.all')}</option>
                      <option value="networking">Networking</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conferência</option>
                      <option value="meetup">Meetup</option>
                      <option value="webinar">Webinar</option>
                      <option value="social">Social</option>
                      <option value="business">Negócios</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('events.date_filter')}
                    </label>
                    <select
                      value={filters.date}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">{t('common.all')}</option>
                      <option value="today">{t('events.today')}</option>
                      <option value="upcoming">{t('events.upcoming')}</option>
                      <option value="this_week">{t('events.this_week')}</option>
                      <option value="this_month">{t('events.this_month')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('events.location_type')}
                    </label>
                    <select
                      value={filters.is_online}
                      onChange={(e) => handleFilterChange('is_online', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">{t('common.all')}</option>
                      <option value="true">{t('events.online')}</option>
                      <option value="false">{t('events.in_person')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de eventos */}
        {events.length === 0 && !loading ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('events.no_events')}
            </h3>
            <p className="text-gray-500">
              {t('events.no_events_description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Imagem do evento */}
                <div className="relative h-48 bg-gradient-to-r from-yellow-500 to-red-500">
                  {event.featured_image ? (
                    <img
                      src={event.featured_image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className={`${getEventTypeIcon(event.event_type)} text-4xl text-white`}></i>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {event.is_free && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {t('events.free')}
                      </span>
                    )}
                    {event.is_online && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {t('events.online')}
                      </span>
                    )}
                    {event.is_featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {t('events.featured')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {event.category?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      <i className="fas fa-eye mr-1"></i>
                      {event.view_count}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.short_description || event.description}
                  </p>

                  {/* Data e local */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-calendar mr-2"></i>
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {event.is_online ? t('events.online') : `${event.city || event.venue_name}`}
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-users mr-2"></i>
                        {event.attendee_count || 0} / {event.max_attendees}
                      </div>
                    )}
                  </div>

                  {/* Preço */}
                  <div className="flex items-center justify-between">
                    <div>
                      {event.is_free ? (
                        <span className="text-lg font-bold text-green-600">
                          {t('events.free')}
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          €{event.price}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/eventos/${event.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90 transition duration-300"
                    >
                      {t('events.view_details')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={!pagination.previous}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      page === filters.page
                        ? 'bg-red-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={!pagination.next}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;