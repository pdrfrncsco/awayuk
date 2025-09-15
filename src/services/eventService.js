import { ApiClient, ApiError } from './api.js';

/**
 * Serviço de eventos
 * Gerencia todas as operações relacionadas aos eventos da plataforma
 */
class EventService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtém lista de eventos
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.page - Página atual (padrão: 1)
   * @param {number} params.limit - Limite de itens por página (padrão: 20)
   * @param {string} params.search - Termo de busca
   * @param {string} params.category - Categoria do evento
   * @param {string} params.location - Localização
   * @param {string} params.date_from - Data de início (YYYY-MM-DD)
   * @param {string} params.date_to - Data de fim (YYYY-MM-DD)
   * @param {string} params.status - Status do evento
   * @param {string} params.ordering - Ordenação (-date, date, -created_at, etc.)
   * @returns {Promise<Object>} Lista de eventos paginada
   */
  async getEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...params
      });

      return await this.apiClient.get(`/events/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter eventos',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém um evento específico por ID
   * @param {number} eventId - ID do evento
   * @returns {Promise<Object>} Dados do evento
   */
  async getEvent(eventId) {
    try {
      return await this.apiClient.get(`/events/${eventId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter evento',
        error.status || 404,
        error.data
      );
    }
  }

  /**
   * Cria um novo evento
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.title - Título do evento
   * @param {string} eventData.description - Descrição do evento
   * @param {string} eventData.date - Data do evento (YYYY-MM-DD)
   * @param {string} eventData.time - Horário do evento (HH:MM)
   * @param {string} eventData.location - Localização
   * @param {string} eventData.category - Categoria
   * @param {number} eventData.max_participants - Máximo de participantes
   * @param {boolean} eventData.is_free - Se é gratuito
   * @param {number} eventData.price - Preço (se não for gratuito)
   * @returns {Promise<Object>} Evento criado
   */
  async createEvent(eventData) {
    try {
      return await this.apiClient.post('/events/', eventData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza um evento
   * @param {number} eventId - ID do evento
   * @param {Object} eventData - Dados atualizados do evento
   * @returns {Promise<Object>} Evento atualizado
   */
  async updateEvent(eventId, eventData) {
    try {
      return await this.apiClient.patch(`/events/${eventId}/`, eventData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Deleta um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    try {
      return await this.apiClient.delete(`/events/${eventId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Inscreve o usuário em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<Object>} Dados da inscrição
   */
  async joinEvent(eventId) {
    try {
      return await this.apiClient.post(`/events/${eventId}/join/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao se inscrever no evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Remove a inscrição do usuário de um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<void>}
   */
  async leaveEvent(eventId) {
    try {
      return await this.apiClient.post(`/events/${eventId}/leave/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao cancelar inscrição no evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém lista de participantes de um evento
   * @param {number} eventId - ID do evento
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de participantes
   */
  async getEventParticipants(eventId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/events/${eventId}/participants/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter participantes do evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém eventos que o usuário está inscrito
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de eventos do usuário
   */
  async getMyEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/events/my-events/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter meus eventos',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém eventos criados pelo usuário
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de eventos criados pelo usuário
   */
  async getCreatedEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/events/created-events/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter eventos criados',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém categorias de eventos disponíveis
   * @returns {Promise<Array>} Lista de categorias
   */
  async getEventCategories() {
    try {
      return await this.apiClient.get('/events/categories/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter categorias de eventos',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém eventos populares/em destaque
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de eventos populares
   */
  async getFeaturedEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/events/featured/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter eventos em destaque',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém eventos próximos
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.days - Número de dias à frente (padrão: 7)
   * @returns {Promise<Object>} Lista de eventos próximos
   */
  async getUpcomingEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        days: params.days || 7,
        ...params
      });
      return await this.apiClient.get(`/events/upcoming/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter eventos próximos',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Faz upload de imagem para um evento
   * @param {number} eventId - ID do evento
   * @param {File} imageFile - Arquivo de imagem
   * @returns {Promise<Object>} Dados da imagem carregada
   */
  async uploadEventImage(eventId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      return await this.apiClient.upload(`/events/${eventId}/upload-image/`, formData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao fazer upload da imagem',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Adiciona comentário a um evento
   * @param {number} eventId - ID do evento
   * @param {string} comment - Texto do comentário
   * @returns {Promise<Object>} Comentário criado
   */
  async addEventComment(eventId, comment) {
    try {
      return await this.apiClient.post(`/events/${eventId}/comments/`, {
        comment
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao adicionar comentário',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém comentários de um evento
   * @param {number} eventId - ID do evento
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de comentários
   */
  async getEventComments(eventId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/events/${eventId}/comments/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter comentários do evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Avalia um evento
   * @param {number} eventId - ID do evento
   * @param {number} rating - Avaliação (1-5)
   * @param {string} review - Comentário da avaliação (opcional)
   * @returns {Promise<Object>} Avaliação criada
   */
  async rateEvent(eventId, rating, review = '') {
    try {
      return await this.apiClient.post(`/events/${eventId}/rate/`, {
        rating,
        review
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao avaliar evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém estatísticas de um evento (para criadores)
   * @param {number} eventId - ID do evento
   * @returns {Promise<Object>} Estatísticas do evento
   */
  async getEventStats(eventId) {
    try {
      return await this.apiClient.get(`/events/${eventId}/stats/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter estatísticas do evento',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Exporta lista de participantes (para criadores)
   * @param {number} eventId - ID do evento
   * @param {string} format - Formato de exportação ('csv', 'xlsx')
   * @returns {Promise<Blob>} Arquivo de exportação
   */
  async exportParticipants(eventId, format = 'csv') {
    try {
      const response = await this.apiClient.get(`/events/${eventId}/export-participants/`, {
        params: { format },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao exportar participantes',
        error.status || 400,
        error.data
      );
    }
  }
}

// Exportar instância singleton
const eventService = new EventService();
export default eventService;

// Exportar classe para casos especiais
export { EventService };