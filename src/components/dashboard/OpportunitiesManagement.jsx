import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import VisitorAction from '../common/VisitorAction';
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

  // Carregar oportunidades com filtros e paginação
  const loadOpportunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : null,
        type: filterType !== 'all' ? filterType : null,
        location: filterLocation !== 'all' ? filterLocation : null
      };
      
      const response = await services.opportunities.getOpportunities(
        filters,
        pagination.page,
        pagination.limit
      );
      
      setOpportunities(response.results);
      setPagination(prev => ({
        ...prev,
        total: response.count,
        totalPages: Math.ceil(response.count / prev.limit)
      }));
      
      // Carregar estatísticas
      const statsData = await services.opportunities.getOpportunityStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
      setError('Não foi possível carregar as oportunidades. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar tipos de trabalho
  const loadJobTypes = async () => {
    try {
      const types = await services.opportunities.getJobTypes();
      setJobTypes(types);
    } catch (err) {
      console.error('Erro ao carregar tipos de trabalho:', err);
    }
  };

  // Carregar localizações
  const loadLocations = async () => {
    try {
      const locs = await services.opportunities.getLocations();
      setLocations(locs);
    } catch (err) {
      console.error('Erro ao carregar localizações:', err);
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadOpportunities();
    loadJobTypes();
    loadLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efeito para recarregar quando filtros ou paginação mudam
  useEffect(() => {
    loadOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterType, filterLocation, pagination.page, pagination.limit]);

  // Função para lidar com a pesquisa
  const handleSearch = (e) => {
    e.preventDefault();
    loadOpportunities();
  };

  // Função para alternar o status de uma oportunidade
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await services.opportunities.updateOpportunityStatus(id, newStatus);
      
      // Atualizar a lista de oportunidades
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id ? { ...opp, status: newStatus } : opp
        )
      );
      
      // Recarregar estatísticas
      const statsData = await services.opportunities.getOpportunityStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  // Função para alternar destaque
  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await services.opportunities.toggleFeatured(id, !currentFeatured);
      
      // Atualizar a lista de oportunidades
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id ? { ...opp, featured: !opp.featured } : opp
        )
      );
      
      // Recarregar estatísticas
      const statsData = await services.opportunities.getOpportunityStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao alterar destaque:', err);
    }
  };

  // Função para excluir oportunidade
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      try {
        await services.opportunities.deleteOpportunity(id);
        
        // Remover da lista
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        
        // Atualizar contagem total
        setPagination(prev => {
          const newTotal = prev.total - 1;
          return {
            ...prev,
            total: newTotal,
            totalPages: Math.ceil(newTotal / prev.limit)
          };
        });
        
        // Recarregar estatísticas
        const statsData = await services.opportunities.getOpportunityStats();
        setStats(statsData);
      } catch (err) {
        console.error('Erro ao excluir oportunidade:', err);
      }
    }
  };

  // Função para duplicar oportunidade
  const handleDuplicate = async (id) => {
    try {
      const newOpportunity = await services.opportunities.duplicateOpportunity(id);
      
      // Adicionar à lista se estiver na primeira página
      if (pagination.page === 1) {
        setOpportunities(prev => [newOpportunity, ...prev]);
      } else {
        // Se não estiver na primeira página, apenas atualizar a contagem
        setPagination(prev => {
          const newTotal = prev.total + 1;
          return {
            ...prev,
            total: newTotal,
            totalPages: Math.ceil(newTotal / prev.limit)
          };
        });
      }
      
      // Recarregar estatísticas
      const statsData = await services.opportunities.getOpportunityStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao duplicar oportunidade:', err);
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

  // Função para formatar salário
  const formatSalary = (salary, type) => {
    if (!salary || (!salary.min && !salary.max)) {
      return 'A combinar';
    }
    
    const formatValue = (value) => {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
      }).format(value);
    };
    
    if (type === 'freelance' || type === 'contract') {
      // Para freelance/contrato, mostrar valor por hora/dia
      if (salary.min && salary.max) {
        return `${formatValue(salary.min)} - ${formatValue(salary.max)} por hora`;
      } else if (salary.min) {
        return `${formatValue(salary.min)}+ por hora`;
      } else {
        return `Até ${formatValue(salary.max)} por hora`;
      }
    } else {
      // Para outros tipos, mostrar salário anual
      if (salary.min && salary.max) {
        return `${formatValue(salary.min)} - ${formatValue(salary.max)} por ano`;
      } else if (salary.min) {
        return `${formatValue(salary.min)}+ por ano`;
      } else {
        return `Até ${formatValue(salary.max)} por ano`;
      }
    }
  };

  // Função para obter badge de status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Ativa
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pausada
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Encerrada
          </span>
        );
      default:
        return null;
    }
  };

  // Função para obter badge de tipo
  const getTypeBadge = (type) => {
    switch (type) {
      case 'full-time':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Tempo Integral
          </span>
        );
      case 'part-time':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Meio Período
          </span>
        );
      case 'contract':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Contrato
          </span>
        );
      case 'freelance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            Freelance
          </span>
        );
      case 'internship':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
            Estágio
          </span>
        );
      default:
        return null;
    }
  };

  // Função para obter badge de experiência
  const getExperienceBadge = (experience) => {
    const expInfo = experienceLevels[experience] || { label: 'N/A', color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expInfo.color}`}>
        {expInfo.label}
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

  const OpportunityCard = ({ opportunity }) => {
    // Importar hooks necessários
    const { isAuthenticated, user } = useAuth();
    
    // Verificar se o usuário é membro
    const isMember = user?.onboarding_completed || false;
    
    // Função para lidar com a candidatura
    const handleApply = () => {
      services.opportunities.applyToOpportunity(opportunity.id)
        .then(() => {
          // Atualizar a contagem de candidaturas
          loadOpportunities();
        })
        .catch(error => {
          console.error('Erro ao candidatar-se:', error);
        });
    };
    
    return (
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
            {/* Botão de candidatura com VisitorAction */}
            <VisitorAction
              actionType="opportunity-application"
              isAuthenticated={isAuthenticated}
              isMember={isMember}
              buttonText="Candidatar-se"
              buttonClassName="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onAction={() => handleApply()}
            />
            <button 
              onClick={() => handleStatusChange(opportunity.id, opportunity.status)}
              className="text-gray-400 hover:text-gray-600"
              title={opportunity.status === 'active' ? 'Pausar' : 'Ativar'}
            >
              {opportunity.status === 'active' ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={() => handleToggleFeatured(opportunity.id, opportunity.featured)}
              className={`${opportunity.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
              title={opportunity.featured ? 'Remover destaque' : 'Destacar'}
            >
              <StarIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleDuplicate(opportunity.id)}
              className="text-gray-400 hover:text-gray-600"
              title="Duplicar"
            >
              <DocumentDuplicateIcon className="h-5 w-5" />
            </button>
            <Link 
              to={`/dashboard/oportunidades/editar/${opportunity.id}`}
              className="text-gray-400 hover:text-gray-600"
              title="Editar"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => handleDelete(opportunity.id)}
              className="text-gray-400 hover:text-red-600"
              title="Excluir"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestão de Oportunidades</h1>
          <div className="mt-4 md:mt-0">
            <Link
              to="/dashboard/oportunidades/nova"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nova Oportunidade
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Visualizações</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalViews}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Buscar oportunidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Buscar
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                  Filtros
                </button>
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <ViewGridIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <ViewListIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </form>

            {/* Filtros expandidos */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="filter-status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativas</option>
                    <option value="paused">Pausadas</option>
                    <option value="closed">Encerradas</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    id="filter-type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-location" className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <select
                    id="filter-location"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="all">Todas</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
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
                                  onClick={() => handleStatusChange(opportunity.id, opportunity.status)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title={opportunity.status === 'active' ? 'Pausar' : 'Ativar'}
                                >
                                  {opportunity.status === 'active' ? (
                                    <PauseIcon className="h-5 w-5" />
                                  ) : (
                                    <PlayIcon className="h-5 w-5" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleToggleFeatured(opportunity.id, opportunity.featured)}
                                  className={`${opportunity.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                                  title={opportunity.featured ? 'Remover destaque' : 'Destacar'}
                                >
                                  <StarIcon className="h-5 w-5" />
                                </button>
                                <button 
                                  onClick={() => handleDuplicate(opportunity.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Duplicar"
                                >
                                  <DocumentDuplicateIcon className="h-5 w-5" />
                                </button>
                                <Link 
                                  to={`/dashboard/oportunidades/editar/${opportunity.id}`}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Editar"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </Link>
                                <button 
                                  onClick={() => handleDelete(opportunity.id)}
                                  className="text-gray-400 hover:text-red-600"
                                  title="Excluir"
                                >
                                  <TrashIcon className="h-5 w-5" />
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
    </div>
  );
};

export default OpportunitiesManagement;