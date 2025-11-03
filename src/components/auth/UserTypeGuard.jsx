import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserType from '../../hooks/useUserType';

/**
 * Componente para restringir acesso com base no tipo de usuário
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param {string|Array} props.allowedTypes - Tipo(s) de usuário permitido(s)
 * @param {string} props.redirectTo - Rota para redirecionamento se não tiver permissão
 * @param {React.ReactNode} props.fallback - Componente alternativo a ser renderizado se não tiver permissão
 * @returns {React.ReactNode} - Conteúdo ou redirecionamento
 */
const UserTypeGuard = ({ 
  children, 
  allowedTypes, 
  redirectTo = '/dashboard', 
  fallback = null 
}) => {
  const { isUserType } = useUserType();
  
  // Verifica se o usuário tem o tipo permitido
  const hasPermission = isUserType(allowedTypes);
  
  if (hasPermission) {
    return children;
  }
  
  // Se não tiver permissão, renderiza o fallback ou redireciona
  if (fallback) {
    return fallback;
  }
  
  return <Navigate to={redirectTo} replace />;
};

export default UserTypeGuard;