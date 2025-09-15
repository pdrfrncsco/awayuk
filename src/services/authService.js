import { ApiClient, TokenManager, ApiError } from './api.js';

/**
 * Serviço de autenticação
 * Gerencia login, registro, perfil e operações relacionadas à autenticação
 */
class AuthService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Realiza login do usuário
   * @param {string} username - Nome de usuário ou email
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e tokens
   */
  async login(username, password) {
    try {
      const response = await this.apiClient.post('/auth/login/', {
        username,
        password
      });

      // Armazenar tokens
      if (response.access && response.refresh) {
        TokenManager.setTokens(response.access, response.refresh);
      }

      return response;
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao fazer login',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Realiza registro de novo usuário
   * @param {Object} userData - Dados do usuário
   * @param {string} userData.username - Nome de usuário
   * @param {string} userData.email - Email do usuário
   * @param {string} userData.password - Senha
   * @param {string} userData.password_confirm - Confirmação da senha
   * @param {string} userData.first_name - Primeiro nome
   * @param {string} userData.last_name - Sobrenome
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async register(userData) {
    try {
      const response = await this.apiClient.post('/auth/register/', userData);
      
      // Se o registro incluir tokens, armazená-los
      if (response.access && response.refresh) {
        TokenManager.setTokens(response.access, response.refresh);
      }

      return response;
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao registrar usuário',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Realiza logout do usuário
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      
      if (refreshToken) {
        // Tentar invalidar o token no servidor
        await this.apiClient.post('/auth/logout/', {
          refresh: refreshToken
        });
      }
    } catch (error) {
      // Mesmo se houver erro no servidor, limpar tokens localmente
      console.warn('Erro ao fazer logout no servidor:', error.message);
    } finally {
      // Sempre limpar tokens localmente
      TokenManager.clearTokens();
    }
  }

  /**
   * Obtém o perfil do usuário atual
   * @returns {Promise<Object>} Dados do perfil do usuário
   */
  async getProfile() {
    try {
      return await this.apiClient.get('/auth/profile/');
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter perfil',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza o perfil do usuário
   * @param {Object} profileData - Dados do perfil a serem atualizados
   * @returns {Promise<Object>} Dados do perfil atualizado
   */
  async updateProfile(profileData) {
    try {
      return await this.apiClient.patch('/auth/profile/', profileData);
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao atualizar perfil',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Altera a senha do usuário
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @param {string} confirmPassword - Confirmação da nova senha
   * @returns {Promise<Object>} Resposta da alteração
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      return await this.apiClient.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao alterar senha',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Solicita reset de senha
   * @param {string} email - Email para reset
   * @returns {Promise<Object>} Resposta da solicitação
   */
  async requestPasswordReset(email) {
    try {
      return await this.apiClient.post('/auth/password-reset/', {
        email
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao solicitar reset de senha',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Confirma reset de senha
   * @param {string} token - Token de reset
   * @param {string} newPassword - Nova senha
   * @param {string} confirmPassword - Confirmação da nova senha
   * @returns {Promise<Object>} Resposta da confirmação
   */
  async confirmPasswordReset(token, newPassword, confirmPassword) {
    try {
      return await this.apiClient.post('/auth/password-reset-confirm/', {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao confirmar reset de senha',
        error.status || 400,
        error.data
      );
    }
  }

  /**
   * Atualiza o token de acesso usando o refresh token
   * @returns {Promise<Object>} Novos tokens
   */
  async refreshAccessToken() {
    try {
      return await this.apiClient.refreshToken();
    } catch (error) {
      // Se falhar, fazer logout
      TokenManager.clearTokens();
      throw new ApiError(
        'Sessão expirada. Faça login novamente.',
        401,
        error.data
      );
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} Status de autenticação
   */
  isAuthenticated() {
    return TokenManager.isAuthenticated();
  }

  /**
   * Obtém o token de acesso atual
   * @returns {string|null} Token de acesso
   */
  getAccessToken() {
    return TokenManager.getAccessToken();
  }

  /**
   * Obtém dados do usuário do token (se disponível)
   * @returns {Object|null} Dados do usuário decodificados do token
   */
  getUserFromToken() {
    const token = TokenManager.getAccessToken();
    if (!token) return null;

    try {
      // Decodificar JWT (apenas a parte payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.user_id,
        username: payload.username,
        email: payload.email,
        exp: payload.exp
      };
    } catch (error) {
      console.warn('Erro ao decodificar token:', error);
      return null;
    }
  }

  /**
   * Verifica se o token está expirado
   * @returns {boolean} Status de expiração
   */
  isTokenExpired() {
    const userData = this.getUserFromToken();
    if (!userData || !userData.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return userData.exp < currentTime;
  }
}

// Exportar instância singleton
const authService = new AuthService();
export default authService;

// Exportar classe para casos especiais
export { AuthService };