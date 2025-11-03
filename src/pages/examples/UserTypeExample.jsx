import React from 'react';
import UserTypeGuard from '../../components/auth/UserTypeGuard';
import UserTypeRestriction from '../../components/auth/UserTypeRestriction';
import useUserType from '../../hooks/useUserType';

const UserTypeExample = () => {
  const { userType, isBusiness, isMember, isAdmin } = useUserType();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Restrições por UserType</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Seu tipo de usuário: {userType || 'Não autenticado'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Status de Membro:</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${isMember() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {isMember() ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Status de Empresa:</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${isBusiness() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {isBusiness() ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Status de Admin:</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${isAdmin() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
              {isAdmin() ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exemplo de conteúdo restrito para empresas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos para Empresas</h2>
          
          <UserTypeRestriction allowedTypes="business">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Painel de Oportunidades</h3>
              <p className="text-blue-700">Aqui você pode gerenciar todas as suas oportunidades de negócio.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Criar Nova Oportunidade
              </button>
            </div>
          </UserTypeRestriction>
        </div>
        
        {/* Exemplo de conteúdo restrito para membros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos para Membros</h2>
          
          <UserTypeRestriction allowedTypes="member">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Painel de Candidaturas</h3>
              <p className="text-green-700">Aqui você pode ver todas as suas candidaturas a oportunidades.</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Explorar Oportunidades
              </button>
            </div>
          </UserTypeRestriction>
        </div>
        
        {/* Exemplo de conteúdo restrito para admins */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos para Administradores</h2>
          
          <UserTypeRestriction allowedTypes="admin">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="font-medium text-purple-800 mb-2">Painel de Administração</h3>
              <p className="text-purple-700">Aqui você pode gerenciar todos os aspectos da plataforma.</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Acessar Painel Admin
              </button>
            </div>
          </UserTypeRestriction>
        </div>
        
        {/* Exemplo de conteúdo restrito para múltiplos tipos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos para Empresas e Admins</h2>
          
          <UserTypeRestriction allowedTypes={['business', 'admin']}>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">Relatórios Avançados</h3>
              <p className="text-amber-700">Acesse relatórios detalhados sobre o desempenho da plataforma.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                Ver Relatórios
              </button>
            </div>
          </UserTypeRestriction>
        </div>
      </div>
    </div>
  );
};

export default UserTypeExample;