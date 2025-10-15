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
   * Obter perfil de usuário
   * - Se userId for fornecido, retorna perfil detalhado desse usuário
   * - Caso contrário, retorna o perfil do usuário autenticado
   * @param {number} [userId] - ID do usuário (opcional)
   * @returns {Promise<Object>} Dados do perfil
   */
  async getUserProfile(userId = null) {
    try {
      if (userId) {
        return await this.apiClient.get(`/accounts/profile/${userId}/`);
      }
      // Perfil do usuário autenticado (usar serializer de contas para incluir profile_image/cover_image)
      return await this.apiClient.get('/accounts/profile/');
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
   * Obter perfil estendido do usuário autenticado
   * @returns {Promise<Object>} Dados do perfil estendido
   */
  async getExtendedProfile() {
    try {
      return await this.apiClient.get('/accounts/profile/extended/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar perfil estendido',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualizar perfil estendido do usuário autenticado
   * @param {Object} extendedData - Dados do perfil estendido para atualizar
   * @returns {Promise<Object>} Perfil estendido atualizado
   */
  async updateExtendedProfile(extendedData) {
    try {
      return await this.apiClient.patch('/accounts/profile/extended/', extendedData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar perfil estendido',
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
   * Upload direto de imagem para perfil via PATCH multipart
   * @param {File} imageFile - Arquivo de imagem
   * @param {string} imageType - Tipo da imagem ('profile' ou 'cover')
   * @returns {Promise<Object>} Usuário atualizado (UserSerializer)
   */
  async uploadProfileImage(imageFile, imageType = 'profile') {
    try {
      const formData = new FormData();
      const key = imageType === 'cover' ? 'cover_image' : 'profile_image';
      formData.append(key, imageFile);

      // PATCH multipart directly to user profile endpoint
      const updatedUser = await this.apiClient.patch('/accounts/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return updatedUser;
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