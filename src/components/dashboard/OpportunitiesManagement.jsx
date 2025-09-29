import React, { useState, useEffect } from 'react';
import { services } from '../../services';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const OpportunitiesManagement = () => {
  // Estados para dados reais da API
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    totalViews: 0
  });
  
  // Estados para filtros e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadOpportunities();
    loadJobTypes();
    loadLocations();
    loadStats();
  }, []);

  // Recarregar oportunidades quando filtros mudarem
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadOpportunities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus, filterType, filterLocation, pagination.page, pagination.limit]);

  // Função para carregar oportunidades
  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        type: filterType !== 'all' ? filterType : undefined,
        location: filterLocation !== 'all' ? filterLocation : undefined,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await services.opportunitiesService.getOpportunities(filters);
      
      setOpportunities(response.results);
      setPagination(prev => ({
        ...prev,
        total: response.count,
        totalPages: Math.ceil(response.count / prev.limit)
      }));
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
      setError('Erro ao carregar oportunidades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar tipos de trabalho
  const loadJobTypes = async () => {
    try {
      const types = await services.opportunitiesService.getJobTypes();
      setJobTypes(types);
    } catch (err) {
      console.error('Erro ao carregar tipos de trabalho:', err);
      // Usar tipos padrão em caso de erro
      setJobTypes(services.opportunitiesService.getDefaultJobTypes());
    }
  };

  // Função para carregar localizações
  const loadLocations = async () => {
    try {
      const locs = await services.opportunitiesService.getLocations();
      setLocations(locs);
    } catch (err) {
      console.error('Erro ao carregar localizações:', err);
      // Usar localizações padrão em caso de erro
      setLocations(services.opportunitiesService.getDefaultLocations());
    }
  };

  // Função para carregar estatísticas
  const loadStats = async () => {
    try {
      const statsData = await services.opportunitiesService.getOpportunityStats();
      setStats({
        total: statsData.total_opportunities || 0,
        active: statsData.active_opportunities || 0,
        featured: statsData.featured_opportunities || 0,
        totalViews: statsData.total_views || 0
      });
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  // Função para deletar oportunidade
  const handleDeleteOpportunity = async (opportunityId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta oportunidade?')) {
      return;
    }

    try {
      await services.opportunitiesService.deleteOpportunity(opportunityId);
      await loadOpportunities();
      await loadStats();
    } catch (err) {
      console.error('Erro ao deletar oportunidade:', err);
      alert('Erro ao deletar oportunidade. Tente novamente.');
    }
  };

  // Função para duplicar oportunidade
  const handleDuplicateOpportunity = async (opportunityId) => {
    try {
      await services.opportunitiesService.duplicateOpportunity(opportunityId);
      await loadOpportunities();
      await loadStats();
    } catch (err) {
      console.error('Erro ao duplicar oportunidade:', err);
      alert('Erro ao duplicar oportunidade. Tente novamente.');
    }
  };

  // Função para alterar status
  const handleStatusChange = async (opportunityId, newStatus) => {
    try {
      await services.opportunitiesService.updateOpportunityStatus(opportunityId, newStatus);
      await loadOpportunities();
      await loadStats();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('Erro ao alterar status. Tente novamente.');
    }
  };

  // Função para alternar destaque
  const handleToggleFeatured = async (opportunityId, featured) => {
    try {
      await services.opportunitiesService.toggleFeatured(opportunityId, featured);
      await loadOpportunities();
      await loadStats();
    } catch (err) {
      console.error('Erro ao alterar destaque:', err);
      alert('Erro ao alterar destaque. Tente novamente.');
    }
  };

  // Função para exportar oportunidades
  const handleExportOpportunities = async () => {
    try {
      const filters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        type: filterType !== 'all' ? filterType : undefined,
        location: filterLocation !== 'all' ? filterLocation : undefined
      };

      await services.opportunitiesService.exportOpportunities(filters, 'csv');
    } catch (err) {
      console.error('Erro ao exportar oportunidades:', err);
      alert('Erro ao exportar oportunidades. Tente novamente.');
    }
  };

  // Funções de paginação
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const experienceLevels = {
    'junior': { label: 'Júnior', color: 'bg-green-100 text-green-800' },
    'mid-level': { label: 'Pleno', color: 'bg-blue-100 text-blue-800' },
    'senior': { label: 'Sénior', color: 'bg-purple-100 text-purple-800' }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativa' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Pausada' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expirada' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeData = jobTypes.find(t => t.value === type);
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {typeData?.label || type}
      </span>
    );
  };

  const getExperienceBadge = (experience) => {
    const expData = experienceLevels[experience];
    if (!expData) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expData.color}`}>
        {expData.label}
      </span>
    );
  };

  const formatSalary = (salary, type) => {
    const isDaily = type === 'contract' || type === 'freelance';
    const currency = '£';
    const period = isDaily ? '/dia' : '/ano';
    
    if (salary.min === salary.max) {
      return `${currency}${salary.min.toLocaleString()}${period}`;
    }
    return `${currency}${salary.min.toLocaleString()} - ${currency}${salary.max.toLocaleString()}${period}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const OpportunityCard = ({ opportunity }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {opportunity.featured && (
                <StarIcon className="h-4 w-4 text-yellow-500" />
              )}
              {getStatusBadge(opportunity.status)}
              {getTypeBadge(opportunity.type)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
              {opportunity.company}
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{opportunity.description}</p>
          </div>
          <div className="ml-4">
            <div className="relative">
              <button className="text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {opportunity.location}
            {opportunity.remote && <span className="ml-2 text-green-600">(Remoto)</span>}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CurrencyPoundIcon className="h-4 w-4 mr-2" />
            {formatSalary(opportunity.salary, opportunity.type)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            {getExperienceBadge(opportunity.experience)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {opportunity.applications} candidaturas • {opportunity.views} visualizações
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleStatusChange(opportunity.id, opportunity.status === 'active' ? 'paused' : 'active')}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              title={opportunity.status === 'active' ? 'Pausar' : 'Ativar'}
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDuplicateOpportunity(opportunity.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md"
              title="Duplicar"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDeleteOpportunity(opportunity.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="Deletar"
            >
              <TrashIcon className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Oportunidades</h1>
          <p className="mt-2 text-sm text-gray-700">
            Publique e gerencie oportunidades de emprego para a comunidade
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExportOpportunities}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Exportar
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Criar Oportunidade
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Oportunidades</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ativas</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Em Destaque</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.featured}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Visualizações</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalViews}</dd>
                </dl>
              </div>
            </div>
          </div>
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
                  placeholder="Pesquisar oportunidades..."
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativas</option>
                    <option value="paused">Pausadas</option>
                    <option value="expired">Expiradas</option>
                    <option value="draft">Rascunhos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos</option>
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Localização</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todas</option>
                    <option value="Londres">Londres</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Liverpool">Liverpool</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opportunities Grid/List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Oportunidades ({pagination.total})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Carregando oportunidades...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={loadOpportunities}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Tentar Novamente
              </button>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma oportunidade encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova oportunidade de emprego.
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {opportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Oportunidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empresa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localização
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidaturas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {opportunities.map((opportunity) => (
                        <tr key={opportunity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {opportunity.featured && (
                                <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {opportunity.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {getExperienceBadge(opportunity.experience)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {opportunity.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {opportunity.location}
                            {opportunity.remote && (
                              <div className="text-xs text-green-600">Remoto</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTypeBadge(opportunity.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatSalary(opportunity.salary, opportunity.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(opportunity.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {opportunity.applications}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleStatusChange(opportunity.id, opportunity.status === 'active' ? 'paused' : 'active')}
                                className="text-indigo-600 hover:text-indigo-900"
                                title={opportunity.status === 'active' ? 'Pausar' : 'Ativar'}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDuplicateOpportunity(opportunity.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Duplicar"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteOpportunity(opportunity.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Deletar"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>
                        {' '}a{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          const isCurrentPage = pageNumber === pagination.page;
                          
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  isCurrentPage
                                    ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === pagination.page - 2 ||
                            pageNumber === pagination.page + 2
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próximo
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesManagement;