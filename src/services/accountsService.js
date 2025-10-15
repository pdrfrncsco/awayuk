import apiClient from './api.js';

class AccountsService {
  // Roles Management
  async getRoles(params = {}) {
    try {
      const response = await apiClient.get('/accounts/roles', { params });
      return this.transformRolesResponse(response.data);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      return this.getDefaultRoles();
    }
  }

  async getRole(roleId) {
    try {
      const response = await apiClient.get(`/accounts/roles/${roleId}`);
      return this.transformRoleResponse(response.data);
    } catch (error) {
      console.error('Erro ao buscar role:', error);
      throw error;
    }
  }

  async createRole(roleData) {
    try {
      const response = await apiClient.post('/accounts/roles', roleData);
      return this.transformRoleResponse(response.data);
    } catch (error) {
      console.error('Erro ao criar role:', error);
      throw error;
    }
  }

  async updateRole(roleId, roleData) {
    try {
      const response = await apiClient.put(`/accounts/roles/${roleId}`, roleData);
      return this.transformRoleResponse(response.data);
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      throw error;
    }
  }

  async deleteRole(roleId) {
    try {
      await apiClient.delete(`/accounts/roles/${roleId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao eliminar role:', error);
      throw error;
    }
  }

  // Permissions Management
  async getPermissions() {
    try {
      const response = await apiClient.get('/accounts/permissions');
      return this.transformPermissionsResponse(response.data);
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      return this.getDefaultPermissions();
    }
  }

  // Current user permissions and roles
  async getCurrentUserPermissions() {
    try {
      // This endpoint returns the authenticated user's permissions/roles
      const data = await apiClient.get('/accounts/permissions');
      // Expected shape: { permissions: [], roles: [], is_admin, is_business_user, is_premium_user }
      return data;
    } catch (error) {
      console.error('Erro ao buscar permissões do utilizador:', error);
      throw error;
    }
  }

  async getRolePermissions(roleId) {
    try {
      const response = await apiClient.get(`/accounts/roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar permissões da role:', error);
      throw error;
    }
  }

  async updateRolePermissions(roleId, permissions) {
    try {
      const response = await apiClient.put(`/accounts/roles/${roleId}/permissions`, {
        permissions
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar permissões da role:', error);
      throw error;
    }
  }

  // User Role Assignments
  async getUserRoles(params = {}) {
    try {
      const response = await apiClient.get('/accounts/user-roles', { params });
      return this.transformUserRolesResponse(response.data);
    } catch (error) {
      console.error('Erro ao buscar atribuições de roles:', error);
      return this.getDefaultUserRoles();
    }
  }

  async assignRole(userId, roleId, options = {}) {
    try {
      const response = await apiClient.post('/accounts/user-roles', {
        userId,
        roleId,
        ...options
      });
      return this.transformUserRoleResponse(response.data);
    } catch (error) {
      console.error('Erro ao atribuir role:', error);
      throw error;
    }
  }

  async updateUserRole(userRoleId, data) {
    try {
      const response = await apiClient.put(`/accounts/user-roles/${userRoleId}`, data);
      return this.transformUserRoleResponse(response.data);
    } catch (error) {
      console.error('Erro ao atualizar atribuição de role:', error);
      throw error;
    }
  }

  async revokeRole(userRoleId) {
    try {
      await apiClient.delete(`/accounts/user-roles/${userRoleId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao revogar role:', error);
      throw error;
    }
  }

  async getUsersByRole(roleId, params = {}) {
    try {
      const response = await apiClient.get(`/accounts/roles/${roleId}/users`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar utilizadores por role:', error);
      throw error;
    }
  }

  // User Management
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get('/accounts/users', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar utilizadores:', error);
      throw error;
    }
  }

  async getUserRoleHistory(userId) {
    try {
      const response = await apiClient.get(`/accounts/users/${userId}/role-history`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de roles:', error);
      throw error;
    }
  }

  // Statistics
  async getRoleStatistics() {
    try {
      const response = await apiClient.get('/accounts/statistics/roles');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de roles:', error);
      return this.getDefaultRoleStatistics();
    }
  }

  // Data transformation methods
  transformRolesResponse(data) {
    if (data.roles) {
      return {
        roles: data.roles.map(role => this.transformRole(role)),
        pagination: data.pagination || {},
        total: data.total || data.roles.length
      };
    }
    return { roles: [], pagination: {}, total: 0 };
  }

  transformRoleResponse(data) {
    return this.transformRole(data);
  }

  transformRole(role) {
    return {
      id: role.id,
      name: role.name,
      displayName: role.display_name || role.displayName,
      description: role.description,
      userCount: role.user_count || role.userCount || 0,
      permissions: role.permissions || [],
      isActive: role.is_active !== undefined ? role.is_active : role.isActive !== undefined ? role.isActive : true,
      createdAt: role.created_at || role.createdAt,
      updatedAt: role.updated_at || role.updatedAt
    };
  }

  transformPermissionsResponse(data) {
    if (Array.isArray(data)) {
      return data.map(permission => this.transformPermission(permission));
    }
    return data.permissions ? data.permissions.map(permission => this.transformPermission(permission)) : [];
  }

  transformPermission(permission) {
    return {
      id: permission.id,
      name: permission.name,
      category: permission.category,
      description: permission.description
    };
  }

  transformUserRolesResponse(data) {
    if (data.userRoles) {
      return {
        userRoles: data.userRoles.map(userRole => this.transformUserRole(userRole)),
        pagination: data.pagination || {},
        total: data.total || data.userRoles.length
      };
    }
    return { userRoles: [], pagination: {}, total: 0 };
  }

  transformUserRoleResponse(data) {
    return this.transformUserRole(data);
  }

  transformUserRole(userRole) {
    return {
      id: userRole.id,
      user: {
        id: userRole.user?.id || userRole.user_id,
        name: userRole.user?.name,
        email: userRole.user?.email,
        avatar: userRole.user?.profile_image || userRole.user?.avatar
      },
      role: {
        id: userRole.role?.id || userRole.role_id,
        name: userRole.role?.name,
        displayName: userRole.role?.display_name || userRole.role?.displayName
      },
      grantedBy: {
        id: userRole.granted_by?.id || userRole.granted_by_id,
        name: userRole.granted_by?.name,
        email: userRole.granted_by?.email
      },
      grantedAt: userRole.granted_at || userRole.grantedAt,
      expiresAt: userRole.expires_at || userRole.expiresAt,
      isActive: userRole.is_active !== undefined ? userRole.is_active : userRole.isActive !== undefined ? userRole.isActive : true,
      context: userRole.context || {}
    };
  }

  // Default/fallback data
  getDefaultRoles() {
    return {
      roles: [
        {
          id: 1,
          name: 'admin',
          displayName: 'Administrador',
          description: 'Acesso total ao sistema com todas as permissões',
          userCount: 3,
          permissions: ['view_dashboard', 'manage_users', 'manage_events', 'manage_opportunities', 'manage_content', 'view_statistics', 'manage_settings'],
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'moderator',
          displayName: 'Moderador',
          description: 'Gestão de conteúdo e eventos da comunidade',
          userCount: 8,
          permissions: ['view_dashboard', 'manage_events', 'manage_opportunities', 'manage_content', 'view_statistics'],
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 3,
          name: 'premium_member',
          displayName: 'Membro Premium',
          description: 'Acesso a funcionalidades premium da plataforma',
          userCount: 45,
          permissions: ['view_dashboard', 'create_events', 'create_opportunities', 'create_content'],
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 4,
          name: 'member',
          displayName: 'Membro',
          description: 'Acesso básico à plataforma',
          userCount: 234,
          permissions: ['view_dashboard', 'view_events', 'view_opportunities', 'view_content'],
          isActive: true,
          createdAt: '2024-01-15'
        }
      ],
      pagination: { page: 1, limit: 10, total: 4, totalPages: 1 },
      total: 4
    };
  }

  getDefaultPermissions() {
    return [
      { id: 'view_dashboard', name: 'Ver Dashboard', category: 'Dashboard' },
      { id: 'manage_users', name: 'Gerir Utilizadores', category: 'Utilizadores' },
      { id: 'view_users', name: 'Ver Utilizadores', category: 'Utilizadores' },
      { id: 'manage_events', name: 'Gerir Eventos', category: 'Eventos' },
      { id: 'create_events', name: 'Criar Eventos', category: 'Eventos' },
      { id: 'view_events', name: 'Ver Eventos', category: 'Eventos' },
      { id: 'manage_opportunities', name: 'Gerir Oportunidades', category: 'Oportunidades' },
      { id: 'create_opportunities', name: 'Criar Oportunidades', category: 'Oportunidades' },
      { id: 'view_opportunities', name: 'Ver Oportunidades', category: 'Oportunidades' },
      { id: 'manage_content', name: 'Gerir Conteúdo', category: 'Conteúdo' },
      { id: 'create_content', name: 'Criar Conteúdo', category: 'Conteúdo' },
      { id: 'view_content', name: 'Ver Conteúdo', category: 'Conteúdo' },
      { id: 'view_statistics', name: 'Ver Estatísticas', category: 'Estatísticas' },
      { id: 'manage_settings', name: 'Gerir Configurações', category: 'Sistema' }
    ];
  }

  getDefaultUserRoles() {
    return {
      userRoles: [
        {
          id: 1,
          user: { id: 1, name: 'João Silva', email: 'joao@example.com', avatar: null },
          role: { id: 1, name: 'admin', displayName: 'Administrador' },
          grantedBy: { id: 0, name: 'Sistema', email: 'system@awaysuk.com' },
          grantedAt: '2024-01-15T10:00:00Z',
          expiresAt: null,
          isActive: true,
          context: {}
        },
        {
          id: 2,
          user: { id: 2, name: 'Maria Santos', email: 'maria@example.com', avatar: null },
          role: { id: 2, name: 'moderator', displayName: 'Moderador' },
          grantedBy: { id: 1, name: 'João Silva', email: 'joao@example.com' },
          grantedAt: '2024-02-01T14:30:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          isActive: true,
          context: { community: 'Londres' }
        },
        {
          id: 3,
          user: { id: 3, name: 'Pedro Costa', email: 'pedro@example.com', avatar: null },
          role: { id: 3, name: 'premium_member', displayName: 'Membro Premium' },
          grantedBy: { id: 0, name: 'Sistema', email: 'system@awaysuk.com' },
          grantedAt: '2024-03-15T09:15:00Z',
          expiresAt: '2025-03-15T09:15:00Z',
          isActive: true,
          context: {}
        }
      ],
      pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
      total: 3
    };
  }

  getDefaultRoleStatistics() {
    return {
      totalRoles: 4,
      totalUsers: 290,
      activeAssignments: 287,
      expiredAssignments: 3,
      roleDistribution: [
        { role: 'member', count: 234, percentage: 80.7 },
        { role: 'premium_member', count: 45, percentage: 15.5 },
        { role: 'moderator', count: 8, percentage: 2.8 },
        { role: 'admin', count: 3, percentage: 1.0 }
      ]
    };
  }
}

// Create and export service instance
const accountsService = new AccountsService();
export { AccountsService, accountsService };
export default accountsService;
