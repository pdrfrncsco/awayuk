import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VisitorAction from '../../components/common/VisitorAction';
import { useAuth } from '../../contexts/AuthContext';

const EventDetail = () => {
  // Função simples para substituir o useTranslation
  const t = (key) => {
    const translations = {
      'event.register': 'Inscrever-se',
      'event.contact': 'Contactar organizador',
      'common.loading': 'Carregando...'
    };
    return translations[key] || key;
  };
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados do evento
    // Em produção, isso seria uma chamada à API
    setTimeout(() => {
      // Dados mockados para demonstração
      setEvent({
        id: parseInt(id),
        title: "Festival de Cultura Angolana",
        description: "Celebração da rica cultura angolana com música, dança, gastronomia e artesanato tradicional. Venha participar deste evento único que reúne o melhor da cultura angolana no Reino Unido. Haverá apresentações de dança, música ao vivo, comidas típicas e muito mais.",
        date: "2024-03-15",
        time: "14:00",
        endTime: "22:00",
        location: "Londres",
        venue: "Southbank Centre",
        address: "Belvedere Rd, South Bank, London SE1 8XX",
        category: "Cultural",
        image: "https://picsum.photos/800/400?random=50",
        organizer: "Associação Cultural Angola UK",
        price: "Gratuito",
        capacity: 500,
        registered: 234,
        featured: true,
        tags: ["Música", "Dança", "Gastronomia", "Família"],
        agenda: [
          { time: "14:00 - 15:00", activity: "Abertura e boas-vindas" },
          { time: "15:00 - 17:00", activity: "Apresentações culturais" },
          { time: "17:00 - 19:00", activity: "Degustação gastronômica" },
          { time: "19:00 - 22:00", activity: "Música ao vivo e dança" }
        ],
        speakers: [
          { name: "Ana Silva", role: "Diretora da Associação Cultural", image: "https://picsum.photos/100/100?random=10" },
          { name: "João Santos", role: "Músico e Produtor Cultural", image: "https://picsum.photos/100/100?random=11" }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  const isMember = user && user.role === 'member';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Imagem de capa */}
        <div className="relative rounded-xl overflow-hidden h-80 mb-8">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {event.category}
              </span>
              {event.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-star mr-1"></i>
                  Destaque
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center text-sm">
              <i className="fas fa-calendar-alt mr-2"></i>
              <span>{formatDate(event.date)} • {event.time} - {event.endTime}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Detalhes do evento */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
              <p className="text-gray-700 mb-6">{event.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">Agenda</h3>
              <div className="space-y-3 mb-6">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-1/3 font-medium text-gray-900">{item.time}</div>
                    <div className="w-2/3 text-gray-700">{item.activity}</div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Oradores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{speaker.name}</div>
                      <div className="text-sm text-gray-500">{speaker.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de inscrição */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Informações</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm text-gray-500">{event.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{formatDate(event.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-clock w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{event.time} - {event.endTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-user w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{event.organizer}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-ticket-alt w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{event.price}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-users w-6 text-red-500"></i>
                  <div>
                    <div className="font-medium">{event.registered} / {event.capacity} inscritos</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botão de inscrição com VisitorAction */}
              <VisitorAction
                actionType="event-registration"
                isAuthenticated={isAuthenticated}
                isMember={isMember}
                buttonText={t('common.registerForEvent')}
                buttonClassName="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 px-4 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                onAction={() => {
                  // Lógica de inscrição para usuários autenticados e membros
                  alert('Inscrição realizada com sucesso!');
                }}
              />
              
              <div className="mt-4 flex justify-between">
                <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                  <i className="fas fa-share-alt mr-1"></i>
                  Compartilhar
                </button>
                <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                  <i className="fas fa-heart mr-1"></i>
                  Salvar
                </button>
              </div>
            </div>
            
            {/* Organizador */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Organizador</h2>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-tie text-gray-500"></i>
                </div>
                <div>
                  <div className="font-medium">{event.organizer}</div>
                  <div className="text-sm text-gray-500">Organizador</div>
                </div>
              </div>
              
              {/* Botão de contato com VisitorAction */}
              <VisitorAction
                actionType="send-message"
                isAuthenticated={isAuthenticated}
                isMember={isMember}
                buttonText={t('common.contactOrganizer')}
                buttonClassName="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                onAction={() => {
                  // Lógica de envio de mensagem para usuários autenticados e membros
                  alert('Mensagem enviada com sucesso!');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;