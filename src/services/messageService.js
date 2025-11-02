import api from './api';

class MessageService {
  /**
   * Buscar todas as mensagens do usuário
   */
  async getMessages() {
    try {
      const response = await api.get('/accounts/messages/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  /**
   * Enviar uma nova mensagem
   * @param {Object} messageData - Dados da mensagem
   * @param {number} messageData.recipient_id - ID do destinatário
   * @param {string} messageData.subject - Assunto da mensagem
   * @param {string} messageData.content - Conteúdo da mensagem
   */
  async sendMessage(messageData) {
    try {
      const response = await api.post('/accounts/messages/', messageData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Buscar uma mensagem específica
   * @param {number} messageId - ID da mensagem
   */
  async getMessage(messageId) {
    try {
      const response = await api.get(`/accounts/messages/${messageId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error);
      throw error;
    }
  }

  /**
   * Marcar mensagem como lida
   * @param {number} messageId - ID da mensagem
   */
  async markAsRead(messageId) {
    try {
      const response = await api.patch(`/accounts/messages/${messageId}/mark-read/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      throw error;
    }
  }

  /**
   * Buscar lista de conversas
   */
  async getConversations() {
    try {
      const response = await api.get('/accounts/conversations/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw error;
    }
  }

  /**
   * Buscar mensagens de uma conversa específica
   * @param {number} userId - ID do outro usuário na conversa
   */
  async getConversation(userId) {
    try {
      const response = await api.get(`/accounts/conversations/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      throw error;
    }
  }

  /**
   * Buscar mensagens não lidas
   */
  async getUnreadMessages() {
    try {
      const messages = await this.getMessages();
      return messages.filter(message => !message.is_read);
    } catch (error) {
      console.error('Erro ao buscar mensagens não lidas:', error);
      throw error;
    }
  }

  /**
   * Contar mensagens não lidas
   */
  async getUnreadCount() {
    try {
      const unreadMessages = await this.getUnreadMessages();
      return unreadMessages.length;
    } catch (error) {
      console.error('Erro ao contar mensagens não lidas:', error);
      return 0;
    }
  }

  /**
   * Buscar mensagens entre dois usuários específicos
   * @param {number} userId - ID do outro usuário
   */
  async getMessagesBetweenUsers(userId) {
    try {
      return await this.getConversation(userId);
    } catch (error) {
      console.error('Erro ao buscar mensagens entre usuários:', error);
      throw error;
    }
  }
}

export default new MessageService();