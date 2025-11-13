import { ApiClient, ApiError } from './api.js';

/**
 * Serviço para gestão de membros
 * Gerencia operações CRUD e funcionalidades relacionadas aos membros da comunidade
 */
class MembersService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtém lista de membros com filtros e paginação
   * @param {Object} params - Parâmetros de busca
   * @param {string} params.search - Termo de busca
   * @param {string} params.status - Status do membro (active, pending, inactive)
   * @param {string} params.role - Papel do membro (admin, moderator, member)
   * @param {string} params.location - Localização
   * @param {number} params.page - Página atual
   * @param {number} params.limit - Limite de resultados por página
   * @param {string} params.ordering - Campo para ordenação
   * @returns {Promise<Object>} Lista paginada de membros
   */
  async getMembers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar parâmetros de busca
      // Backend atual só suporta filtro por user_type em /accounts/users/
      if (params.user_type) queryParams.append('user_type', params.user_type);
      // Busca e outros filtros não são suportados pelo endpoint atual; faremos client-side no componente
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('page_size', params.limit);
      if (params.ordering) queryParams.append('ordering', params.ordering);

      const response = await this.apiClient.get(`/accounts/users/?${queryParams.toString()}`);
      
      // Transformar dados para o formato esperado pelo frontend
      const transformedResults = response.results?.map(user => this.transformUserData(user)) || [];
      
      return {
        results: transformedResults,
        count: response.count || transformedResults.length,
        next: response.next,
        previous: response.previous,
        totalPages: Math.ceil((response.count || transformedResults.length) / (params.limit || 20))
      };
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter lista de membros',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obtém detalhes de um membro específico
   * @param {number} memberId - ID do membro
   * @returns {Promise<Object>} Dados do membro
   */
  async getMember(memberId) {
    try {
      const response = await this.apiClient.get(`/accounts/users/${memberId}/`);
      return this.transformUserData(response);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter dados do membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Cria um novo membro
   * @param {Object} memberData - Dados do novo membro
   * @returns {Promise<Object>} Dados do membro criado
   */
  async createMember(memberData) {
    try {
      const transformedData = this.transformMemberDataForAPI(memberData);
      // Endpoint /accounts/users/ não suporta criação direta.
      // Utilizar o endpoint de registo para criar utilizadores.
      const response = await this.apiClient.post('/accounts/register/', {
        username: memberData.username,
        email: memberData.email,
        first_name: memberData.firstName || '',
        last_name: memberData.lastName || '',
        user_type: memberData.user_type || 'member',
        password: memberData.password,
        password_confirm: memberData.password_confirm
      });
      return this.transformUserData(response);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao criar membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualiza dados de um membro
   * @param {number} memberId - ID do membro
   * @param {Object} memberData - Dados atualizados
   * @returns {Promise<Object>} Dados do membro atualizado
   */
  async updateMember(memberId, memberData) {
    try {
      const transformedData = this.transformMemberDataForAPI(memberData);
      const response = await this.apiClient.patch(`/accounts/users/${memberId}/`, transformedData);
      return this.transformUserData(response);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Remove um membro
   * @param {number} memberId - ID do membro
   * @returns {Promise<void>}
   */
  async deleteMember(memberId) {
    try {
      await this.apiClient.delete(`/accounts/users/${memberId}/`);
      return { success: true };
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao remover membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Ativa ou desativa um membro
   * @param {number} memberId - ID do membro
   * @param {boolean} isActive - Status ativo/inativo
   * @returns {Promise<Object>} Dados do membro atualizado
   */
  async toggleMemberStatus(memberId, isActive) {
    try {
      const response = await this.apiClient.patch(`/accounts/users/${memberId}/`, {
        is_active: isActive
      });
      return this.transformUserData(response);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao alterar status do membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Atualiza o papel de um membro
   * @param {number} memberId - ID do membro
   * @param {string} role - Novo papel (admin, moderator, member)
   * @returns {Promise<Object>} Dados do membro atualizado
   */
  async updateMemberRole(memberId, role) {
    try {
      const response = await this.apiClient.patch(`/accounts/users/${memberId}/`, {
        role: role
      });
      return this.transformUserData(response);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar papel do membro',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obtém estatísticas dos membros
   * @returns {Promise<Object>} Estatísticas dos membros
   */
  async getMembersStats() {
    try {
      const response = await this.apiClient.get('/accounts/users/stats/');
      return response;
    } catch (error) {
      // Se não houver endpoint específico, calcular estatísticas
      try {
        const allMembers = await this.getMembers({ limit: 1000 });
        return this.calculateMembersStats(allMembers.results);
      } catch (fallbackError) {
        throw new ApiError(
          'Erro ao obter estatísticas dos membros',
          500,
          fallbackError.data
        );
      }
    }
  }

  /**
   * Exporta dados dos membros
   * @param {Object} filters - Filtros para exportação
   * @param {string} format - Formato de exportação (csv, excel)
   * @returns {Promise<Blob>} Arquivo para download
   */
  async exportMembers(filters = {}, format = 'csv') {
    try {
      const queryParams = new URLSearchParams(filters);
      queryParams.append('format', format);
      
      const response = await this.apiClient.get(
        `/accounts/users/export/?${queryParams.toString()}`,
        { responseType: 'blob' }
      );
      
      return response;
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao exportar dados dos membros',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Transforma dados do usuário da API para o formato do frontend
   * @param {Object} userData - Dados do usuário da API
   * @returns {Object} Dados transformados
   */
  transformUserData(userData) {
    // Mapear campos disponíveis no UserSerializer e UserProfile
    const profile = userData.profile || {};
    // Derivar 'role' a partir de active_roles ou user_type
    const activeRoles = Array.isArray(userData.active_roles) ? userData.active_roles : [];
    let derivedRole = 'member';
    if (activeRoles.some(r => ['admin', 'super_admin'].includes(r))) {
      derivedRole = 'admin';
    } else if (activeRoles.some(r => ['community_moderator'].includes(r))) {
      derivedRole = 'moderator';
    } else if (userData.user_type === 'admin') {
      derivedRole = 'admin';
    } else {
      derivedRole = 'member';
    }

    // Interests vêm como texto; transformar em array
    const interestsText = profile.interests || '';
    const interestsArr = typeof interestsText === 'string'
      ? interestsText.split(',').map(v => v.trim()).filter(Boolean)
      : Array.isArray(interestsText) ? interestsText : [];

    return {
      id: userData.id,
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      email: userData.email,
      phone: userData.phone || '',
      location: userData.location || '',
      joinDate: userData.member_since || userData.created_at,
      status: (userData.is_verified ? 'active' : 'inactive'),
      role: derivedRole,
      profession: userData.profession || '',
      company: profile.company || '',
      avatar: userData.profile_image || null,
      isVerified: userData.is_verified || false,
      bio: userData.bio || '',
      website: profile.website || '',
      linkedin: profile.linkedin || '',
      twitter: profile.twitter || '',
      // Não há 'skills' explícito; usar qualifications como aproximação
      skills: Array.isArray(profile.qualifications) ? profile.qualifications : [],
      interests: interestsArr
    };
  }

  /**
   * Transforma dados do membro do frontend para o formato da API
   * @param {Object} memberData - Dados do membro do frontend
   * @returns {Object} Dados transformados para API
   */
  transformMemberDataForAPI(memberData) {
    return {
      username: memberData.username || '',
      first_name: memberData.firstName || '',
      last_name: memberData.lastName || '',
      email: memberData.email,
      phone: memberData.phone || '',
      location: memberData.location || '',
      profession: memberData.profession || '',
      company: memberData.company || '',
      bio: memberData.bio || '',
      website: memberData.website || '',
      linkedin: memberData.linkedin || '',
      twitter: memberData.twitter || '',
      skills: memberData.skills || [],
      interests: memberData.interests || [],
      is_active: memberData.status === 'active',
      role: memberData.role || 'member',
      user_type: memberData.user_type || 'member'
    };
  }

  /**
   * Calcula estatísticas dos membros
   * @param {Array} members - Lista de membros
   * @returns {Object} Estatísticas calculadas
   */
  calculateMembersStats(members) {
    const total = members.length;
    const active = members.filter(m => m.status === 'active').length;
    const pending = members.filter(m => m.status === 'pending').length;
    const inactive = members.filter(m => m.status === 'inactive').length;
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = members.filter(m => {
      const joinDate = new Date(m.joinDate);
      return joinDate >= thisMonth;
    }).length;

    const roleStats = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {});

    const locationStats = members.reduce((acc, member) => {
      if (member.location) {
        acc[member.location] = (acc[member.location] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      total,
      active,
      pending,
      inactive,
      newThisMonth,
      growthRate: total > 0 ? ((newThisMonth / total) * 100).toFixed(1) : '0',
      roleStats,
      locationStats
    };
  }
}

// Exportar instância única
export const membersService = new MembersService();
export default membersService;