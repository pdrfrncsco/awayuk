import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const VerifyEmail = () => {
  const { user, resendVerificationEmail, logout } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const result = await resendVerificationEmail();
      
      if (result.success) {
        setResendMessage('Email de verificação enviado com sucesso! Verifique a sua caixa de entrada.');
      } else {
        setResendError(result.error || 'Erro ao enviar email. Tente novamente.');
      }
    } catch (error) {
      setResendError('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-4">
            <EnvelopeIcon className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verificar Email</h2>
          <p className="text-gray-600">
            Enviámos um email de verificação para{' '}
            <span className="font-medium text-gray-900">{user?.email}</span>
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Verifique a sua caixa de entrada</h3>
                <p className="text-sm text-gray-600">
                  Procure por um email da AWAYSUK com o assunto "Verificar Email".
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Clique no link de verificação</h3>
                <p className="text-sm text-gray-600">
                  Clique no link no email para verificar a sua conta.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Acesso completo</h3>
                <p className="text-sm text-gray-600">
                  Após a verificação, terá acesso completo à plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagens de feedback */}
        {resendMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-800 text-sm">{resendMessage}</span>
            </div>
          </div>
        )}

        {resendError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800 text-sm">{resendError}</span>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg transition-colors ${
              isResending
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
            }`}
          >
            {isResending ? (
              <>
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                A enviar...
              </>
            ) : (
              <>
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Reenviar Email de Verificação
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não recebeu o email? Verifique a pasta de spam.
            </p>
            <p className="text-sm text-gray-600">
              Email incorreto?{' '}
              <button
                onClick={handleLogout}
                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
              >
                Sair e criar nova conta
              </button>
            </p>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Porquê verificar o email?</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Segurança da sua conta</li>
            <li>• Receber notificações importantes</li>
            <li>• Recuperação de password</li>
            <li>• Acesso completo às funcionalidades</li>
          </ul>
        </div>

        {/* Link para homepage */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Voltar à página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;