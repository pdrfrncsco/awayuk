import { ApiClient, ApiError } from './api.js';

/**
 * Serviço para gerenciar operações relacionadas ao perfil do usuário
 * Inclui perfil detalhado, serviços, portfólio e testemunhos
 */
class ProfileService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obter perfil detalhado de um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Dados detalhados do perfil
   */
  async getUserProfile(userId) {
    try {
      return await this.apiClient.get(`/accounts/profile/${userId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar perfil do usuário',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualizar perfil do usuário autenticado
   * @param {Object} profileData - Dados do perfil para atualizar
   * @returns {Promise<Object>} Perfil atualizado
   */
  async updateProfile(profileData) {
    try {
      return await this.apiClient.patch('/accounts/profile/', profileData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar perfil',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obter serviços do usuário autenticado
   * @returns {Promise<Array>} Lista de serviços
   */
  async getUserServices() {
    try {
      return await this.apiClient.get('/accounts/services/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar serviços',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Criar novo serviço
   * @param {Object} serviceData - Dados do serviço
   * @returns {Promise<Object>} Serviço criado
   */
  async createService(serviceData) {
    try {
      return await this.apiClient.post('/accounts/services/', serviceData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar serviço',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualizar serviço
   * @param {number} serviceId - ID do serviço
   * @param {Object} serviceData - Dados do serviço
   * @returns {Promise<Object>} Serviço atualizado
   */
  async updateService(serviceId, serviceData) {
    try {
      return await this.apiClient.patch(`/accounts/services/${serviceId}/`, serviceData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar serviço',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Deletar serviço
   * @param {number} serviceId - ID do serviço
   * @returns {Promise<void>}
   */
  async deleteService(serviceId) {
    try {
      return await this.apiClient.delete(`/accounts/services/${serviceId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar serviço',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obter portfólio do usuário autenticado
   * @returns {Promise<Array>} Lista de itens do portfólio
   */
  async getUserPortfolio() {
    try {
      return await this.apiClient.get('/accounts/portfolio/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar portfólio',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Criar novo item do portfólio
   * @param {Object} portfolioData - Dados do item do portfólio
   * @returns {Promise<Object>} Item do portfólio criado
   */
  async createPortfolioItem(portfolioData) {
    try {
      return await this.apiClient.post('/accounts/portfolio/', portfolioData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar item do portfólio',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualizar item do portfólio
   * @param {number} portfolioId - ID do item do portfólio
   * @param {Object} portfolioData - Dados do item do portfólio
   * @returns {Promise<Object>} Item do portfólio atualizado
   */
  async updatePortfolioItem(portfolioId, portfolioData) {
    try {
      return await this.apiClient.patch(`/accounts/portfolio/${portfolioId}/`, portfolioData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar item do portfólio',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Deletar item do portfólio
   * @param {number} portfolioId - ID do item do portfólio
   * @returns {Promise<void>}
   */
  async deletePortfolioItem(portfolioId) {
    try {
      return await this.apiClient.delete(`/accounts/portfolio/${portfolioId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar item do portfólio',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obter testemunhos de um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Array>} Lista de testemunhos
   */
  async getUserTestimonials(userId) {
    try {
      return await this.apiClient.get(`/accounts/testimonials/${userId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar testemunhos',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Upload de imagem para perfil
   * @param {File} imageFile - Arquivo de imagem
   * @param {string} imageType - Tipo da imagem ('profile' ou 'cover')
   * @returns {Promise<Object>} URL da imagem
   */
  async uploadProfileImage(imageFile, imageType = 'profile') {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('type', imageType);
      
      return await this.apiClient.upload('/accounts/profile/upload-image/', formData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao fazer upload da imagem',
        error.status || 500,
        error.data
      );
    }
  }
}

// Instância singleton do serviço
const profileServiceInstance = new ProfileService();

export { ProfileService };
export default profileServiceInstance;