import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, TokenManager, accountsService } from '../services';

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

  // Verificar se existe utilizador logado ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = TokenManager.getAccessToken();
        
        if (token && !TokenManager.isTokenExpired(token)) {
          // Token válido, buscar dados do utilizador
          try {
            const userData = await authService.getProfile();
            const permsData = await accountsService.getCurrentUserPermissions();
            const mergedUser = mergeUserWithPermissions(userData, permsData);
            setUser(mergedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Erro ao buscar dados do utilizador:', error);
            // Token inválido, tentar refresh
            await handleTokenRefresh();
          }
        } else {
          // Tentar refresh token se disponível
          await handleTokenRefresh();
        }
      } catch (error) {
        console.error('Erro ao verificar estado de autenticação:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    const handleTokenRefresh = async () => {
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          await authService.refreshAccessToken();
          const userData = await authService.getProfile();
          const permsData = await accountsService.getCurrentUserPermissions();
          const mergedUser = mergeUserWithPermissions(userData, permsData);
          setUser(mergedUser);
          setIsAuthenticated(true);
        } else {
          await logout();
        }
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        await logout();
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(username, password);
      
      // Após login, buscar perfil e permissões do utilizador
      const userData = await authService.getProfile();
      const permsData = await accountsService.getCurrentUserPermissions();
      const mergedUser = mergeUserWithPermissions(userData, permsData);
      setUser(mergedUser);
      setIsAuthenticated(true);
      return { success: true, user: mergedUser };
      
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
      
    } catch (error) {
      console.error('Erro no login:', error);
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registo
  const register = async (formData) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(formData);
      
      if (response.user) {
        return { 
          success: true, 
          user: response.user,
          message: response.message || 'Conta criada com sucesso. Verifique o seu email.'
        };
      }
      
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
      
    } catch (error) {
      console.error('Erro no registo:', error);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.email) {
          errorMessage = errorData.email[0];
        } else if (errorData.username) {
          errorMessage = errorData.username[0];
        } else if (errorData.password) {
          errorMessage = errorData.password[0];
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        }
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await authService.logout();
      
      // Limpar estado
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      setIsAuthenticated(false);
      TokenManager.clearTokens();
      
      return { success: false, error: 'Erro ao fazer logout.' };
    }
  };

  // Função para atualizar perfil do utilizador
  const updateProfile = async (updatedData) => {
    try {
      setIsLoading(true);
      
      const response = await authService.updateProfile(updatedData);
      
      if (response) {
        // Buscar dados atualizados do utilizador e permissões
        const userData = await authService.getProfile();
        const permsData = await accountsService.getCurrentUserPermissions();
        const mergedUser = mergeUserWithPermissions(userData, permsData);
        setUser(mergedUser);
        
        return { success: true, user: mergedUser };
      }
      
      return { success: false, error: 'Erro ao atualizar perfil.' };
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      let errorMessage = 'Erro ao atualizar perfil.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        }
      }
      
      return { success: false, error: errorMessage };
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
    // Utiliza o campo correto fornecido pelo backend
    return user?.is_verified || false;
  };

  // Função para reenviar email de verificação
  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      
      const response = await authService.resendVerificationEmail();
      
      return { 
        success: true, 
        message: response.message || 'Email de verificação enviado.' 
      };
      
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      let errorMessage = 'Erro ao enviar email de verificação.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para alterar password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      
      const response = await authService.changePassword({
        old_password: currentPassword,
        new_password: newPassword
      });
      
      return { 
        success: true, 
        message: response.message || 'Password alterada com sucesso.' 
      };
      
    } catch (error) {
      console.error('Erro ao alterar password:', error);
      let errorMessage = 'Erro ao alterar password.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.old_password) {
          errorMessage = errorData.old_password[0];
        } else if (errorData.new_password) {
          errorMessage = errorData.new_password[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para solicitar reset de password
  const requestPasswordReset = async (email) => {
    try {
      setIsLoading(true);
      
      const response = await authService.requestPasswordReset({ email });
      
      return { 
        success: true, 
        message: response.message || 'Email de recuperação enviado.' 
      };
      
    } catch (error) {
      console.error('Erro ao solicitar reset de password:', error);
      let errorMessage = 'Erro ao enviar email de recuperação.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return { success: false, error: errorMessage };
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
    resendVerificationEmail,
    
    // Funções de password
    changePassword,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper para combinar perfil com roles/permissões do backend
const mergeUserWithPermissions = (userData, permsData) => {
  const roles = Array.isArray(permsData?.roles) ? permsData.roles : [];
  const permissions = Array.isArray(permsData?.permissions) ? permsData.permissions : [];
  const isAdmin = !!permsData?.is_admin;
  const derivedRole = isAdmin
    ? 'admin'
    : (roles[0] || userData?.role || 'member');

  return {
    ...userData,
    roles,
    permissions,
    role: derivedRole,
    is_admin: isAdmin,
    is_business_user: !!permsData?.is_business_user,
    is_premium_user: !!permsData?.is_premium_user
  };
};

export default AuthContext;