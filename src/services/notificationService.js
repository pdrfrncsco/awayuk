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
      return await this.apiClient.post(`/notifications/${notificationId}/mark-read/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao marcar notificação como lida',
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
   * Obtém estatísticas de notificações
   * @returns {Promise<Object>} Estatísticas
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
   * Obtém resumo de notificações
   * @returns {Promise<Object>} Resumo
   */
  async getNotificationSummary(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/notifications/summary/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter resumo de notificações',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém configurações/preferências de notificação do usuário
   * @returns {Promise<Object>} Preferências de notificação
   */
  async getNotificationSettings() {
    try {
      return await this.apiClient.get('/notifications/preferences/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter configurações de notificação',
        error.status || 400,
        error.data
      );
    }
  }

  async updateNotificationSettings(settings) {
    try {
      return await this.apiClient.patch('/notifications/preferences/', settings);
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

  /**
   * Envia uma notificação de teste para o utilizador autenticado
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendTestNotification() {
    try {
      return await this.apiClient.post('/notifications/test/', {});
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao enviar notificação de teste',
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