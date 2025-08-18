import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data - em produção viria de uma API
  const opportunities = [
    {
      id: 1,
      title: 'Desenvolvedor Frontend React',
      company: 'TechCorp Solutions',
      location: 'Londres',
      type: 'full-time',
      salary: { min: 45000, max: 65000 },
      experience: 'mid-level',
      status: 'active',
      description: 'Procuramos um desenvolvedor React experiente para se juntar à nossa equipa dinâmica.',
      requirements: ['React', 'TypeScript', 'Node.js', 'Git'],
      benefits: ['Seguro de saúde', 'Trabalho remoto', 'Formação contínua'],
      postedDate: '2024-12-10',
      expiryDate: '2025-01-10',
      applications: 23,
      views: 156,
      featured: true,
      remote: true
    },
    {
      id: 2,
      title: 'Gestor de Projetos',
      company: 'Business Dynamics Ltd',
      location: 'Manchester',
      type: 'full-time',
      salary: { min: 50000, max: 70000 },
      experience: 'senior',
      status: 'active',
      description: 'Oportunidade para liderar projetos estratégicos numa empresa em crescimento.',
      requirements: ['PMP', 'Agile', 'Scrum', 'Liderança'],
      benefits: ['Bónus anual', 'Carro da empresa', 'Plano de pensões'],
      postedDate: '2024-12-08',
      expiryDate: '2025-01-08',
      applications: 15,
      views: 89,
      featured: false,
      remote: false
    },
    {
      id: 3,
      title: 'Designer UX/UI',
      company: 'Creative Studio',
      location: 'Birmingham',
      type: 'contract',
      salary: { min: 300, max: 450 },
      experience: 'mid-level',
      status: 'paused',
      description: 'Contrato de 6 meses para redesign de plataforma digital.',
      requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      benefits: ['Horário flexível', 'Equipamento fornecido'],
      postedDate: '2024-12-05',
      expiryDate: '2024-12-25',
      applications: 8,
      views: 45,
      featured: false,
      remote: true
    },
    {
      id: 4,
      title: 'Analista Financeiro',
      company: 'Finance Plus',
      location: 'Edinburgh',
      type: 'part-time',
      salary: { min: 25000, max: 35000 },
      experience: 'junior',
      status: 'expired',
      description: 'Posição part-time ideal para recém-graduados em finanças.',
      requirements: ['Excel avançado', 'Análise financeira', 'Relatórios'],
      benefits: ['Horário flexível', 'Formação inicial'],
      postedDate: '2024-11-20',
      expiryDate: '2024-12-20',
      applications: 31,
      views: 78,
      featured: false,
      remote: false
    },
    {
      id: 5,
      title: 'Consultor de Marketing Digital',
      company: 'Digital Marketing Agency',
      location: 'Liverpool',
      type: 'freelance',
      salary: { min: 250, max: 400 },
      experience: 'senior',
      status: 'active',
      description: 'Freelancer experiente para campanhas de marketing digital.',
      requirements: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
      benefits: ['Projetos variados', 'Pagamento por projeto'],
      postedDate: '2024-12-12',
      expiryDate: '2025-01-12',
      applications: 12,
      views: 67,
      featured: true,
      remote: true
    }
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Tempo Integral' },
    { value: 'part-time', label: 'Meio Período' },
    { value: 'contract', label: 'Contrato' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Estágio' }
  ];

  const experienceLevels = {
    'junior': { label: 'Júnior', color: 'bg-green-100 text-green-800' },
    'mid-level': { label: 'Pleno', color: 'bg-blue-100 text-blue-800' },
    'senior': { label: 'Sénior', color: 'bg-purple-100 text-purple-800' }
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || opportunity.status === filterStatus;
    const matchesType = filterType === 'all' || opportunity.type === filterType;
    const matchesLocation = filterLocation === 'all' || opportunity.location === filterLocation;
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

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
            <button className="text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Oportunidades</h1>
          <p className="mt-2 text-sm text-gray-700">
            Publique e gerencie oportunidades de emprego para a comunidade
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
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
                  <dd className="text-lg font-medium text-gray-900">{opportunities.length}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">
                    {opportunities.filter(o => o.status === 'active').length}
                  </dd>
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
                  <dd className="text-lg font-medium text-gray-900">
                    {opportunities.filter(o => o.featured).length}
                  </dd>
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
                  <dd className="text-lg font-medium text-gray-900">
                    {opportunities.reduce((sum, o) => sum + o.views, 0)}
                  </dd>
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
              Oportunidades ({filteredOpportunities.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOpportunities.map((opportunity) => (
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
                      Salário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidaturas
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {opportunity.featured && (
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                            <div className="text-sm text-gray-500">{getTypeBadge(opportunity.type)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.location}</div>
                        {opportunity.remote && (
                          <div className="text-xs text-green-600">Remoto</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatSalary(opportunity.salary, opportunity.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(opportunity.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.applications}</div>
                        <div className="text-xs text-gray-500">{opportunity.views} visualizações</div>
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

          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma oportunidade encontrada</h3>
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

export default OpportunitiesManagement;