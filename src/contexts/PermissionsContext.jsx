import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

// Definição de papéis e permissões
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  GUEST: 'guest'
};

const PERMISSIONS = {
  // Dashboard geral
  VIEW_DASHBOARD: 'view_dashboard',
  // Gestão de utilizadores (usado em rotas de Roles)
  MANAGE_USERS: 'manage_users',
  
  // Membros
  VIEW_MEMBERS: 'view_members',
  CREATE_MEMBER: 'create_member',
  EDIT_MEMBER: 'edit_member',
  DELETE_MEMBER: 'delete_member',
  MANAGE_MEMBER_ROLES: 'manage_member_roles',
  
  // Eventos
  VIEW_EVENTS: 'view_events',
  CREATE_EVENT: 'create_event',
  EDIT_EVENT: 'edit_event',
  DELETE_EVENT: 'delete_event',
  MANAGE_EVENT_PARTICIPANTS: 'manage_event_participants',
  
  // Oportunidades
  VIEW_OPPORTUNITIES: 'view_opportunities',
  CREATE_OPPORTUNITY: 'create_opportunity',
  EDIT_OPPORTUNITY: 'edit_opportunity',
  DELETE_OPPORTUNITY: 'delete_opportunity',
  MANAGE_APPLICATIONS: 'manage_applications',
  
  // Conteúdos
  VIEW_CONTENT: 'view_content',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  
  // Estatísticas
  VIEW_STATISTICS: 'view_statistics',
  VIEW_DETAILED_ANALYTICS: 'view_detailed_analytics',
  EXPORT_DATA: 'export_data',
  
  // Configurações
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_SYSTEM: 'manage_system'
};

// Mapeamento de papéis para permissões
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Acesso total a todas as permissões
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    
    // Membros (limitado)
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.EDIT_MEMBER,
    
    // Eventos
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.EDIT_EVENT,
    PERMISSIONS.MANAGE_EVENT_PARTICIPANTS,
    
    // Oportunidades
    PERMISSIONS.VIEW_OPPORTUNITIES,
    PERMISSIONS.CREATE_OPPORTUNITY,
    PERMISSIONS.EDIT_OPPORTUNITY,
    PERMISSIONS.MANAGE_APPLICATIONS,
    
    // Conteúdos
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
    
    // Estatísticas (limitado)
    PERMISSIONS.VIEW_STATISTICS,
    
    // Configurações (limitado)
    PERMISSIONS.VIEW_SETTINGS
  ],
  
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    
    // Membros (apenas visualização)
    PERMISSIONS.VIEW_MEMBERS,
    
    // Eventos (limitado)
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.CREATE_EVENT,
    
    // Oportunidades (limitado)
    PERMISSIONS.VIEW_OPPORTUNITIES,
    PERMISSIONS.CREATE_OPPORTUNITY,
    
    // Conteúdos (limitado)
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    
    // Estatísticas (básico)
    PERMISSIONS.VIEW_STATISTICS
  ],
  
  [ROLES.GUEST]: [
    // Acesso muito limitado
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.VIEW_OPPORTUNITIES,
    PERMISSIONS.VIEW_CONTENT
  ]
};

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const { user } = useAuth();
  
  const userRole = useMemo(() => {
    if (!user) return ROLES.GUEST;
    if (user.role) return user.role;
    if (user.is_admin) return ROLES.ADMIN;
    if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles[0];
    return ROLES.MEMBER;
  }, [user]);
  
  const userPermissions = useMemo(() => {
    // Começa com permissões do backend se existirem,
    // caso contrário cai para permissões por papel
    const base = (Array.isArray(user?.permissions) && user.permissions.length > 0)
      ? [...user.permissions]
      : [...(ROLE_PERMISSIONS[userRole] || [])];

    // Garantir acesso ao dashboard para utilizadores autenticados
    if (user && !base.includes(PERMISSIONS.VIEW_DASHBOARD)) {
      base.push(PERMISSIONS.VIEW_DASHBOARD);
    }
    return base;
  }, [user, userRole]);
  
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };
  
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };
  
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };
  
  const canAccessDashboard = () => {
    return hasPermission(PERMISSIONS.VIEW_DASHBOARD);
  };
  
  const canManageMembers = () => {
    return hasAnyPermission([
      PERMISSIONS.CREATE_MEMBER,
      PERMISSIONS.EDIT_MEMBER,
      PERMISSIONS.DELETE_MEMBER,
      PERMISSIONS.MANAGE_MEMBER_ROLES
    ]);
  };
  
  const canManageEvents = () => {
    return hasAnyPermission([
      PERMISSIONS.CREATE_EVENT,
      PERMISSIONS.EDIT_EVENT,
      PERMISSIONS.DELETE_EVENT,
      PERMISSIONS.MANAGE_EVENT_PARTICIPANTS
    ]);
  };
  
  const canManageOpportunities = () => {
    return hasAnyPermission([
      PERMISSIONS.CREATE_OPPORTUNITY,
      PERMISSIONS.EDIT_OPPORTUNITY,
      PERMISSIONS.DELETE_OPPORTUNITY,
      PERMISSIONS.MANAGE_APPLICATIONS
    ]);
  };
  
  const canManageContent = () => {
    return hasAnyPermission([
      PERMISSIONS.CREATE_CONTENT,
      PERMISSIONS.EDIT_CONTENT,
      PERMISSIONS.DELETE_CONTENT,
      PERMISSIONS.PUBLISH_CONTENT
    ]);
  };
  
  const canViewDetailedStatistics = () => {
    return hasPermission(PERMISSIONS.VIEW_DETAILED_ANALYTICS);
  };
  
  const canManageSettings = () => {
    return hasPermission(PERMISSIONS.MANAGE_SETTINGS);
  };
  
  const value = {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessDashboard,
    canManageMembers,
    canManageEvents,
    canManageOpportunities,
    canManageContent,
    canViewDetailedStatistics,
    canManageSettings,
    ROLES,
    PERMISSIONS
  };
  
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export { ROLES, PERMISSIONS };