import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserType from '../../hooks/useUserType';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de guarda para restringir acesso baseado em User Type
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem renderizados se o acesso for permitido
 * @param {string|Array} props.allowedTypes - Tipo(s) de usuário permitidos
 * @param {string} props.redirectTo - Rota para redirecionamento caso o acesso seja negado
 * @returns {React.ReactNode} - Componentes filhos ou redirecionamento
 */
const UserTypeGuard = ({ children, allowedTypes, redirectTo = '/dashboard' }) => {
  const { isUserType } = useUserType();
  const { isAuthenticated } = useAuth();

  // Se o usuário não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário não tiver o tipo permitido, redireciona para a rota especificada
  if (!isUserType(allowedTypes)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se o usuário tiver o tipo permitido, renderiza os componentes filhos
  return children;
};

/**
 * Componente de guarda específico para usuários do tipo 'business'
 */
export const BusinessRoute = ({ children, redirectTo = '/dashboard' }) => {
  return <UserTypeGuard allowedTypes="business" redirectTo={redirectTo}>{children}</UserTypeGuard>;
};

/**
 * Componente de guarda específico para usuários do tipo 'member'
 */
export const MemberRoute = ({ children, redirectTo = '/dashboard' }) => {
  return <UserTypeGuard allowedTypes="member" redirectTo={redirectTo}>{children}</UserTypeGuard>;
};

/**
 * Componente de guarda específico para usuários do tipo 'admin'
 */
export const AdminRoute = ({ children, redirectTo = '/dashboard' }) => {
  return <UserTypeGuard allowedTypes="admin" redirectTo={redirectTo}>{children}</UserTypeGuard>;
};

/**
 * Componente de guarda que permite múltiplos tipos de usuário
 */
export const MultiTypeRoute = ({ children, allowedTypes, redirectTo = '/dashboard' }) => {
  return <UserTypeGuard allowedTypes={allowedTypes} redirectTo={redirectTo}>{children}</UserTypeGuard>;
};

export default UserTypeGuard;