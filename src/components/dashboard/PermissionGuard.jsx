import React from 'react';
import { usePermissions } from '../../contexts/PermissionsContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Componente para proteger conteúdo baseado em permissões
const PermissionGuard = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null, 
  showFallback = true,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    // Se nenhuma permissão for especificada, permite acesso
    hasAccess = true;
  }
  
  if (hasAccess) {
    return children;
  }
  
  if (fallback) {
    return fallback;
  }
  
  if (!showFallback) {
    return null;
  }
  
  // Fallback padrão
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        Acesso Restrito
      </h3>
      <p className="text-yellow-700">
        Não tem permissões suficientes para aceder a esta funcionalidade.
      </p>
    </div>
  );
};

// Componente para proteger rotas inteiras
export const RouteGuard = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  redirectTo = '/dashboard',
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  // Temporariamente permite acesso a todas as rotas para desenvolvimento
  let hasAccess = true;
  
  // Código original comentado para futura implementação
  /*
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true;
  }
  */
  
  if (hasAccess) {
    return children;
  }
  
  // Página de acesso negado
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-6">
              Não tem permissões para aceder a esta página.
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar/ocultar elementos baseado em permissões
export const PermissionCheck = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  children,
  fallback = null
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true;
  }
  
  return hasAccess ? children : fallback;
};

// Hook para verificar permissões condicionalmente
export const useConditionalPermissions = () => {
  const permissions = usePermissions();
  
  const checkPermission = (permission) => {
    return permissions.hasPermission(permission);
  };
  
  const checkAnyPermission = (permissionList) => {
    return permissions.hasAnyPermission(permissionList);
  };
  
  const checkAllPermissions = (permissionList) => {
    return permissions.hasAllPermissions(permissionList);
  };
  
  return {
    ...permissions,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions
  };
};

export default PermissionGuard;