import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import opportunityService from '../../services/opportunityService';

const OpportunityList = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [opportunities, setOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false
  });

  // Filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    experience_level: searchParams.get('experience_level') || '',
    work_type: searchParams.get('work_type') || '',
    salary_min: searchParams.get('salary_min') || '',
    salary_max: searchParams.get('salary_max') || '',
    ordering: searchParams.get('ordering') || '-created_at'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOpportunities();
    loadCategories();
  }, [searchParams]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const page = parseInt(searchParams.get('page')) || 1;
      const params = {
        page,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };

      const response = await opportunityService.getOpportunities(params);
      setOpportunities(response.results || response.data || []);
      setPagination({
        page: response.page || 1,
        totalPages: response.total_pages || 1,
        totalItems: response.count || 0,
        hasNext: response.next !== null,
        hasPrevious: response.previous !== null
      });
    } catch (err) {
      setError(err.message || 'Erro ao carregar oportunidades');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await opportunityService.getCategories();
      setCategories(response.results || response.data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Atualizar URL
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newParams.set(key, val);
    });
    newParams.set('page', '1'); // Reset para primeira página
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      location: '',
      experience_level: '',
      work_type: '',
      salary_min: '',
      salary_max: '',
      ordering: '-created_at'
    });
    setSearchParams({});
  };

  const formatSalary = (min, max, currency = 'EUR') => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `A partir de ${symbol}${min.toLocaleString()}`;
    } else if (max) {
      return `Até ${symbol}${max.toLocaleString()}`;
    }
    return 'Salário a negociar';
  };

  const getTypeIcon = (type) => {
    const icons = {
      job: 'fas fa-briefcase',
      internship: 'fas fa-graduation-cap',
      freelance: 'fas fa-laptop',
      partnership: 'fas fa-handshake',
      investment: 'fas fa-chart-line',
      collaboration: 'fas fa-users',
      mentorship: 'fas fa-user-tie',
      volunteer: 'fas fa-heart'
    };
    return icons[type] || 'fas fa-briefcase';
  };

  const getTypeLabel = (type) => {
    const labels = {
      job: 'Emprego',
      internship: 'Estágio',
      freelance: 'Freelance',
      partnership: 'Parceria',
      investment: 'Investimento',
      collaboration: 'Colaboração',
      mentorship: 'Mentoria',
      volunteer: 'Voluntariado'
    };
    return labels[type] || type;
  };

  const getExperienceLabel = (level) => {
    const labels = {
      entry: 'Iniciante',
      junior: 'Júnior',
      mid: 'Intermédio',
      senior: 'Sénior',
      executive: 'Executivo'
    };
    return labels[level] || level;
  };

  const getWorkTypeLabel = (type) => {
    const labels = {
      remote: 'Remoto',
      onsite: 'Presencial',
      hybrid: 'Híbrido'
    };
    return labels[type] || type;
  };

  const opportunityTypes = [
    { value: 'job', label: 'Emprego' },
    { value: 'internship', label: 'Estágio' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'partnership', label: 'Parceria' },
    { value: 'investment', label: 'Investimento' },
    { value: 'collaboration', label: 'Colaboração' },
    { value: 'mentorship', label: 'Mentoria' },
    { value: 'volunteer', label: 'Voluntariado' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Iniciante' },
    { value: 'junior', label: 'Júnior' },
    { value: 'mid', label: 'Intermédio' },
    { value: 'senior', label: 'Sénior' },
    { value: 'executive', label: 'Executivo' }
  ];

  const workTypes = [
    { value: 'remote', label: 'Remoto' },
    { value: 'onsite', label: 'Presencial' },
    { value: 'hybrid', label: 'Híbrido' }
  ];

  const sortOptions = [
    { value: '-created_at', label: 'Mais recentes' },
    { value: 'created_at', label: 'Mais antigas' },
    { value: '-salary_max', label: 'Maior salário' },
    { value: 'salary_min', label: 'Menor salário' },
    { value: 'title', label: 'Título A-Z' },
    { value: '-title', label: 'Título Z-A' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Oportunidades de Negócio
              </h1>
              <p className="text-gray-600">
                Descubra oportunidades de emprego, parcerias e investimentos na comunidade AwaysUK
              </p>
            </div>
            {isAuthenticated && (
              <div className="mt-4 md:mt-0">
                <Link
                  to="/criar-oportunidade"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 transition duration-300"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Criar Oportunidade
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Pesquisa */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar oportunidades..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                {opportunityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.work_type}
                onChange={(e) => handleFilterChange('work_type', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Modalidade</option>
                {workTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
              >
                <i className="fas fa-filter mr-2"></i>
                Filtros
              </button>
            </div>
          </div>

          {/* Filtros avançados */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Londres, Manchester..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experiência
                  </label>
                  <select
                    value={filters.experience_level}
                    onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos os níveis</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={filters.ordering}
                    onChange={(e) => handleFilterChange('ordering', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salário mínimo (€)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 30000"
                    value={filters.salary_min}
                    onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salário máximo (€)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 60000"
                    value={filters.salary_max}
                    onChange={(e) => handleFilterChange('salary_max', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {pagination.totalItems} oportunidade{pagination.totalItems !== 1 ? 's' : ''} encontrada{pagination.totalItems !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de oportunidades */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma oportunidade encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou pesquisar por outros termos.
            </p>
            {isAuthenticated && (
              <Link
                to="/criar-oportunidade"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 transition duration-300"
              >
                <i className="fas fa-plus mr-2"></i>
                Criar primeira oportunidade
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {opportunities.map(opportunity => (
                <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {opportunity.company_logo ? (
                            <img
                              src={opportunity.company_logo}
                              alt={opportunity.company_name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                              <i className={`${getTypeIcon(opportunity.type)} text-white`}></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {opportunity.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {opportunity.company_name}
                          </p>
                        </div>
                      </div>
                      
                      {opportunity.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {getTypeLabel(opportunity.type)}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        {getWorkTypeLabel(opportunity.work_type)}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {getExperienceLabel(opportunity.experience_level)}
                      </span>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                      <span className="text-sm">
                        {opportunity.location_city}, {opportunity.location_country}
                      </span>
                    </div>

                    {/* Salário */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <i className="fas fa-euro-sign mr-2 text-red-500"></i>
                      <span className="text-sm font-medium">
                        {formatSalary(opportunity.salary_min, opportunity.salary_max, opportunity.salary_currency)}
                      </span>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <i className="fas fa-clock mr-1"></i>
                        <span>
                          {new Date(opportunity.created_at).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                      
                      <Link
                        to={`/oportunidades/${opportunity.slug}`}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white text-sm rounded-md hover:opacity-90 transition duration-300"
                      >
                        Ver detalhes
                        <i className="fas fa-arrow-right ml-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md transition duration-300 ${
                      page === pagination.page
                        ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-transparent'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OpportunityList;