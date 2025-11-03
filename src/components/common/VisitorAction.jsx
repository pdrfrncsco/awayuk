import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente que gerencia ações que requerem autenticação ou status de membro
 * 
 * @param {Object} props
 * @param {string} props.actionType - Tipo de ação ('send-message', 'event-registration', 'opportunity-application')
 * @param {boolean} props.isAuthenticated - Se o usuário está autenticado
 * @param {boolean} props.isMember - Se o usuário é membro
 * @param {string} props.buttonText - Texto do botão
 * @param {string} props.buttonClassName - Classes CSS para o botão
 * @param {Function} props.onAction - Função a ser executada quando a ação for permitida
 */
const VisitorAction = ({ 
  actionType = 'default',
  isAuthenticated = false,
  isMember = false,
  buttonText,
  buttonClassName,
  onAction
}) => {
  // Função simples para substituir o useTranslation
  const t = (key) => {
    const translations = {
      'auth.registerToSendMessages': 'Registe-se para enviar mensagens aos membros da comunidade',
      'auth.registerForEvent': 'Registe-se para se inscrever neste evento',
      'auth.registerForOpportunity': 'Registe-se para se candidatar a esta oportunidade',
      'auth.registerToUse': 'Registe-se para continuar a utilizar esta funcionalidade',
      'auth.becomeMember': 'Torne-se membro',
      'auth.registrationRequired': 'Registo necessário',
      'common.continue': 'Continuar',
      'auth.register': 'Registar',
      'auth.login': 'Entrar',
      'common.cancel': 'Cancelar'
    };
    return translations[key] || key;
  };
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Determinar mensagem baseada no tipo de ação
  const getActionMessage = () => {
    switch (actionType) {
      case 'send-message':
        return t('auth.registerToSendMessages');
      case 'event-registration':
        return t('auth.registerForEvent');
      case 'opportunity-application':
        return t('auth.registerForOpportunity');
      default:
        return t('auth.registerToUse');
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      if (isMember) {
        // Usuário autenticado e membro - permitir ação
        onAction && onAction();
      } else {
        // Usuário autenticado mas não é membro - mostrar modal de onboarding
        setShowModal(true);
      }
    } else {
      // Usuário não autenticado - mostrar modal de registro
      setShowModal(true);
    }
  };

  const handleRedirect = (path) => {
    setShowModal(false);
    navigate(path);
  };
  
  // Redirecionar para o onboarding se o usuário estiver autenticado mas não for membro
  const handleOnboarding = () => {
    setShowModal(false);
    navigate('/onboarding');
  };

  return (
    <>
      <button 
        className={buttonClassName || "bg-red-500 text-white px-4 py-2 rounded"}
        onClick={handleClick}
      >
        {buttonText || t('common.continue')}
      </button>

      {/* Modal para usuários não autenticados ou não membros */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-user-lock text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isAuthenticated 
                  ? t('auth.becomeMember') 
                  : t('auth.registrationRequired')}
              </h3>
              <p className="text-sm text-gray-500">
                {getActionMessage()}
              </p>
            </div>
            
            <div className="space-y-3">
              {!isAuthenticated ? (
                <>
                  <button
                    className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleRedirect('/registo')}
                  >
                    {t('auth.register')}
                  </button>
                  <button
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => handleRedirect('/login')}
                  >
                    {t('auth.login')}
                  </button>
                </>
              ) : (
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
                  onClick={handleOnboarding}
                >
                  {t('auth.completeProfile')}
                </button>
              )}
              
              <button
                className="w-full text-gray-500 py-2 px-4 text-sm hover:text-gray-700 transition-colors"
                onClick={() => setShowModal(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitorAction;