import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import eventService from '../../services/eventService';

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadEvent();
    if (isAuthenticated) {
      checkRegistrationStatus();
      checkWishlistStatus();
      loadComments();
    }
  }, [slug, isAuthenticated]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvent(slug);
      setEvent(response);
    } catch (err) {
      setError(err.message || 'Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const registrations = await eventService.getUserRegistrations();
      const registration = registrations.find(reg => 
        reg.event.slug === slug && reg.status === 'confirmed'
      );
      setIsRegistered(!!registration);
    } catch (err) {
      console.error('Erro ao verificar registo:', err);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const wishlist = await eventService.getWishlist();
      const inWishlist = wishlist.some(item => item.event.slug === slug);
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error('Erro ao verificar wishlist:', err);
    }
  };

  const loadComments = async () => {
    try {
      const response = await eventService.getEventComments(slug);
      setComments(response.results || response.data || []);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await eventService.registerForEvent(slug);
      setIsRegistered(true);
      setEvent(prev => ({
        ...prev,
        attendee_count: (prev.attendee_count || 0) + 1
      }));
    } catch (err) {
      setError(err.message || 'Erro ao registar no evento');
    } finally {
      setRegistering(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await eventService.removeFromWishlist(slug);
        setIsInWishlist(false);
      } else {
        await eventService.addToWishlist(slug);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Erro ao atualizar wishlist:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await eventService.addComment(slug, {
        content: newComment
      });
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Erro ao adicionar comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      networking: 'fas fa-users',
      workshop: 'fas fa-tools',
      conference: 'fas fa-microphone',
      meetup: 'fas fa-coffee',
      webinar: 'fas fa-video',
      social: 'fas fa-glass-cheers',
      business: 'fas fa-briefcase',
      cultural: 'fas fa-palette',
      other: 'fas fa-calendar'
    };
    return icons[type] || icons.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isEventPast = new Date(event.end_date) < new Date();
  const isEventFull = event.max_attendees && event.attendee_count >= event.max_attendees;
  const canRegister = isAuthenticated && !isRegistered && !isEventPast && !isEventFull;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-red-600">{t('navigation.home')}</Link></li>
            <li><i className="fas fa-chevron-right"></i></li>
            <li><Link to="/eventos" className="hover:text-red-600">{t('navigation.events')}</Link></li>
            <li><i className="fas fa-chevron-right"></i></li>
            <li className="text-gray-900">{event.title}</li>
          </ol>
        </nav>

        {/* Imagem principal */}
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg overflow-hidden mb-8">
          {event.featured_image ? (
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className={`${getEventTypeIcon(event.event_type)} text-6xl text-white`}></i>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {event.is_free && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('events.free')}
              </span>
            )}
            {event.is_online && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('events.online')}
              </span>
            )}
            {event.is_featured && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('events.featured')}
              </span>
            )}
            {isEventPast && (
              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('events.past')}
              </span>
            )}
          </div>

          {/* Wishlist button */}
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <i className={`fas fa-heart ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}></i>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {event.category?.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-eye mr-1"></i>
                    {event.view_count} visualizações
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>

                {/* Organizador */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={event.organizer?.profile_image || event.organizer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.first_name + ' ' + event.organizer?.last_name)}&background=f59e0b&color=fff`}
                    alt={`${event.organizer?.first_name} ${event.organizer?.last_name}`}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Organizado por {event.organizer?.first_name} {event.organizer?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {event.organizer?.profile?.company || event.organizer?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('events.description')}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('events.tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comentários */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('events.comments')} ({comments.length})
              </h3>

              {/* Formulário de comentário */}
              {isAuthenticated && (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('events.add_comment')}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? (
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fas fa-comment mr-2"></i>
                      )}
                      {t('events.post_comment')}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de comentários */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={comment.user?.profile_image || comment.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.first_name + ' ' + comment.user?.last_name)}&background=f59e0b&color=fff`}
                        alt={`${comment.user?.first_name} ${comment.user?.last_name}`}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user?.first_name} {comment.user?.last_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {t('events.no_comments')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Data e hora */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('events.date_time')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-calendar mr-3 text-red-500"></i>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  {event.end_date !== event.start_date && (
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-clock mr-3 text-red-500"></i>
                      <span>Até {formatDate(event.end_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Local */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('events.location')}
                </h3>
                <div className="space-y-2">
                  {event.is_online ? (
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-video mr-3 text-red-500"></i>
                      <span>{t('events.online_event')}</span>
                    </div>
                  ) : (
                    <>
                      {event.venue_name && (
                        <div className="flex items-center text-gray-700">
                          <i className="fas fa-building mr-3 text-red-500"></i>
                          <span>{event.venue_name}</span>
                        </div>
                      )}
                      <div className="flex items-start text-gray-700">
                        <i className="fas fa-map-marker-alt mr-3 text-red-500 mt-1"></i>
                        <div>
                          {event.address && <div>{event.address}</div>}
                          {event.city && <div>{event.city}</div>}
                          {event.postcode && <div>{event.postcode}</div>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Participantes */}
              {event.max_attendees && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('events.attendees')}
                  </h3>
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-users mr-3 text-red-500"></i>
                    <span>
                      {event.attendee_count || 0} / {event.max_attendees} participantes
                    </span>
                  </div>
                  {event.max_attendees > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, ((event.attendee_count || 0) / event.max_attendees) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preço */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('events.price')}
                </h3>
                <div className="text-2xl font-bold">
                  {event.is_free ? (
                    <span className="text-green-600">{t('events.free')}</span>
                  ) : (
                    <span className="text-gray-900">€{event.price}</span>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                {canRegister ? (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                  >
                    {registering ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        {t('events.registering')}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-ticket-alt mr-2"></i>
                        {t('events.register')}
                      </>
                    )}
                  </button>
                ) : isRegistered ? (
                  <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-md font-medium text-center">
                    <i className="fas fa-check mr-2"></i>
                    {t('events.registered')}
                  </div>
                ) : isEventPast ? (
                  <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-md font-medium text-center">
                    <i className="fas fa-clock mr-2"></i>
                    {t('events.event_ended')}
                  </div>
                ) : isEventFull ? (
                  <div className="w-full bg-red-100 text-red-800 py-3 px-4 rounded-md font-medium text-center">
                    <i className="fas fa-users mr-2"></i>
                    {t('events.event_full')}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 px-4 rounded-md font-medium hover:opacity-90 transition duration-300 text-center block"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    {t('events.login_to_register')}
                  </Link>
                )}

                {/* Partilhar */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigator.share?.({ 
                      title: event.title, 
                      url: window.location.href 
                    })}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition duration-300"
                  >
                    <i className="fas fa-share mr-2"></i>
                    {t('common.share')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
