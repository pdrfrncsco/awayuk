import { ApiClient, ApiError } from './api.js';

/**
 * Serviço de notificações
 * Gerencia todas as operações relacionadas às notificações do usuário
 */
class NotificationService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtém todas as notificações do usuário
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.page - Página atual (padrão: 1)
   * @param {number} params.limit - Limite de itens por página (padrão: 20)
   * @param {boolean} params.unread_only - Apenas não lidas (padrão: false)
   * @returns {Promise<Object>} Lista de notificações paginada
   */
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        unread_only: params.unread_only || false,
        ...params
      });

      return await this.apiClient.get(`/notifications/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter notificações',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém uma notificação específica por ID
   * @param {number} notificationId - ID da notificação
   * @returns {Promise<Object>} Dados da notificação
   */
  async getNotification(notificationId) {
    try {
      return await this.apiClient.get(`/notifications/${notificationId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter notificação',
        error.status || 404,
        error.data
      );
    }
  }

  /**
   * Marca uma notificação como lida
   * @param {number} notificationId - ID da notificação
   * @returns {Promise<Object>} Notificação atualizada
   */
  async markAsRead(notificationId) {
    try {
      return await this.apiClient.patch(`/notifications/${notificationId}/`, {
        is_read: true
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao marcar notificação como lida',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Marca uma notificação como não lida
   * @param {number} notificationId - ID da notificação
   * @returns {Promise<Object>} Notificação atualizada
   */
  async markAsUnread(notificationId) {
    try {
      return await this.apiClient.patch(`/notifications/${notificationId}/`, {
        is_read: false
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao marcar notificação como não lida',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Marca todas as notificações como lidas
   * @returns {Promise<Object>} Resultado da operação
   */
  async markAllAsRead() {
    try {
      return await this.apiClient.post('/notifications/mark-all-read/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao marcar todas as notificações como lidas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Deleta uma notificação
   * @param {number} notificationId - ID da notificação
   * @returns {Promise<void>}
   */
  async deleteNotification(notificationId) {
    try {
      return await this.apiClient.delete(`/notifications/${notificationId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar notificação',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Deleta todas as notificações lidas
   * @returns {Promise<Object>} Resultado da operação
   */
  async deleteAllRead() {
    try {
      return await this.apiClient.delete('/notifications/delete-all-read/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar notificações lidas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém o contador de notificações não lidas
   * @returns {Promise<Object>} Contador de notificações
   */
  async getUnreadCount() {
    try {
      return await this.apiClient.get('/notifications/unread-count/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter contador de notificações',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém configurações de notificação do usuário
   * @returns {Promise<Object>} Configurações de notificação
   */
  async getNotificationSettings() {
    try {
      return await this.apiClient.get('/notifications/settings/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter configurações de notificação',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza configurações de notificação do usuário
   * @param {Object} settings - Novas configurações
   * @param {boolean} settings.email_notifications - Notificações por email
   * @param {boolean} settings.push_notifications - Notificações push
   * @param {boolean} settings.event_notifications - Notificações de eventos
   * @param {boolean} settings.opportunity_notifications - Notificações de oportunidades
   * @returns {Promise<Object>} Configurações atualizadas
   */
  async updateNotificationSettings(settings) {
    try {
      return await this.apiClient.patch('/notifications/settings/', settings);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar configurações de notificação',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Cria uma nova notificação (para admins)
   * @param {Object} notificationData - Dados da notificação
   * @param {string} notificationData.title - Título da notificação
   * @param {string} notificationData.message - Mensagem da notificação
   * @param {string} notificationData.type - Tipo da notificação
   * @param {number} notificationData.user_id - ID do usuário destinatário
   * @returns {Promise<Object>} Notificação criada
   */
  async createNotification(notificationData) {
    try {
      return await this.apiClient.post('/notifications/', notificationData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar notificação',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Envia notificação em massa (para admins)
   * @param {Object} notificationData - Dados da notificação
   * @param {string} notificationData.title - Título da notificação
   * @param {string} notificationData.message - Mensagem da notificação
   * @param {string} notificationData.type - Tipo da notificação
   * @param {Array} notificationData.user_ids - IDs dos usuários destinatários
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendBulkNotification(notificationData) {
    try {
      return await this.apiClient.post('/notifications/bulk/', notificationData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao enviar notificações em massa',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém estatísticas de notificações (para admins)
   * @param {Object} params - Parâmetros de consulta
   * @param {string} params.start_date - Data de início (YYYY-MM-DD)
   * @param {string} params.end_date - Data de fim (YYYY-MM-DD)
   * @returns {Promise<Object>} Estatísticas de notificações
   */
  async getNotificationStats(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/notifications/stats/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter estatísticas de notificações',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Subscreve para notificações push
   * @param {Object} subscription - Dados da subscrição
   * @returns {Promise<Object>} Resultado da subscrição
   */
  async subscribeToPush(subscription) {
    try {
      return await this.apiClient.post('/notifications/push-subscribe/', subscription);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao subscrever para notificações push',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Cancela subscrição de notificações push
   * @param {string} endpoint - Endpoint da subscrição
   * @returns {Promise<Object>} Resultado do cancelamento
   */
  async unsubscribeFromPush(endpoint) {
    try {
      return await this.apiClient.post('/notifications/push-unsubscribe/', {
        endpoint
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao cancelar subscrição de notificações push',
        error.status || 400,
        error.data
      );
    }
  }
}

// Exportar instância singleton
const notificationService = new NotificationService();
export default notificationService;

// Exportar classe para casos especiais
export { NotificationService };