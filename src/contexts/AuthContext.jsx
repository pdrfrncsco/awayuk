import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se existe utilizador logado no localStorage ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('awayuk_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Verificar se a sessão ainda é válida (exemplo: 24 horas)
          const loginTime = new Date(userData.loginTime);
          const currentTime = new Date();
          const timeDifference = currentTime - loginTime;
          const hoursElapsed = timeDifference / (1000 * 60 * 60);
          
          if (hoursElapsed < 24 && userData.isLoggedIn) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Sessão expirada
            localStorage.removeItem('awayuk_user');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar estado de autenticação:', error);
        localStorage.removeItem('awayuk_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular resposta da API
      const userData = {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        email: email,
        phone: '+44 7123 456 789',
        currentCity: 'Londres',
        originProvince: 'Luanda',
        profession: 'Engenheiro de Software',
        interests: ['Tecnologia', 'Networking', 'Cultura Angolana'],
        languagesSpoken: ['Português', 'Inglês', 'Kimbundu'],
        arrivalYear: 2020,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('João Silva')}&background=f59e0b&color=fff`,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      // Guardar no localStorage
      localStorage.setItem('awayuk_user', JSON.stringify(userData));
      
      // Atualizar estado
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registo
  const register = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API de registo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular criação de conta
      const userData = {
        id: Date.now(), // ID temporário
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        currentCity: formData.currentCity,
        postcode: formData.postcode,
        originProvince: formData.originProvince,
        arrivalYear: formData.arrivalYear,
        profession: formData.profession,
        interests: formData.interests,
        languagesSpoken: formData.languagesSpoken,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&background=f59e0b&color=fff`,
        isLoggedIn: false, // Conta criada mas não logada automaticamente
        createdAt: new Date().toISOString(),
        emailVerified: false
      };
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Erro no registo:', error);
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    try {
      // Remover dados do localStorage
      localStorage.removeItem('awayuk_user');
      
      // Limpar estado
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout.' };
    }
  };

  // Função para atualizar perfil do utilizador
  const updateProfile = async (updatedData) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      // Atualizar localStorage
      localStorage.setItem('awayuk_user', JSON.stringify(updatedUser));
      
      // Atualizar estado
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro ao atualizar perfil.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar se o utilizador tem permissão
  const hasPermission = (permission) => {
    if (!isAuthenticated || !user) return false;
    
    // Implementar lógica de permissões conforme necessário
    // Por agora, todos os utilizadores autenticados têm as mesmas permissões
    const userPermissions = [
      'view_events',
      'register_events',
      'view_opportunities',
      'apply_opportunities',
      'view_community',
      'contact_members'
    ];
    
    return userPermissions.includes(permission);
  };

  // Função para obter dados do utilizador atual
  const getCurrentUser = () => {
    return user;
  };

  // Função para verificar se o email está verificado
  const isEmailVerified = () => {
    return user?.emailVerified || false;
  };

  // Função para reenviar email de verificação
  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Email de verificação enviado.' };
      
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      return { success: false, error: 'Erro ao enviar email de verificação.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // Estado
    user,
    isLoading,
    isAuthenticated,
    
    // Funções de autenticação
    login,
    register,
    logout,
    
    // Funções de perfil
    updateProfile,
    getCurrentUser,
    
    // Funções de permissões
    hasPermission,
    
    // Funções de verificação
    isEmailVerified,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;