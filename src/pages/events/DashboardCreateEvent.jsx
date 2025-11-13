import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../../services';
import EventForm from '../../components/events/EventForm';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from '../../contexts/NotificationsContext';

function DashboardCreateEvent() {
  const navigate = useNavigate();
  const { addNotification, showToast } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await services.eventsService.getCategories();
        setCategories(Array.isArray(list) ? list : []);
      } catch (e) {
        console.warn('Falha ao carregar categorias de eventos:', e);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(formData) {
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const created = await services.eventsService.createEvent(formData);
      setSuccess('Evento criado com sucesso');

      // Toast de sucesso imediato
      showToast({
        type: NOTIFICATION_TYPES.EVENT,
        title: 'Evento criado',
        message: 'O seu evento foi enviado para aprovação. Receberá uma notificação quando for aprovado.',
        actionUrl: '/dashboard/eventos'
      });

      // Notificação in-app para acompanhar aprovação
      addNotification({
        category: NOTIFICATION_CATEGORIES.EVENT,
        type: NOTIFICATION_TYPES.INFO,
        title: 'Evento enviado para aprovação',
        message: 'Aguardando validação do admin. Iremos atualizar quando houver mudanças.',
        actionUrl: '/dashboard/eventos'
      });

      setTimeout(() => navigate('/dashboard/eventos'), 400);
      return created;
    } catch (e) {
      console.error('Erro ao criar evento:', e);
      // Mostrar detalhes de validação do backend quando existirem
      if (e?.data) {
        try {
          if (typeof e.data === 'string') {
            setError(e.data);
          } else if (typeof e.data === 'object') {
            const msgs = Object.entries(e.data).map(([field, info]) => {
              const text = Array.isArray(info) ? info.join('; ') : String(info);
              return `${field}: ${text}`;
            });
            setError(msgs.join('\n'));
          } else {
            setError(e?.message || 'Falha ao criar o evento');
          }
        } catch (_) {
          setError(e?.message || 'Falha ao criar o evento');
        }
      } else {
        setError(e?.message || 'Falha ao criar o evento');
      }

      // Toast de erro
      showToast({
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Erro ao criar evento',
        message: e?.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Criar Novo Evento</h1>
          <p className="text-sm text-gray-600">Publique eventos para a comunidade AWAYSUK.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">{success}</div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <EventForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/eventos')}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardCreateEvent;