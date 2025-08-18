import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const eventId = parseInt(id) || 1;
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock data - em produção viria de uma API
  const events = {
    1: {
      id: 1,
      title: "Festival de Cultura Angolana",
      shortDescription: "Celebração da rica cultura angolana com música, dança, gastronomia e artesanato tradicional.",
      fullDescription: "O Festival de Cultura Angolana é um evento anual que celebra a rica herança cultural de Angola. Durante todo o dia, os visitantes poderão desfrutar de apresentações de música tradicional e contemporânea, espetáculos de dança folclórica, degustação de pratos típicos angolanos e exposição de artesanato tradicional. O evento conta com a participação de artistas renomados da comunidade angolana no Reino Unido e convidados especiais diretamente de Angola.",
      date: "2024-03-15",
      time: "14:00",
      endTime: "22:00",
      location: "Londres",
      venue: "Southbank Centre",
      address: "Belvedere Rd, South Bank, London SE1 8XX",
      category: "Cultural",
      image: "https://picsum.photos/800/400?random=50",
      organizer: {
        name: "Associação Cultural Angola UK",
        email: "info@angolauk.org",
        phone: "+44 20 7123 4567",
        website: "www.angolauk.org",
        description: "Organização dedicada à promoção da cultura angolana no Reino Unido há mais de 15 anos."
      },
      price: "Gratuito",
      capacity: 500,
      registered: 234,
      featured: true,
      tags: ["Música", "Dança", "Gastronomia", "Família", "Arte", "Tradição"],
      agenda: [
        { time: "14:00", activity: "Abertura oficial e boas-vindas" },
        { time: "14:30", activity: "Apresentação do grupo de dança Kilandukilu" },
        { time: "15:30", activity: "Exposição de artesanato tradicional" },
        { time: "16:00", activity: "Workshop de culinária angolana" },
        { time: "17:00", activity: "Concerto de música tradicional" },
        { time: "18:30", activity: "Jantar com pratos típicos" },
        { time: "20:00", activity: "Espetáculo de dança contemporânea" },
        { time: "21:00", activity: "Sessão de DJ com música angolana" },
        { time: "22:00", activity: "Encerramento" }
      ],
      requirements: [
        "Entrada gratuita, mas inscrição obrigatória",
        "Crianças menores de 12 anos devem estar acompanhadas",
        "Não é permitido trazer bebidas alcoólicas",
        "Estacionamento limitado - recomenda-se transporte público"
      ],
      highlights: [
        "Apresentações de artistas renomados",
        "Degustação gratuita de pratos típicos",
        "Atividades para toda a família",
        "Exposição de arte e artesanato",
        "Networking com a comunidade"
      ]
    },
    2: {
      id: 2,
      title: "Networking Empresarial Angolano",
      shortDescription: "Encontro mensal para empresários e profissionais angolanos expandirem suas redes de contacto.",
      fullDescription: "O Networking Empresarial Angolano é um evento mensal que reúne empresários, profissionais e empreendedores da comunidade angolana no Reino Unido. O objetivo é criar oportunidades de negócio, partilhar experiências e fortalecer os laços comerciais entre os membros da comunidade. O evento inclui apresentações de negócios, sessões de networking estruturado e palestras sobre temas relevantes para o empreendedorismo.",
      date: "2024-03-20",
      time: "18:30",
      endTime: "21:00",
      location: "Manchester",
      venue: "Manchester Business Centre",
      address: "46 Deansgate, Manchester M3 2FN",
      category: "Negócios",
      image: "https://picsum.photos/800/400?random=51",
      organizer: {
        name: "Angola Business Network",
        email: "contact@angolabusiness.uk",
        phone: "+44 161 234 5678",
        website: "www.angolabusiness.uk",
        description: "Rede de negócios que conecta empresários angolanos no Reino Unido."
      },
      price: "£15",
      capacity: 80,
      registered: 45,
      featured: false,
      tags: ["Networking", "Negócios", "Profissional", "Empreendedorismo"],
      agenda: [
        { time: "18:30", activity: "Registo e welcome drink" },
        { time: "19:00", activity: "Apresentação de novos membros" },
        { time: "19:15", activity: "Palestra: 'Oportunidades de negócio pós-Brexit'" },
        { time: "19:45", activity: "Sessão de networking estruturado" },
        { time: "20:30", activity: "Apresentações de negócios (pitch)" },
        { time: "21:00", activity: "Networking livre e encerramento" }
      ],
      requirements: [
        "Inscrição prévia obrigatória",
        "Dress code: business casual",
        "Trazer cartões de visita",
        "Pagamento antecipado de £15"
      ],
      highlights: [
        "Networking com empresários estabelecidos",
        "Oportunidades de parcerias",
        "Palestras sobre mercado britânico",
        "Sessões de pitch para novos negócios",
        "Welcome drink incluído"
      ]
    }
  };

  const event = events[eventId] || events[1];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = (capacity, registered) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: 'Quase Esgotado', color: 'text-red-600 bg-red-100' };
    if (percentage >= 70) return { status: 'Poucos Lugares', color: 'text-orange-600 bg-orange-100' };
    return { status: 'Disponível', color: 'text-green-600 bg-green-100' };
  };

  const availability = getAvailabilityStatus(event.capacity, event.registered);

  const handleRegistration = () => {
    setIsRegistered(!isRegistered);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Confira este evento: ${event.title}`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-yellow-500 to-red-500">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
              {event.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <i className="fas fa-star mr-1"></i>
                  Destaque
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${availability.color}`}>
                {availability.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">{event.shortDescription}</p>
            <div className="flex flex-wrap items-center justify-center space-x-6 text-lg">
              <div className="flex items-center">
                <i className="fas fa-calendar-alt mr-2"></i>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <span>{event.time} - {event.endTime}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>{event.venue}, {event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Visão Geral', icon: 'fas fa-info-circle' },
                    { id: 'agenda', label: 'Agenda', icon: 'fas fa-clock' },
                    { id: 'location', label: 'Localização', icon: 'fas fa-map-marker-alt' },
                    { id: 'organizer', label: 'Organizador', icon: 'fas fa-user' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <i className={`${tab.icon} mr-2`}></i>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre o Evento</h3>
                      <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Destaques</h3>
                      <ul className="space-y-2">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos e Informações</h3>
                      <ul className="space-y-2">
                        {event.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-exclamation-circle text-yellow-500 mr-3 mt-1"></i>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Agenda Tab */}
                {activeTab === 'agenda' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Programa do Evento</h3>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium min-w-max">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Local do Evento</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{event.venue}</h4>
                        <p className="text-gray-700 mb-3">{event.address}</p>
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                            <i className="fas fa-map-marker-alt mr-2"></i>
                            Ver no Mapa
                          </button>
                          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                            <i className="fas fa-directions mr-2"></i>
                            Como Chegar
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações de Transporte</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            <i className="fas fa-subway mr-2 text-blue-500"></i>
                            Transporte Público
                          </h4>
                          <p className="text-gray-700 text-sm">Estação mais próxima: Waterloo (5 min a pé)</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            <i className="fas fa-car mr-2 text-green-500"></i>
                            Estacionamento
                          </h4>
                          <p className="text-gray-700 text-sm">Estacionamento limitado - £8/hora</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Organizer Tab */}
                {activeTab === 'organizer' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre o Organizador</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{event.organizer.name}</h4>
                        <p className="text-gray-700 mb-4">{event.organizer.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-envelope text-red-500 mr-3"></i>
                              <a href={`mailto:${event.organizer.email}`} className="text-blue-600 hover:underline">
                                {event.organizer.email}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-phone text-red-500 mr-3"></i>
                              <a href={`tel:${event.organizer.phone}`} className="text-blue-600 hover:underline">
                                {event.organizer.phone}
                              </a>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-globe text-red-500 mr-3"></i>
                              <a href={`https://${event.organizer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {event.organizer.website}
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setShowContactModal(true)}
                          className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          <i className="fas fa-envelope mr-2"></i>
                          Contactar Organizador
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Registration Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{event.price}</div>
                  <div className="text-sm text-gray-600">
                    {event.registered}/{event.capacity} inscritos
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  onClick={handleRegistration}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isRegistered 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90'
                  }`}
                >
                  <i className={`fas ${isRegistered ? 'fa-check' : 'fa-ticket-alt'} mr-2`}></i>
                  {isRegistered ? 'Inscrito' : 'Inscrever-se'}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Partilhar Evento</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="bg-blue-400 text-white p-2 rounded hover:bg-blue-500 transition-colors"
                    >
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </button>
                    <button 
                      onClick={() => handleShare('email')}
                      className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      <i className="fas fa-envelope"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informações Rápidas</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-red-500 mr-3"></i>
                    <div>
                      <div className="font-medium text-gray-900">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-600">{event.time} - {event.endTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-red-500 mr-3"></i>
                    <div>
                      <div className="font-medium text-gray-900">{event.venue}</div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-user text-red-500 mr-3"></i>
                    <div>
                      <div className="font-medium text-gray-900">{event.organizer.name}</div>
                      <div className="text-sm text-gray-600">Organizador</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-tag text-red-500 mr-3"></i>
                    <div>
                      <div className="font-medium text-gray-900">{event.category}</div>
                      <div className="text-sm text-gray-600">Categoria</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back to Events */}
              <Link 
                to="/eventos" 
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Voltar aos Eventos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contactar Organizador</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea 
                  rows="4" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Sua mensagem..."
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;