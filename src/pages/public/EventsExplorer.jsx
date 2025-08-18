import { useState } from 'react';
import { Link } from 'react-router-dom';

const EventsExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock data - em produção viria de uma API
  const events = [
    {
      id: 1,
      title: "Festival de Cultura Angolana",
      description: "Celebração da rica cultura angolana com música, dança, gastronomia e artesanato tradicional.",
      date: "2024-03-15",
      time: "14:00",
      endTime: "22:00",
      location: "Londres",
      venue: "Southbank Centre",
      address: "Belvedere Rd, South Bank, London SE1 8XX",
      category: "Cultural",
      image: "https://picsum.photos/400/250?random=50",
      organizer: "Associação Cultural Angola UK",
      price: "Gratuito",
      capacity: 500,
      registered: 234,
      featured: true,
      tags: ["Música", "Dança", "Gastronomia", "Família"]
    },
    {
      id: 2,
      title: "Networking Empresarial Angolano",
      description: "Encontro mensal para empresários e profissionais angolanos expandirem suas redes de contacto.",
      date: "2024-03-20",
      time: "18:30",
      endTime: "21:00",
      location: "Manchester",
      venue: "Manchester Business Centre",
      address: "46 Deansgate, Manchester M3 2FN",
      category: "Negócios",
      image: "https://picsum.photos/400/250?random=51",
      organizer: "Angola Business Network",
      price: "£15",
      capacity: 80,
      registered: 45,
      featured: false,
      tags: ["Networking", "Negócios", "Profissional"]
    },
    {
      id: 3,
      title: "Workshop de Culinária Angolana",
      description: "Aprenda a preparar pratos tradicionais angolanos com chefs especializados.",
      date: "2024-03-25",
      time: "10:00",
      endTime: "15:00",
      location: "Birmingham",
      venue: "Birmingham Cookery School",
      address: "25 Frederick St, Birmingham B1 3HH",
      category: "Educacional",
      image: "https://picsum.photos/400/250?random=52",
      organizer: "Chef Luísa Domingos",
      price: "£45",
      capacity: 20,
      registered: 18,
      featured: true,
      tags: ["Culinária", "Workshop", "Tradicional"]
    },
    {
      id: 4,
      title: "Noite de Kizomba e Semba",
      description: "Noite de dança com os melhores DJs de música angolana e aulas para iniciantes.",
      date: "2024-03-30",
      time: "20:00",
      endTime: "02:00",
      location: "Londres",
      venue: "The Scala",
      address: "275 Pentonville Rd, Kings Cross, London N1 9NL",
      category: "Entretenimento",
      image: "https://picsum.photos/400/250?random=53",
      organizer: "Kizomba London",
      price: "£20",
      capacity: 300,
      registered: 156,
      featured: false,
      tags: ["Dança", "Música", "Noite", "Kizomba"]
    },
    {
      id: 5,
      title: "Conferência de Empreendedorismo",
      description: "Palestras e painéis sobre empreendedorismo na comunidade angolana no Reino Unido.",
      date: "2024-04-05",
      time: "09:00",
      endTime: "17:00",
      location: "Edimburgo",
      venue: "Edinburgh International Conference Centre",
      address: "The Exchange, 150 Morrison St, Edinburgh EH3 8EE",
      category: "Negócios",
      image: "https://picsum.photos/400/250?random=54",
      organizer: "Angola Entrepreneurs UK",
      price: "£35",
      capacity: 150,
      registered: 89,
      featured: true,
      tags: ["Empreendedorismo", "Palestras", "Negócios"]
    },
    {
      id: 6,
      title: "Torneio de Futebol da Comunidade",
      description: "Torneio amigável de futebol entre equipas da comunidade angolana.",
      date: "2024-04-10",
      time: "10:00",
      endTime: "18:00",
      location: "Liverpool",
      venue: "Greenbank Sports Academy",
      address: "Greenbank Ln, Liverpool L17 1AG",
      category: "Desporto",
      image: "https://picsum.photos/400/250?random=55",
      organizer: "Angola FC Liverpool",
      price: "Gratuito",
      capacity: 200,
      registered: 67,
      featured: false,
      tags: ["Futebol", "Desporto", "Comunidade"]
    }
  ];

  const locations = [...new Set(events.map(event => event.location))];
  const categories = [...new Set(events.map(event => event.category))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || event.location === selectedLocation;
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesDate = !selectedDate || event.date >= selectedDate;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesDate;
  });

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
              to={`/evento/${event.id}`}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-3 rounded text-sm hover:opacity-90 transition-opacity text-center"
            >
              <i className="fas fa-eye mr-1"></i>
              Ver Detalhes
            </Link>
            <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
              <i className="fas fa-share-alt"></i>
            </button>
            <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
              <i className="fas fa-heart"></i>
            </button>
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
                  to={`/evento/${event.id}`}
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-4 rounded text-sm hover:opacity-90 transition-opacity text-center"
                >
                  <i className="fas fa-eye mr-1"></i>
                  Ver Detalhes
                </Link>
                <div className="flex gap-1">
                  <button className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-200 transition-colors">
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-200 transition-colors">
                    <i className="fas fa-heart"></i>
                  </button>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('');
                setSelectedCategory('');
                setSelectedDate('');
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredEvents.length === 0 ? (
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
            {filteredEvents.map(event => 
              viewMode === 'grid' 
                ? <EventCard key={event.id} event={event} />
                : <EventListItem key={event.id} event={event} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsExplorer;