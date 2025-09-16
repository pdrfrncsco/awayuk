import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, resendVerificationEmail } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error

  // Verificar se há token de verificação na URL
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Se há um token na URL, tentar verificar automaticamente
    if (token) {
      verifyEmailToken(token);
    }
  }, [token]);

  useEffect(() => {
    // Countdown para reenvio de email
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyEmailToken = async (verificationToken) => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a chamada para verificar o token
      // const result = await authService.verifyEmail(verificationToken);
      
      // Simulação de verificação bem-sucedida
      setTimeout(() => {
        setVerificationStatus('success');
        setSuccess('Email verificado com sucesso! A sua conta está agora ativa.');
        setIsLoading(false);
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verificado! Pode agora fazer login.' }
          });
        }, 3000);
      }, 2000);
      
    } catch (error) {
      setVerificationStatus('error');
      setError('Token de verificação inválido ou expirado.');
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await resendVerificationEmail();
      
      if (result.success) {
        setEmailSent(true);
        setSuccess('Email de verificação reenviado com sucesso!');
        setCountdown(60); // 60 segundos de cooldown
      } else {
        setError(result.error || 'Erro ao reenviar email. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao reenviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Se está verificando o token
  if (token && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
              <ArrowPathIcon className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">A Verificar Email</h2>
            <p className="text-gray-600">
              Por favor aguarde enquanto verificamos o seu email...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se a verificação foi bem-sucedida
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verificado!</h2>
            <p className="text-gray-600 mb-4">
              A sua conta foi verificada com sucesso. Pode agora aceder a todas as funcionalidades.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 text-sm">
                Bem-vindo à comunidade AWAYSUK! A redirecionar para o login...
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se houve erro na verificação
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
              <XMarkIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Erro na Verificação</h2>
            <p className="text-gray-600 mb-4">
              O link de verificação é inválido ou expirou.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={isLoading || countdown > 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    A enviar...
                  </div>
                ) : countdown > 0 ? (
                  `Reenviar em ${countdown}s`
                ) : (
                  'Reenviar Email de Verificação'
                )}
              </button>
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página principal de verificação de email
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
            <EnvelopeIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verificar Email</h2>
          <p className="text-gray-600">
            Enviámos um email de verificação para a sua caixa de entrada
          </p>
        </div>

        {/* Mensagens de feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-800 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Passos para verificar a sua conta:</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Verifique a sua caixa de entrada</h4>
                <p className="text-sm text-gray-600">
                  Procure por um email de <strong>noreply@awaysuk.com</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Clique no link de verificação</h4>
                <p className="text-sm text-gray-600">
                  O link é válido por 24 horas
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Acesso completo</h4>
                <p className="text-sm text-gray-600">
                  Após a verificação, terá acesso a todas as funcionalidades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium mb-1">Não recebeu o email?</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Verifique a pasta de spam/lixo</li>
                <li>• Confirme que o endereço de email está correto</li>
                <li>• Aguarde alguns minutos (pode demorar até 5 minutos)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isLoading || countdown > 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                A enviar...
              </div>
            ) : countdown > 0 ? (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Reenviar em {countdown}s
              </div>
            ) : (
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Reenviar Email de Verificação
              </div>
            )}
          </button>

          <div className="flex space-x-3">
            <Link
              to="/login"
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Voltar ao Login
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Informação de contacto */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Problemas com a verificação?{' '}
            <Link to="/contacto" className="text-yellow-600 hover:text-yellow-500 font-medium">
              Contacte-nos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;