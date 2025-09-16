import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  ExclamationTriangleIcon, 
  HomeIcon, 
  ArrowLeftIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
            <ShieldExclamationIcon className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 text-lg">
            Não tem permissão para aceder a esta página.
          </p>
        </div>

        {/* Informação do utilizador */}
        {user && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {user.first_name?.[0] || user.username?.[0] || 'U'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.username
                  }
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Informações da Conta:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Papel: {user.role || 'Membro'}</li>
                <li>• Email verificado: {user.is_email_verified ? 'Sim' : 'Não'}</li>
                <li>• Conta ativa: {user.is_active ? 'Sim' : 'Não'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Possíveis razões */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Possíveis razões para este erro:
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Não tem as permissões necessárias</li>
                <li>• A sua conta não foi verificada</li>
                <li>• O seu papel não permite acesso a esta funcionalidade</li>
                <li>• A sessão pode ter expirado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar
            </button>
            
            <Link
              to="/"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Página Inicial
            </Link>
          </div>

          {/* Opção de logout se necessário */}
          {user && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Problemas com a sua conta?
              </p>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                Terminar sessão e fazer login novamente
              </button>
            </div>
          )}
        </div>

        {/* Informação de contacto */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Precisa de ajuda?</h3>
          <p className="text-sm text-blue-700">
            Se acredita que deveria ter acesso a esta página, contacte o administrador 
            ou envie um email para{' '}
            <a 
              href="mailto:suporte@awaysuk.com" 
              className="font-medium underline hover:no-underline"
            >
              suporte@awaysuk.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;