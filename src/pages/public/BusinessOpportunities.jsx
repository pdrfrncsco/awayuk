import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  ClockIcon,
  UserGroupIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  ShareIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const BusinessOpportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedLocation, setSelectedLocation] = useState('todas');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Mock data para oportunidades
  const opportunities = [
    {
      id: 1,
      title: 'Desenvolvedor Full Stack',
      type: 'emprego',
      company: 'TechAngola UK',
      location: 'Londres',
      area: 'tecnologia',
      level: 'senior',
      salary: '£45,000 - £65,000',
      workType: 'Híbrido',
      description: 'Procuramos um desenvolvedor experiente para integrar nossa equipe em Londres. Experiência com React, Node.js e bases de dados.',
      requirements: ['3+ anos de experiência', 'React/Node.js', 'Inglês fluente'],
      benefits: ['Seguro de saúde', 'Férias flexíveis', 'Trabalho remoto'],
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      contact: {
        email: 'rh@techangola.co.uk',
        phone: '+44 20 1234 5678',
        person: 'Maria Santos'
      },
      logo: '/api/placeholder/80/80'
    },
    {
      id: 2,
      title: 'Estágio em Marketing Digital',
      type: 'estagio',
      company: 'Angola Business Network',
      location: 'Manchester',
      area: 'marketing',
      level: 'junior',
      salary: '£18,000 - £22,000',
      workType: 'Presencial',
      description: 'Oportunidade de estágio para estudantes ou recém-formados interessados em marketing digital e comunicação.',
      requirements: ['Formação em Marketing/Comunicação', 'Conhecimentos básicos de redes sociais', 'Português e Inglês'],
      benefits: ['Formação contínua', 'Mentoria', 'Certificações'],
      postedDate: '2024-01-10',
      deadline: '2024-02-10',
      contact: {
        email: 'estagios@abn.co.uk',
        phone: '+44 161 234 5678',
        person: 'João Pereira'
      },
      logo: '/api/placeholder/80/80'
    },
    {
      id: 3,
      title: 'Parceria Comercial - Importação',
      type: 'negocio',
      company: 'Angola Trade Solutions',
      location: 'Birmingham',
      area: 'comercio',
      level: 'todos',
      salary: 'A negociar',
      workType: 'Flexível',
      description: 'Procuramos parceiros para expandir negócio de importação de produtos angolanos para o Reino Unido.',
      requirements: ['Experiência em comércio', 'Rede de contactos', 'Capital inicial'],
      benefits: ['Participação nos lucros', 'Flexibilidade', 'Crescimento conjunto'],
      postedDate: '2024-01-12',
      deadline: '2024-03-12',
      contact: {
        email: 'parcerias@ats.co.uk',
        phone: '+44 121 234 5678',
        person: 'Carlos Mendes'
      },
      logo: '/api/placeholder/80/80'
    },
    {
      id: 4,
      title: 'Enfermeiro/a Registrado/a',
      type: 'emprego',
      company: 'NHS Trust London',
      location: 'Londres',
      area: 'saude',
      level: 'pleno',
      salary: '£28,000 - £35,000',
      workType: 'Presencial',
      description: 'Oportunidade para enfermeiros qualificados juntarem-se à nossa equipe multicultural no NHS.',
      requirements: ['Registo NMC', 'Experiência hospitalar', 'Inglês proficiente'],
      benefits: ['Pensão NHS', 'Desenvolvimento profissional', 'Estabilidade'],
      postedDate: '2024-01-08',
      deadline: '2024-02-08',
      contact: {
        email: 'recruitment@nhstrust.nhs.uk',
        phone: '+44 20 8765 4321',
        person: 'Ana Silva'
      },
      logo: '/api/placeholder/80/80'
    },
    {
      id: 5,
      title: 'Consultor Financeiro',
      type: 'emprego',
      company: 'Angola Financial Services',
      location: 'Edinburgh',
      area: 'financas',
      level: 'senior',
      salary: '£40,000 - £55,000',
      workType: 'Híbrido',
      description: 'Procuramos consultor financeiro para apoiar a comunidade angolana em investimentos e planeamento financeiro.',
      requirements: ['Certificação FCA', '5+ anos experiência', 'Português nativo'],
      benefits: ['Comissões atrativas', 'Formação contínua', 'Flexibilidade'],
      postedDate: '2024-01-14',
      deadline: '2024-02-20',
      contact: {
        email: 'careers@afs.co.uk',
        phone: '+44 131 234 5678',
        person: 'Pedro Costa'
      },
      logo: '/api/placeholder/80/80'
    },
    {
      id: 6,
      title: 'Franquia Restaurante Angolano',
      type: 'negocio',
      company: 'Sabores de Angola',
      location: 'Liverpool',
      area: 'restauracao',
      level: 'todos',
      salary: '£25,000 - £50,000 investimento',
      workType: 'Presencial',
      description: 'Oportunidade única de adquirir franquia de restaurante especializado em culinária angolana.',
      requirements: ['Investimento inicial', 'Experiência em restauração (preferencial)', 'Dedicação integral'],
      benefits: ['Marca estabelecida', 'Formação completa', 'Suporte contínuo'],
      postedDate: '2024-01-11',
      deadline: '2024-04-11',
      contact: {
        email: 'franquias@saboresangola.co.uk',
        phone: '+44 151 234 5678',
        person: 'Isabel Rodrigues'
      },
      logo: '/api/placeholder/80/80'
    }
  ];

  const typeOptions = [
    { value: 'todos', label: 'Todos os Tipos' },
    { value: 'emprego', label: 'Empregos' },
    { value: 'estagio', label: 'Estágios' },
    { value: 'negocio', label: 'Oportunidades de Negócio' }
  ];

  const locationOptions = [
    { value: 'todas', label: 'Todas as Localizações' },
    { value: 'Londres', label: 'Londres' },
    { value: 'Manchester', label: 'Manchester' },
    { value: 'Birmingham', label: 'Birmingham' },
    { value: 'Edinburgh', label: 'Edinburgh' },
    { value: 'Liverpool', label: 'Liverpool' },
    { value: 'Leeds', label: 'Leeds' },
    { value: 'Glasgow', label: 'Glasgow' }
  ];

  const areaOptions = [
    { value: 'todas', label: 'Todas as Áreas' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'comercio', label: 'Comércio' },
    { value: 'saude', label: 'Saúde' },
    { value: 'financas', label: 'Finanças' },
    { value: 'restauracao', label: 'Restauração' },
    { value: 'educacao', label: 'Educação' },
    { value: 'construcao', label: 'Construção' }
  ];

  const levelOptions = [
    { value: 'todos', label: 'Todos os Níveis' },
    { value: 'junior', label: 'Júnior' },
    { value: 'pleno', label: 'Pleno' },
    { value: 'senior', label: 'Sénior' }
  ];

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || opportunity.type === selectedType;
    const matchesLocation = selectedLocation === 'todas' || opportunity.location === selectedLocation;
    const matchesArea = selectedArea === 'todas' || opportunity.area === selectedArea;
    const matchesLevel = selectedLevel === 'todos' || opportunity.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesLocation && matchesArea && matchesLevel;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emprego':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'estagio':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'negocio':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      default:
        return <BriefcaseIcon className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'emprego':
        return 'Emprego';
      case 'estagio':
        return 'Estágio';
      case 'negocio':
        return 'Negócio';
      default:
        return 'Oportunidade';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const OpportunityCard = ({ opportunity, isListView = false }) => (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      isListView ? 'flex' : ''
    }`}>
      {/* Imagem/Logo */}
      <div className={`${isListView ? 'w-24 h-24 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center`}>
        <img 
          src={opportunity.logo} 
          alt={opportunity.company}
          className="w-16 h-16 object-cover rounded-lg bg-white p-2"
        />
      </div>
      
      {/* Conteúdo */}
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                opportunity.type === 'emprego' ? 'bg-blue-100 text-blue-800' :
                opportunity.type === 'estagio' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {getTypeIcon(opportunity.type)}
                {getTypeLabel(opportunity.type)}
              </span>
              <span className="text-xs text-gray-500">
                Publicado em {formatDate(opportunity.postedDate)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{opportunity.title}</h3>
            <p className="text-gray-600 font-medium">{opportunity.company}</p>
          </div>
          <button
            onClick={() => toggleFavorite(opportunity.id)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {favorites.has(opportunity.id) ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CurrencyPoundIcon className="h-4 w-4" />
            <span>{opportunity.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{opportunity.workType}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {req}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Prazo: {formatDate(opportunity.deadline)}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/oportunidade/${opportunity.id}`}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section>
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Negócios & Oportunidades</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Acesso exclusivo a vagas de emprego, estágios e oportunidades de negócio dentro da comunidade angolana no Reino Unido
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Filtros e Pesquisa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Barra de Pesquisa */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar oportunidades, empresas ou palavras-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          {/* Botão de Filtros Mobile */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              Filtros
            </button>
          </div>
          
          {/* Filtros */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {locationOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {areaOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {levelOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Controles de Visualização e Resultados */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            <span className="font-medium">{filteredOpportunities.length}</span> oportunidades encontradas
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Lista de Oportunidades */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma oportunidade encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de pesquisa.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
            'space-y-4'
          }>
            {filteredOpportunities.map(opportunity => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity} 
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOpportunities;