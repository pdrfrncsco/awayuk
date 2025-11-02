import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Componente para gerenciar ações que requerem registro
 * 
 * Este componente verifica se o utilizador está autenticado antes de permitir
 * uma ação. Se não estiver autenticado, mostra um modal ou redireciona para registro.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onAction - Função a executar se autenticado
 * @param {React.ReactNode} props.children - Botão ou elemento que aciona a ação
 * @param {boolean} props.showModal - Se true, mostra modal em vez de redirecionar
 * @param {string} props.redirectTo - Caminho para redirecionamento se não autenticado
 * @param {boolean} props.requireMember - Se true, requer que o usuário seja membro
 * @returns {React.ReactElement} Componente com lógica de autenticação
 */
const VisitorAction = ({ 
  onAction, 
  children, 
  showModal = true,
  redirectTo = '/login',
  requireMember = false,
  actionType = 'default' // 'message', 'event', 'opportunity'
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Verificar se o usuário é membro (tem onboarding completo)
  const isMember = user?.onboarding_completed || false;

  const handleAction = (e) => {
    e.preventDefault();
    
    // Se autenticado e não requer ser membro, ou se é membro quando necessário
    if (isAuthenticated && (!requireMember || isMember)) {
      onAction();
      return;
    }
    
    // Se não autenticado e deve mostrar modal
    if (!isAuthenticated && showModal) {
      setIsModalOpen(true);
      return;
    }
    
    // Se requer ser membro mas não é membro
    if (isAuthenticated && requireMember && !isMember) {
      navigate('/onboarding');
      return;
    }
    
    // Caso contrário, redirecionar para login
    navigate(redirectTo, { 
      state: { 
        from: window.location.pathname,
        actionType 
      } 
    });
  };

  // Mensagens específicas por tipo de ação
  const getActionMessage = () => {
    switch (actionType) {
      case 'message':
        return t('auth.registerToMessage');
      case 'event':
        return t('auth.registerToJoinEvent');
      case 'opportunity':
        return t('auth.registerToApplyOpportunity');
      default:
        return t('auth.registerToContinue');
    }
  };

  return (
    <>
      {/* Elemento clicável que aciona a verificação */}
      {React.cloneElement(children, { onClick: handleAction })}
      
      {/* Modal de registro (se showModal=true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('auth.registrationRequired')}
            </h3>
            <p className="text-gray-600 mb-6">
              {getActionMessage()}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/registo', { 
                    state: { 
                      from: window.location.pathname,
                      actionType 
                    } 
                  });
                }}
              >
                {t('auth.register')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitorAction;