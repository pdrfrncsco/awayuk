import { ApiClient } from './api.js';

class EventsService {
  constructor() {
    // Instanciar ApiClient para garantir interceptores e baseURL corretos
    this.apiClient = new ApiClient();
  }

  // Buscar eventos com filtros e paginação
  async getEvents(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.location) params.append('location', filters.location);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const data = await this.apiClient.get(`/events/?${params.toString()}`);
      
      // Transformar dados da API para o formato esperado pelo frontend
      return {
        results: (data.results || []).map(this.transformEventFromAPI),
        count: data.count,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      // Retornar dados mock em caso de erro
      return this.getMockEvents(filters);
    }
  }

  // Buscar evento específico por slug (ou ID se o backend suportar)
  async getEvent(eventIdentifier) {
    try {
      const data = await this.apiClient.get(`/events/${eventIdentifier}/`);
      return this.transformEventFromAPI(data);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      throw error;
    }
  }

  // Criar novo evento
  async createEvent(eventData) {
    try {
      // Permitir compatibilidade: se receber FormData (upload de imagem), enviar diretamente
      if (typeof FormData !== 'undefined' && eventData instanceof FormData) {
        const data = await this.apiClient.upload('/events/', eventData);
        return this.transformEventFromAPI(data);
      }
      const transformedData = this.transformEventToAPI(eventData);
      const data = await this.apiClient.post('/events/', transformedData);
      return this.transformEventFromAPI(data);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  // Atualizar evento
  async updateEvent(eventIdentifier, eventData) {
    try {
      if (typeof FormData !== 'undefined' && eventData instanceof FormData) {
        // Enviar como multipart para suportar imagem
        const data = await this.apiClient.patch(`/events/${eventIdentifier}/`, eventData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return this.transformEventFromAPI(data);
      }
      const transformedData = this.transformEventToAPI(eventData);
      const data = await this.apiClient.put(`/events/${eventIdentifier}/`, transformedData);
      return this.transformEventFromAPI(data);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  }

  // Deletar evento
  async deleteEvent(eventIdentifier) {
    try {
      await this.apiClient.delete(`/events/${eventIdentifier}/`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      throw error;
    }
  }

  // Buscar categorias de eventos
  async getCategories() {
    try {
      const data = await this.apiClient.get('/events/categories/');
      const list = Array.isArray(data) ? data : (data?.results || []);
      // Backend espera ID da categoria no campo "category" do evento
      return list.map(cat => ({
        value: cat.id,
        label: cat.name,
        color: cat.color || 'bg-gray-100 text-gray-800',
        slug: cat.slug
      }));
    } catch (error) {
      // Evitar log de erro barulhento no console em 404; usar fallback
      console.warn('Aviso: usando categorias padrão (falha ao buscar categorias).');
      return this.getDefaultCategories();
    }
  }

  // Buscar registros de um evento
  async getEventRegistrations(eventSlug, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);

      const data = await this.apiClient.get(`/events/${eventSlug}/registrations/?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  }

  // Buscar comentários de um evento
  async getEventComments(eventSlug, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);

      const data = await this.apiClient.get(`/events/${eventSlug}/comments/?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      throw error;
    }
  }

  // Buscar estatísticas de eventos
  async getEventStats() {
    try {
      const data = await this.apiClient.get('/events/stats/');
      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total_events: 0,
        published_events: 0,
        draft_events: 0,
        cancelled_events: 0,
        total_registrations: 0,
        upcoming_events: 0,
        past_events: 0
      };
    }
  }

  // Alterar status do evento
  async updateEventStatus(eventSlug, status) {
    try {
      const data = await this.apiClient.patch(`/events/${eventSlug}/`, { status });
      return this.transformEventFromAPI(data);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      throw error;
    }
  }

  // Duplicar evento
  async duplicateEvent(eventSlug) {
    try {
      const data = await this.apiClient.post(`/events/${eventSlug}/duplicate/`);
      return this.transformEventFromAPI(data);
    } catch (error) {
      console.error('Erro ao duplicar evento:', error);
      throw error;
    }
  }

  // Registar-se num evento
  async registerForEvent(eventSlug, registrationData = {}) {
    try {
      const payload = {
        special_requirements: registrationData.special_requirements || '',
        dietary_requirements: registrationData.dietary_requirements || '',
        emergency_contact: registrationData.emergency_contact || ''
      };
      const data = await this.apiClient.post(`/events/${eventSlug}/register/`, payload);
      return data; // retorna dados do registo
    } catch (error) {
      console.error('Erro ao registar no evento:', error);
      throw error;
    }
  }

  // Exportar eventos
  async exportEvents(filters = {}, format = 'csv') {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      params.append('format', format);

      const blobData = await this.apiClient.get(`/events/export/?${params.toString()}`, {
        responseType: 'blob'
      });

      // Criar download do arquivo
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `eventos_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erro ao exportar eventos:', error);
      throw error;
    }
  }

  // Transformar dados da API para o formato do frontend
  transformEventFromAPI(apiEvent) {
    // Mapear campos do EventDetail/List serializers para o formato esperado pelo frontend
    const start = apiEvent.start_date ? new Date(apiEvent.start_date) : null;
    const end = apiEvent.end_date ? new Date(apiEvent.end_date) : null;
    const toHHMM = (d) => d ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : '';

    const organizerUser = apiEvent.organizer ? {
      id: apiEvent.organizer.id,
      username: apiEvent.organizer.username,
      firstName: apiEvent.organizer.first_name,
      lastName: apiEvent.organizer.last_name,
      profile_image: apiEvent.organizer.profile_image
    } : null;

    const organizerName = organizerUser
      ? ((organizerUser.firstName || organizerUser.lastName)
        ? `${organizerUser.firstName || ''} ${organizerUser.lastName || ''}`.trim()
        : organizerUser.username)
      : (apiEvent.organizer || '');

    return {
      id: apiEvent.id,
      slug: apiEvent.slug,
      title: apiEvent.title,
      description: apiEvent.description || apiEvent.short_description || '',
      date: apiEvent.start_date || apiEvent.date,
      time: toHHMM(start),
      endTime: toHHMM(end),
      location: apiEvent.city || apiEvent.location,
      address: apiEvent.address,
      category: apiEvent.category?.name || apiEvent.category?.slug || apiEvent.category,
      status: apiEvent.status,
      registered: apiEvent.attendee_count ?? apiEvent.registrations_count ?? 0,
      capacity: apiEvent.max_attendees ?? apiEvent.maxAttendees,
      price: apiEvent.is_free ? 'Gratuito' : (apiEvent.price != null ? `£${apiEvent.price}` : ''),
      organizer: organizerName,
      organizerUser,
      venue: apiEvent.venue_name || apiEvent.venue,
      image: apiEvent.featured_image || apiEvent.image,
      tags: apiEvent.tags || [],
      featured: apiEvent.is_featured || false,
      created_at: apiEvent.created_at,
      updated_at: apiEvent.updated_at
    };
  }

  // Transformar dados do frontend para o formato da API
  transformEventToAPI(frontendEvent) {
    return {
      title: frontendEvent.title,
      description: frontendEvent.description,
      date: frontendEvent.date,
      time: frontendEvent.time,
      location: frontendEvent.location,
      address: frontendEvent.address,
      category: frontendEvent.category,
      status: frontendEvent.status,
      max_attendees: frontendEvent.maxAttendees,
      price: frontendEvent.price,
      image: frontendEvent.image,
      tags: frontendEvent.tags
    };
  }

  // Dados mock para fallback
  getMockEvents(filters = {}) {
    const mockEvents = [
      {
        id: 1,
        title: 'Networking Night Londres',
        description: 'Uma noite de networking para profissionais angolanos em Londres',
        date: '2024-12-20',
        time: '19:00',
        location: 'Central London Hotel',
        address: '123 Oxford Street, London W1D 2HX',
        category: 'networking',
        status: 'published',
        attendees: 45,
        maxAttendees: 80,
        price: 15,
        organizer: 'Maria Santos',
        image: null,
        tags: ['networking', 'profissional', 'londres']
      },
      {
        id: 2,
        title: 'Workshop: CV para o Reino Unido',
        description: 'Aprenda a criar um CV eficaz para o mercado de trabalho britânico',
        date: '2024-12-25',
        time: '14:00',
        location: 'Online',
        address: 'Zoom Meeting',
        category: 'workshop',
        status: 'published',
        attendees: 120,
        maxAttendees: 150,
        price: 0,
        organizer: 'João Silva',
        image: null,
        tags: ['workshop', 'cv', 'emprego']
      },
      {
        id: 3,
        title: 'Festa de Ano Novo Angolana',
        description: 'Celebre o Ano Novo com a comunidade angolana em Manchester',
        date: '2024-12-31',
        time: '20:00',
        location: 'Manchester Community Center',
        address: '456 Market Street, Manchester M1 1AA',
        category: 'social',
        status: 'draft',
        attendees: 0,
        maxAttendees: 200,
        price: 25,
        organizer: 'Ana Costa',
        image: null,
        tags: ['festa', 'ano-novo', 'manchester']
      }
    ];

    // Aplicar filtros aos dados mock
    let filtered = mockEvents;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    return {
      results: filtered,
      count: filtered.length,
      next: null,
      previous: null
    };
  }

  // Categorias padrão
  getDefaultCategories() {
    return [
      { value: 'networking', label: 'Networking', color: 'bg-blue-100 text-blue-800' },
      { value: 'workshop', label: 'Workshop', color: 'bg-green-100 text-green-800' },
      { value: 'social', label: 'Social', color: 'bg-purple-100 text-purple-800' },
      { value: 'business', label: 'Business', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'cultural', label: 'Cultural', color: 'bg-pink-100 text-pink-800' }
    ];
  }

  // Utilitário para formatar data
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Utilitário para formatar hora
  formatTime(timeString) {
    return timeString.substring(0, 5); // HH:MM
  }
}

// Criar instância do serviço
const eventsServiceInstance = new EventsService();

export { eventsServiceInstance, EventsService };
export default eventsServiceInstance;