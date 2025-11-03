import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook para verificar o tipo de usuário e permissões baseadas em UserType
 * @returns {Object} Funções para verificar o tipo de usuário
 */
const useUserType = () => {
  const { user } = useContext(AuthContext);

  /**
   * Verifica se o usuário é de um tipo específico
   * @param {string|Array} types - Tipo(s) de usuário a verificar
   * @returns {boolean} - Verdadeiro se o usuário for do tipo especificado
   */
  const isUserType = (types) => {
    if (!user) return false;
    
    // Converter para array se for string
    const typeArray = Array.isArray(types) ? types : [types];
    
    return typeArray.includes(user.user_type);
  };

  /**
   * Verifica se o usuário é do tipo 'business'
   * @returns {boolean} - Verdadeiro se o usuário for do tipo 'business'
   */
  const isBusiness = () => {
    return isUserType('business');
  };

  /**
   * Verifica se o usuário é do tipo 'member'
   * @returns {boolean} - Verdadeiro se o usuário for do tipo 'member'
   */
  const isMember = () => {
    return isUserType('member');
  };

  /**
   * Verifica se o usuário é do tipo 'admin'
   * @returns {boolean} - Verdadeiro se o usuário for do tipo 'admin'
   */
  const isAdmin = () => {
    return isUserType('admin') || (user && user.is_admin);
  };

  return {
    isUserType,
    isBusiness,
    isMember,
    isAdmin,
    userType: user?.user_type
  };
};

export default useUserType;