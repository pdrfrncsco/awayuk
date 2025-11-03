import React from 'react';
import useUserType from '../../hooks/useUserType';

/**
 * Componente para exibir ou esconder conteúdo com base no tipo de usuário
 * e mostrar feedback visual quando necessário
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param {string|Array} props.allowedTypes - Tipo(s) de usuário permitido(s)
 * @param {boolean} props.showFeedback - Se deve mostrar feedback quando não tiver permissão
 * @param {React.ReactNode} props.feedbackMessage - Mensagem personalizada de feedback
 * @returns {React.ReactNode} - Conteúdo ou feedback
 */
const UserTypeRestriction = ({ 
  children, 
  allowedTypes, 
  showFeedback = true,
  feedbackMessage = null
}) => {
  const { isUserType, userType } = useUserType();
  
  // Verifica se o usuário tem o tipo permitido
  const hasPermission = isUserType(allowedTypes);
  
  if (hasPermission) {
    return children;
  }
  
  // Se não tiver permissão e showFeedback for true, mostra feedback
  if (showFeedback) {
    const typeArray = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    const defaultMessage = `Este recurso está disponível apenas para ${typeArray.join(' ou ')}.`;
    
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-800">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p>{feedbackMessage || defaultMessage}</p>
        </div>
      </div>
    );
  }
  
  // Se não tiver permissão e showFeedback for false, não renderiza nada
  return null;
};

export default UserTypeRestriction;