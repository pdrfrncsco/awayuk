import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * Este componente verifica se o utilizador está autenticado antes de permitir
 * o acesso a uma rota. Se não estiver autenticado, redireciona para a página de login.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a renderizar se autenticado
 * @param {boolean} props.requireEmailVerification - Se true, requer email verificado
 * @param {string|string[]} props.requiredRoles - Papel(is) necessário(s) para acesso
 * @param {string|string[]} props.requiredPermissions - Permissão(ões) necessária(s) para acesso
 * @param {string} props.redirectTo - Caminho para redirecionamento se não autorizado
 * @param {React.ReactNode} props.fallback - Componente a mostrar enquanto carrega
 * @returns {React.ReactElement} Componente protegido ou redirecionamento
 */
const ProtectedRoute = ({ 
  children, 
  requireEmailVerification = false,
  requiredRoles = null,
  requiredPermissions = null,
  redirectTo = '/login',
  fallback = null
}) => {
  const { user, isAuthenticated, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Verificar se email está verificado (se necessário)
  if (requireEmailVerification && !isEmailVerified()) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Verificar papéis necessários
  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = user?.role;
    
    if (!userRole || !roles.includes(userRole)) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }
  }

  // Verificar permissões necessárias
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const userPermissions = user?.permissions || [];
    
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }
  }

  // Se todas as verificações passaram, renderizar os filhos
  return children;
};

/**
 * Componente para proteger rotas que requerem que o utilizador NÃO esteja autenticado
 * (ex: páginas de login, registro)
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a renderizar se não autenticado
 * @param {string} props.redirectTo - Caminho para redirecionamento se autenticado
 * @returns {React.ReactElement} Componente ou redirecionamento
 */
export const GuestRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirecionar se já autenticado
  if (isAuthenticated) {
    // Verificar se há um destino salvo no state
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Se não autenticado, renderizar os filhos
  return children;
};

/**
 * Componente para proteger rotas de administrador
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a renderizar
 * @returns {React.ReactElement} Componente protegido
 */
export const AdminRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute 
      requiredRoles="admin" 
      requireEmailVerification={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Componente para proteger rotas de moderador
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a renderizar
 * @returns {React.ReactElement} Componente protegido
 */
export const ModeratorRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute 
      requiredRoles={['admin', 'moderator']} 
      requireEmailVerification={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Componente para proteger rotas que requerem email verificado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a renderizar
 * @returns {React.ReactElement} Componente protegido
 */
export const VerifiedRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute 
      requireEmailVerification={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;