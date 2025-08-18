import React, { useState } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const EventsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock data - em produção viria de uma API
  const events = [
    {
      id: 1,
      title: 'Networking Night Londres',
      description: 'Uma noite de networking para profissionais angolanos em Londres',
      date: '2024-12-20',
      time: '19:00',
      location: 'Central London Hotel',
      address: '123 Oxford Street, London W1D 2HX',
      category: 'networking',
      status: 'published',
      attendees: 45,
      maxAttendees: 80,
      price: 15,
      organizer: 'Maria Santos',
      image: null,
      tags: ['networking', 'profissional', 'londres']
    },
    {
      id: 2,
      title: 'Workshop: CV para o Reino Unido',
      description: 'Aprenda a criar um CV eficaz para o mercado de trabalho britânico',
      date: '2024-12-25',
      time: '14:00',
      location: 'Online',
      address: 'Zoom Meeting',
      category: 'workshop',
      status: 'published',
      attendees: 120,
      maxAttendees: 150,
      price: 0,
      organizer: 'João Silva',
      image: null,
      tags: ['workshop', 'cv', 'emprego']
    },
    {
      id: 3,
      title: 'Festa de Ano Novo Angolana',
      description: 'Celebre o Ano Novo com a comunidade angolana em Manchester',
      date: '2024-12-31',
      time: '20:00',
      location: 'Manchester Community Center',
      address: '456 Market Street, Manchester M1 1AA',
      category: 'social',
      status: 'draft',
      attendees: 0,
      maxAttendees: 200,
      price: 25,
      organizer: 'Ana Costa',
      image: null,
      tags: ['festa', 'ano-novo', 'manchester']
    },
    {
      id: 4,
      title: 'Seminário: Empreendedorismo no Reino Unido',
      description: 'Dicas e estratégias para empreendedores angolanos no Reino Unido',
      date: '2024-12-15',
      time: '10:00',
      location: 'Birmingham Business Hub',
      address: '789 Business Park, Birmingham B1 1BB',
      category: 'business',
      status: 'cancelled',
      attendees: 25,
      maxAttendees: 60,
      price: 20,
      organizer: 'Pedro Oliveira',
      image: null,
      tags: ['empreendedorismo', 'business', 'birmingham']
    },
    {
      id: 5,
      title: 'Encontro Cultural: Música Angolana',
      description: 'Uma tarde dedicada à música tradicional e contemporânea de Angola',
      date: '2025-01-10',
      time: '15:00',
      location: 'Edinburgh Arts Centre',
      address: '321 Arts Street, Edinburgh EH1 1CC',
      category: 'cultural',
      status: 'published',
      attendees: 35,
      maxAttendees: 100,
      price: 10,
      organizer: 'Carla Mendes',
      image: null,
      tags: ['música', 'cultura', 'edinburgh']
    }
  ];

  const categories = [
    { value: 'networking', label: 'Networking', color: 'bg-blue-100 text-blue-800' },
    { value: 'workshop', label: 'Workshop', color: 'bg-green-100 text-green-800' },
    { value: 'social', label: 'Social', color: 'bg-purple-100 text-purple-800' },
    { value: 'business', label: 'Business', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'cultural', label: 'Cultural', color: 'bg-pink-100 text-pink-800' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Publicado' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Rascunho' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    if (!categoryData) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryData.color}`}>
        {categoryData.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getCategoryBadge(event.category)}
              {getStatusBadge(event.status)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          </div>
          <div className="ml-4">
            <button className="text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDate(event.date)} às {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UsersIcon className="h-4 w-4 mr-2" />
            {event.attendees}/{event.maxAttendees} participantes
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            {event.price === 0 ? 'Gratuito' : `£${event.price}`}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
              <EyeIcon className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
              <PencilIcon className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Eventos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Crie e gerencie eventos para a comunidade AWAYSUK
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Criar Evento
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Pesquisar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                Filtros
              </button>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    viewMode === 'grid'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grade
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    viewMode === 'list'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="published">Publicados</option>
                    <option value="draft">Rascunhos</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todas</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Eventos ({filteredEvents.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Local
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {event.attendees}/{event.maxAttendees}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(event.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou termos de pesquisa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;