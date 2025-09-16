import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook personalizado para usar o contexto de autenticação
 * 
 * Este hook fornece uma interface simples para acessar todas as funcionalidades
 * de autenticação da aplicação, incluindo estado do utilizador, funções de login/logout,
 * e verificações de estado.
 * 
 * @returns {Object} Objeto contendo todas as propriedades e métodos do contexto de autenticação
 * @throws {Error} Se usado fora do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

/**
 * Hook para verificar se o utilizador está autenticado
 * 
 * @returns {boolean} true se o utilizador estiver autenticado, false caso contrário
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook para obter informações do utilizador atual
 * 
 * @returns {Object|null} Dados do utilizador ou null se não autenticado
 */
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

/**
 * Hook para verificar se o email do utilizador está verificado
 * 
 * @returns {boolean} true se o email estiver verificado, false caso contrário
 */
export const useIsEmailVerified = () => {
  const { isEmailVerified } = useAuth();
  return isEmailVerified();
};

/**
 * Hook para verificar se uma operação de autenticação está em progresso
 * 
 * @returns {boolean} true se estiver carregando, false caso contrário
 */
export const useAuthLoading = () => {
  const { isLoading } = useAuth();
  return isLoading;
};

/**
 * Hook para obter funções de autenticação
 * 
 * @returns {Object} Objeto contendo as funções de login, logout, register, etc.
 */
export const useAuthActions = () => {
  const { 
    login, 
    logout, 
    register, 
    resendVerificationEmail,
    changePassword,
    requestPasswordReset
  } = useAuth();
  
  return {
    login,
    logout,
    register,
    resendVerificationEmail,
    changePassword,
    requestPasswordReset
  };
};

/**
 * Hook para verificar permissões do utilizador
 * 
 * @param {string} permission - Permissão a verificar
 * @returns {boolean} true se o utilizador tiver a permissão, false caso contrário
 */
export const useHasPermission = (permission) => {
  const { user } = useAuth();
  
  if (!user || !user.permissions) {
    return false;
  }
  
  return user.permissions.includes(permission);
};

/**
 * Hook para verificar se o utilizador tem um papel específico
 * 
 * @param {string} role - Papel a verificar
 * @returns {boolean} true se o utilizador tiver o papel, false caso contrário
 */
export const useHasRole = (role) => {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return user.role === role;
};

/**
 * Hook para verificar se o utilizador é administrador
 * 
 * @returns {boolean} true se for administrador, false caso contrário
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * Hook para verificar se o utilizador é moderador
 * 
 * @returns {boolean} true se for moderador, false caso contrário
 */
export const useIsModerator = () => {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return user.role === 'moderator' || user.role === 'admin';
};

export default useAuth;