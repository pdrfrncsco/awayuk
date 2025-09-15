import { ApiClient, ApiError } from './api.js';

/**
 * Serviço de oportunidades
 * Gerencia todas as operações relacionadas às oportunidades de trabalho e negócios
 */
class OpportunityService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtém lista de oportunidades
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.page - Página atual (padrão: 1)
   * @param {number} params.limit - Limite de itens por página (padrão: 20)
   * @param {string} params.search - Termo de busca
   * @param {string} params.category - Categoria da oportunidade
   * @param {string} params.type - Tipo da oportunidade (job, business, internship, etc.)
   * @param {string} params.location - Localização
   * @param {string} params.salary_min - Salário mínimo
   * @param {string} params.salary_max - Salário máximo
   * @param {string} params.experience_level - Nível de experiência
   * @param {string} params.remote - Trabalho remoto (true/false)
   * @param {string} params.status - Status da oportunidade
   * @param {string} params.ordering - Ordenação (-created_at, salary, etc.)
   * @returns {Promise<Object>} Lista de oportunidades paginada
   */
  async getOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...params
      });

      return await this.apiClient.get(`/opportunities/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidades',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém uma oportunidade específica por ID
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<Object>} Dados da oportunidade
   */
  async getOpportunity(opportunityId) {
    try {
      return await this.apiClient.get(`/opportunities/${opportunityId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidade',
        error.status || 404,
        error.data
      );
    }
  }

  /**
   * Cria uma nova oportunidade
   * @param {Object} opportunityData - Dados da oportunidade
   * @param {string} opportunityData.title - Título da oportunidade
   * @param {string} opportunityData.description - Descrição da oportunidade
   * @param {string} opportunityData.company - Empresa
   * @param {string} opportunityData.location - Localização
   * @param {string} opportunityData.type - Tipo da oportunidade
   * @param {string} opportunityData.category - Categoria
   * @param {number} opportunityData.salary_min - Salário mínimo
   * @param {number} opportunityData.salary_max - Salário máximo
   * @param {string} opportunityData.experience_level - Nível de experiência
   * @param {boolean} opportunityData.remote - Trabalho remoto
   * @param {string} opportunityData.requirements - Requisitos
   * @param {string} opportunityData.benefits - Benefícios
   * @returns {Promise<Object>} Oportunidade criada
   */
  async createOpportunity(opportunityData) {
    try {
      return await this.apiClient.post('/opportunities/', opportunityData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza uma oportunidade
   * @param {number} opportunityId - ID da oportunidade
   * @param {Object} opportunityData - Dados atualizados da oportunidade
   * @returns {Promise<Object>} Oportunidade atualizada
   */
  async updateOpportunity(opportunityId, opportunityData) {
    try {
      return await this.apiClient.patch(`/opportunities/${opportunityId}/`, opportunityData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Deleta uma oportunidade
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<void>}
   */
  async deleteOpportunity(opportunityId) {
    try {
      return await this.apiClient.delete(`/opportunities/${opportunityId}/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao deletar oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Candidata-se a uma oportunidade
   * @param {number} opportunityId - ID da oportunidade
   * @param {Object} applicationData - Dados da candidatura
   * @param {string} applicationData.cover_letter - Carta de apresentação
   * @param {File} applicationData.resume - Currículo (arquivo)
   * @returns {Promise<Object>} Dados da candidatura
   */
  async applyToOpportunity(opportunityId, applicationData) {
    try {
      const formData = new FormData();
      
      if (applicationData.cover_letter) {
        formData.append('cover_letter', applicationData.cover_letter);
      }
      
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      return await this.apiClient.upload(`/opportunities/${opportunityId}/apply/`, formData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao se candidatar à oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Remove candidatura de uma oportunidade
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<void>}
   */
  async withdrawApplication(opportunityId) {
    try {
      return await this.apiClient.delete(`/opportunities/${opportunityId}/withdraw/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao retirar candidatura',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém candidaturas de uma oportunidade (para criadores)
   * @param {number} opportunityId - ID da oportunidade
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de candidaturas
   */
  async getOpportunityApplications(opportunityId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/${opportunityId}/applications/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter candidaturas da oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém oportunidades que o usuário se candidatou
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de candidaturas do usuário
   */
  async getMyApplications(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/my-applications/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter minhas candidaturas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém oportunidades criadas pelo usuário
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de oportunidades criadas pelo usuário
   */
  async getCreatedOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/created-opportunities/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidades criadas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém categorias de oportunidades disponíveis
   * @returns {Promise<Array>} Lista de categorias
   */
  async getOpportunityCategories() {
    try {
      return await this.apiClient.get('/opportunities/categories/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter categorias de oportunidades',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém tipos de oportunidades disponíveis
   * @returns {Promise<Array>} Lista de tipos
   */
  async getOpportunityTypes() {
    try {
      return await this.apiClient.get('/opportunities/types/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter tipos de oportunidades',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém oportunidades em destaque
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de oportunidades em destaque
   */
  async getFeaturedOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/featured/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidades em destaque',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém oportunidades recentes
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.days - Número de dias atrás (padrão: 7)
   * @returns {Promise<Object>} Lista de oportunidades recentes
   */
  async getRecentOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        days: params.days || 7,
        ...params
      });
      return await this.apiClient.get(`/opportunities/recent/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidades recentes',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Salva uma oportunidade como favorita
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<Object>} Dados da operação
   */
  async saveOpportunity(opportunityId) {
    try {
      return await this.apiClient.post(`/opportunities/${opportunityId}/save/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao salvar oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Remove uma oportunidade dos favoritos
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<void>}
   */
  async unsaveOpportunity(opportunityId) {
    try {
      return await this.apiClient.delete(`/opportunities/${opportunityId}/unsave/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao remover oportunidade dos favoritos',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém oportunidades salvas pelo usuário
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de oportunidades salvas
   */
  async getSavedOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/saved/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter oportunidades salvas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza status de uma candidatura (para criadores)
   * @param {number} opportunityId - ID da oportunidade
   * @param {number} applicationId - ID da candidatura
   * @param {string} status - Novo status (pending, reviewing, accepted, rejected)
   * @param {string} notes - Notas sobre a decisão (opcional)
   * @returns {Promise<Object>} Candidatura atualizada
   */
  async updateApplicationStatus(opportunityId, applicationId, status, notes = '') {
    try {
      return await this.apiClient.patch(`/opportunities/${opportunityId}/applications/${applicationId}/`, {
        status,
        notes
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar status da candidatura',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém estatísticas de uma oportunidade (para criadores)
   * @param {number} opportunityId - ID da oportunidade
   * @returns {Promise<Object>} Estatísticas da oportunidade
   */
  async getOpportunityStats(opportunityId) {
    try {
      return await this.apiClient.get(`/opportunities/${opportunityId}/stats/`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter estatísticas da oportunidade',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Exporta candidaturas (para criadores)
   * @param {number} opportunityId - ID da oportunidade
   * @param {string} format - Formato de exportação ('csv', 'xlsx')
   * @returns {Promise<Blob>} Arquivo de exportação
   */
  async exportApplications(opportunityId, format = 'csv') {
    try {
      const response = await this.apiClient.get(`/opportunities/${opportunityId}/export-applications/`, {
        params: { format },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao exportar candidaturas',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Busca oportunidades por localização
   * @param {Object} locationData - Dados de localização
   * @param {number} locationData.latitude - Latitude
   * @param {number} locationData.longitude - Longitude
   * @param {number} locationData.radius - Raio em km (padrão: 50)
   * @param {Object} params - Parâmetros adicionais de consulta
   * @returns {Promise<Object>} Lista de oportunidades próximas
   */
  async searchByLocation(locationData, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        radius: locationData.radius || 50,
        ...params
      });
      return await this.apiClient.get(`/opportunities/search-by-location/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao buscar oportunidades por localização',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Obtém recomendações de oportunidades para o usuário
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise<Object>} Lista de oportunidades recomendadas
   */
  async getRecommendedOpportunities(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.apiClient.get(`/opportunities/recommendations/?${queryParams}`);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter recomendações de oportunidades',
        error.status || 400,
        error.data
      );
    }
  }
}

// Exportar instância singleton
const opportunityService = new OpportunityService();
export default opportunityService;

// Exportar classe para casos especiais
export { OpportunityService };