import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VisitorAction from '../../components/common/VisitorAction';
import { useAuth } from '../../contexts/AuthContext';
import { services } from '../../services';

const EventDetail = () => {
  // Função simples para substituir o useTranslation
  const t = (key) => {
    const translations = {
      'event.register': 'Inscrever-se',
      'event.contact': 'Contactar organizador',
      'common.loading': 'Carregando...',
      'common.registerForEvent': 'Inscrever-se',
      'common.contactOrganizer': 'Contactar organizador',
      'common.share': 'Partilhar',
      'common.save': 'Guardar',
      'common.saved': 'Guardado'
    };
    return translations[key] || key;
  };
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'agenda' | 'local' | 'organizer'
  const [shareCopied, setShareCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', quantity: 1 });
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await services.eventsService.getEvent(slug);
        setEvent(data);
        try {
          const savedArr = JSON.parse(localStorage.getItem('savedEvents') || '[]');
          setIsSaved(savedArr.includes(data.id));
        } catch (_) {}
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  const isMember = user && user.role === 'member';

  const daysLeft = event ? Math.max(0, Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))) : null;

  const handleShare = () => {
    try {
      const url = `${window.location.origin}/evento/${event?.slug || slug}`;
      navigator.clipboard?.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch (_) {}
  };

  const toggleSaved = () => {
    setIsSaved(prev => {
      const next = !prev;
      try {
        const arr = new Set(JSON.parse(localStorage.getItem('savedEvents') || '[]'));
        if (event?.id == null) return next;
        if (next) arr.add(event.id); else arr.delete(event.id);
        localStorage.setItem('savedEvents', JSON.stringify([...arr]));
      } catch (_) {}
      return next;
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;
    try {
      await services.eventsService.registerForEvent(event.slug, {
        special_requirements: '',
        dietary_requirements: '',
        emergency_contact: ''
      });
      setEvent(prev => ({
        ...prev,
        registered: Math.min((prev.capacity || 0), (prev.registered || 0) + 1)
      }));
      setShowRegistrationModal(false);
      setRegistrationForm({ name: '', email: '', quantity: 1 });
      alert('Inscrição enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      alert(error?.message || 'Falha ao enviar inscrição.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;
    try {
      await services.messageService.sendMessage({
        recipient_id: event.organizerUser?.id,
        subject: `Contacto sobre ${event.title}`,
        content: contactForm.message
      });
      setShowContactModal(false);
      setContactForm({ name: '', email: '', message: '' });
      alert('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert(error?.message || 'Falha ao enviar mensagem.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Fallback quando o evento não foi carregado (erro ou inexistente)
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-700">Evento não encontrado ou indisponível.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link to="/eventos" className="text-sm text-gray-600 hover:text-red-600">
            <i className="fas fa-arrow-left mr-1"></i>
            Voltar aos eventos
          </Link>
        </div>
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
            {daysLeft !== null && (
              <div className="mt-2 text-sm">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  Faltam {daysLeft} dia{daysLeft !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'overview', label: 'Visão Geral', icon: 'fa-info-circle' },
                  { key: 'agenda', label: 'Agenda', icon: 'fa-calendar-alt' },
                  { key: 'local', label: 'Localização', icon: 'fa-map-marker-alt' },
                  { key: 'organizer', label: 'Organizador', icon: 'fa-user-tie' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${activeTab === tab.key ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
                  <p className="text-gray-700">{event.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Oradores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(event.speakers || []).map((speaker, index) => (
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
                <div>
                  <h2 className="text-lg font-semibold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {(event.tags || []).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agenda' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">Agenda</h3>
                <div className="space-y-3">
                  {(event.agenda || []).map((item, index) => (
                    <div key={index} className="flex">
                      <div className="w-1/3 font-medium text-gray-900">{item.time}</div>
                      <div className="w-2/3 text-gray-700">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'local' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">Localização</h3>
                <p className="text-gray-700 mb-3">{event.venue}, {event.address}</p>
                <div className="rounded-lg overflow-hidden border">
                  <iframe
                    title="Mapa"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            {activeTab === 'organizer' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">Organizador</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-tie text-gray-500"></i>
                  </div>
                  <div>
                    <div className="font-medium">{event.organizer}</div>
                    <div className="text-sm text-gray-500">Organizador</div>
                  </div>
                </div>
                <p className="text-gray-700">Entre em contacto com o organizador usando o botão na barra lateral.</p>
              </div>
            )}
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
                    <div className="font-medium">{event.registered || 0} / {event.capacity ?? '-'} inscritos</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${event.capacity ? Math.min(100, Math.round(((event.registered || 0) / event.capacity) * 100)) : 0}%` }}
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
                onAction={() => setShowRegistrationModal(true)}
              />
              
              <div className="mt-4 flex justify-between">
                <button onClick={handleShare} className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                  <i className="fas fa-share-alt mr-1"></i>
                  {t('common.share')}
                  {shareCopied && (
                    <span className="ml-2 text-xs text-green-600">Copiado!</span>
                  )}
                </button>
                <VisitorAction
                  actionType="favorite"
                  isAuthenticated={isAuthenticated}
                  isMember={isMember}
                  buttonText={isSaved ? t('common.saved') : t('common.save')}
                  buttonClassName={`flex items-center ${isSaved ? 'text-red-600' : 'text-gray-600'} hover:text-red-500 transition-colors`}
                  onAction={toggleSaved}
                />
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
                onAction={() => setShowContactModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inscrever-se no Evento</h3>
              <button onClick={() => setShowRegistrationModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={registrationForm.quantity}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRegistrationModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">Confirmar Inscrição</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contactar Organizador</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem *</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowContactModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">Enviar Mensagem</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;