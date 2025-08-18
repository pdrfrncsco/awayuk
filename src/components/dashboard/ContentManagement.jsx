import React, { useState } from 'react';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data - em produção viria de uma API
  const contents = [
    {
      id: 1,
      title: 'Guia Completo: Como Encontrar Emprego no Reino Unido',
      type: 'article',
      category: 'emprego',
      status: 'published',
      author: 'Maria Silva',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Um guia abrangente com dicas práticas para angolanos que procuram oportunidades de trabalho no Reino Unido.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: '2024-12-10',
      lastModified: '2024-12-12',
      views: 1250,
      likes: 89,
      comments: 23,
      shares: 15,
      tags: ['emprego', 'cv', 'entrevista', 'networking'],
      featured: true,
      readTime: 8
    },
    {
      id: 2,
      title: 'Evento Cultural: Noite Angolana em Londres',
      type: 'event',
      category: 'cultura',
      status: 'published',
      author: 'João Santos',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Junte-se a nós para uma noite especial celebrando a cultura angolana no coração de Londres.',
      content: 'Evento especial com música, dança e gastronomia angolana...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: '2024-12-08',
      lastModified: '2024-12-08',
      views: 890,
      likes: 156,
      comments: 45,
      shares: 32,
      tags: ['cultura', 'música', 'dança', 'gastronomia'],
      featured: false,
      eventDate: '2024-12-20'
    },
    {
      id: 3,
      title: 'Dicas de Integração: Sistema de Saúde Britânico (NHS)',
      type: 'guide',
      category: 'integracao',
      status: 'draft',
      author: 'Ana Costa',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Tudo o que precisa saber sobre como aceder e utilizar o sistema de saúde no Reino Unido.',
      content: 'O NHS (National Health Service) é o sistema de saúde público...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: null,
      lastModified: '2024-12-11',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      tags: ['saúde', 'nhs', 'integração', 'serviços'],
      featured: false,
      readTime: 12
    },
    {
      id: 4,
      title: 'Vídeo: Testemunho de Sucesso - Engenheiro em Manchester',
      type: 'video',
      category: 'testemunhos',
      status: 'published',
      author: 'Pedro Mendes',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Conheça a história inspiradora de Carlos, engenheiro angolano que construiu uma carreira de sucesso em Manchester.',
      content: 'Vídeo entrevista com Carlos sobre sua jornada...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: '2024-12-05',
      lastModified: '2024-12-05',
      views: 2100,
      likes: 234,
      comments: 67,
      shares: 89,
      tags: ['testemunho', 'engenharia', 'sucesso', 'manchester'],
      featured: true,
      duration: '15:30'
    },
    {
      id: 5,
      title: 'Oportunidades de Bolsas de Estudo para 2025',
      type: 'news',
      category: 'educacao',
      status: 'scheduled',
      author: 'Luisa Fernandes',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Lista atualizada de bolsas de estudo disponíveis para estudantes angolanos no Reino Unido.',
      content: 'Compilação das principais oportunidades de bolsas...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: '2024-12-15',
      lastModified: '2024-12-10',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      tags: ['educação', 'bolsas', 'universidade', 'estudos'],
      featured: false,
      readTime: 6
    },
    {
      id: 6,
      title: 'Galeria: Festa da Independência de Angola 2024',
      type: 'gallery',
      category: 'eventos',
      status: 'published',
      author: 'Rita Oliveira',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Momentos especiais da celebração do Dia da Independência de Angola em Londres.',
      content: 'Galeria de fotos do evento comemorativo...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: '2024-11-11',
      lastModified: '2024-11-12',
      views: 1580,
      likes: 298,
      comments: 89,
      shares: 156,
      tags: ['independência', 'angola', 'celebração', 'comunidade'],
      featured: false,
      photoCount: 45
    }
  ];

  const contentTypes = [
    { value: 'article', label: 'Artigo', icon: DocumentTextIcon },
    { value: 'video', label: 'Vídeo', icon: VideoCameraIcon },
    { value: 'gallery', label: 'Galeria', icon: PhotoIcon },
    { value: 'guide', label: 'Guia', icon: DocumentTextIcon },
    { value: 'news', label: 'Notícia', icon: DocumentTextIcon },
    { value: 'event', label: 'Evento', icon: CalendarIcon }
  ];

  const categories = [
    { value: 'emprego', label: 'Emprego' },
    { value: 'cultura', label: 'Cultura' },
    { value: 'integracao', label: 'Integração' },
    { value: 'educacao', label: 'Educação' },
    { value: 'testemunhos', label: 'Testemunhos' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'noticias', label: 'Notícias' }
  ];

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesCategory = filterCategory === 'all' || content.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Publicado' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Arquivado' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeData = contentTypes.find(t => t.value === type);
    const IconComponent = typeData?.icon || DocumentTextIcon;
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <IconComponent className="h-3 w-3 mr-1" />
        {typeData?.label || type}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não publicado';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const ContentCard = ({ content }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={content.featuredImage}
          alt={content.title}
          className="w-full h-48 object-cover"
        />
        {content.featured && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Destaque
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getStatusBadge(content.status)}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          {getTypeBadge(content.type)}
          <span className="text-xs text-gray-500">
            {categories.find(c => c.value === content.category)?.label}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {content.excerpt}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <UserIcon className="h-4 w-4 mr-1" />
          <span className="mr-4">{content.author}</span>
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formatDate(content.publishedDate)}</span>
          {content.readTime && (
            <>
              <ClockIcon className="h-4 w-4 ml-4 mr-1" />
              <span>{content.readTime} min</span>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {formatNumber(content.views)}
            </div>
            <div className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-1" />
              {formatNumber(content.likes)}
            </div>
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
              {formatNumber(content.comments)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
              <EyeIcon className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
              <PencilIcon className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md">
              <EllipsisVerticalIcon className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Conteúdos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Crie e gerencie artigos, vídeos e outros conteúdos para a comunidade
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PhotoIcon className="-ml-1 mr-2 h-5 w-5" />
            Galeria
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Criar Conteúdo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Conteúdos</dt>
                  <dd className="text-lg font-medium text-gray-900">{contents.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Publicados</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contents.filter(c => c.status === 'published').length}
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
                <HeartIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Likes</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contents.reduce((sum, c) => sum + c.likes, 0)}
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
                <ChatBubbleLeftIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Comentários</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {contents.reduce((sum, c) => sum + c.comments, 0)}
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
                  placeholder="Pesquisar conteúdos..."
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
                    <option value="published">Publicados</option>
                    <option value="draft">Rascunhos</option>
                    <option value="scheduled">Agendados</option>
                    <option value="archived">Arquivados</option>
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
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
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

      {/* Content Grid/List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Conteúdos ({filteredContents.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conteúdo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engajamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContents.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={content.featuredImage}
                            alt={content.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {content.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getTypeBadge(content.type)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{content.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {categories.find(c => c.value === content.category)?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(content.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatNumber(content.views)} visualizações
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(content.likes)} likes • {formatNumber(content.comments)} comentários
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(content.publishedDate)}
                        </div>
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

          {filteredContents.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum conteúdo encontrado</h3>
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

export default ContentManagement;