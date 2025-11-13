import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { services } from '../../services';
import EventForm from '../../components/events/EventForm';

function DashboardEditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await services.eventsService.getCategories();
        setCategories(Array.isArray(list) ? list : []);
      } catch (e) {
        console.warn('Falha ao carregar categorias de eventos:', e);
      }
    }
    async function loadEvent() {
      try {
        const ev = await services.eventsService.getEvent(id);
        // Mapear para os campos do EventForm
        const tagsStr = Array.isArray(ev.tags) ? ev.tags.join(', ') : '';
        const init = {
          title: ev.title || '',
          description: ev.description || '',
          event_type: 'networking',
          category: ev.category || '',
          start_date: '',
          end_date: '',
          is_online: false,
          venue_name: ev.venue || '',
          address: ev.address || '',
          city: ev.location || '',
          postcode: '',
          max_attendees: ev.capacity || '',
          is_free: !ev.price || ev.price === 'Gratuito',
          price: ev.price && ev.price !== 'Gratuito' ? String(ev.price).replace('£','') : '',
          tags: tagsStr,
          featured_image: null,
          registration_deadline: '',
          requirements: '',
          agenda: ''
        };
        setInitialValues(init);
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Falha ao carregar evento');
      }
    }
    loadCategories();
    loadEvent();
  }, [id]);

  async function handleSubmit(formData) {
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const updated = await services.eventsService.updateEvent(id, formData);
      setSuccess('Evento atualizado com sucesso');
      setTimeout(() => navigate('/dashboard/eventos'), 400);
      return updated;
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Falha ao atualizar o evento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Editar Evento</h1>
          <p className="text-sm text-gray-600">Atualize os detalhes do seu evento.</p>
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
            initialValues={initialValues}
            submitLabel="Guardar alterações"
            loadingLabel="A guardar..."
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardEditEvent;