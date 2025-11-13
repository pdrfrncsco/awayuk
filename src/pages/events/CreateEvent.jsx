import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import eventsService from '../../services/eventsService';
import EventImageUpload from '../../components/events/EventImageUpload';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from '../../contexts/NotificationsContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { addNotification, showToast } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'networking',
    category: '',
    start_date: '',
    end_date: '',
    is_online: false,
    venue_name: '',
    address: '',
    city: '',
    postcode: '',
    max_attendees: '',
    is_free: true,
    price: '',
    tags: '',
    featured_image: null,
    registration_deadline: '',
    requirements: '',
    agenda: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [isAuthenticated, navigate]);

  const loadCategories = async () => {
    try {
      const list = await eventsService.getCategories();
      setCategories(list);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpar preço se evento for gratuito
    if (name === 'is_free' && checked) {
      setFormData(prev => ({
        ...prev,
        price: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!formData.description.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (!formData.start_date) {
      errors.push('Data de início é obrigatória');
    }

    if (!formData.end_date) {
      errors.push('Data de fim é obrigatória');
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        errors.push('Data de fim deve ser posterior à data de início');
      }
    }

    if (!formData.is_online) {
      if (!formData.city.trim()) {
        errors.push('Cidade é obrigatória para eventos presenciais');
      }
    }

    if (!formData.is_free && !formData.price) {
      errors.push('Preço é obrigatório para eventos pagos');
    }

    if (formData.max_attendees && parseInt(formData.max_attendees) < 1) {
      errors.push('Número máximo de participantes deve ser maior que 0');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Preparar dados para envio
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'tags') {
            // Converter tags em array
            const tagsArray = formData[key].split(',').map(tag => tag.trim()).filter(tag => tag);
            submitData.append(key, JSON.stringify(tagsArray));
          } else if (key === 'featured_image' && formData[key]) {
            submitData.append(key, formData[key]);
          } else if (typeof formData[key] === 'boolean') {
            submitData.append(key, formData[key]);
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      const response = await eventsService.createEvent(submitData);

      // Toast de sucesso imediato
      showToast({
        type: NOTIFICATION_TYPES.EVENT,
        title: 'Evento criado',
        message: 'O seu evento foi enviado para aprovação. Receberá uma notificação quando for aprovado.',
        actionUrl: `/eventos/${response.slug}`
      });

      // Notificação in-app para acompanhar aprovação
      addNotification({
        category: NOTIFICATION_CATEGORIES.EVENT,
        type: NOTIFICATION_TYPES.INFO,
        title: 'Evento enviado para aprovação',
        message: 'Aguardando validação do admin. Iremos atualizar quando houver mudanças.',
        actionUrl: `/eventos/${response.slug}`
      });

      navigate(`/eventos/${response.slug}`);
    } catch (err) {
      setError(err.message || 'Erro ao criar evento');
      showToast({
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Erro ao criar evento',
        message: err?.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'networking', label: 'Networking' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conferência' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'social', label: 'Social' },
    { value: 'business', label: 'Negócios' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Outro' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('events.create_event')}
            </h1>
            <p className="text-gray-600 mt-1">
              Crie um novo evento para a comunidade AwaysUK
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Networking para Empreendedores Portugueses"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evento *
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecionar categoria</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Descreva o seu evento, objetivos e o que os participantes podem esperar..."
                  required
                />
              </div>
            </div>

            {/* Data e hora */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Data e Hora
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora de Fim *
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Inscrição
                  </label>
                  <input
                    type="datetime-local"
                    name="registration_deadline"
                    value={formData.registration_deadline}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Local */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Local do Evento
              </h3>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_online"
                    checked={formData.is_online}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Este é um evento online
                  </span>
                </label>
              </div>

              {!formData.is_online && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Local
                    </label>
                    <input
                      type="text"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ex: Centro de Convenções de Londres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ex: Londres"
                      required={!formData.is_online}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ex: 123 Oxford Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ex: W1C 1DE"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Participantes e Preço */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Participantes e Preço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: 50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deixe em branco para eventos sem limite
                  </p>
                </div>

                <div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_free"
                        checked={formData.is_free}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Evento gratuito
                      </span>
                    </label>
                  </div>

                  {!formData.is_free && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço (£) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ex: 25.00"
                        required={!formData.is_free}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes adicionais */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Detalhes Adicionais
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: networking, empreendedorismo, tecnologia (separadas por vírgula)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe as tags com vírgulas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: Trazer laptop, conhecimentos básicos de programação..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agenda
                  </label>
                  <textarea
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: 18:00 - Receção, 18:30 - Apresentações, 19:30 - Networking..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem de Destaque
                  </label>
                  <EventImageUpload
                    onImageUpload={(uploadedImages) => {
                      if (uploadedImages.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          featured_image: uploadedImages[0].id
                        }));
                      }
                    }}
                    maxFiles={1}
                    showPreview={true}
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/eventos')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Criando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Criar Evento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;