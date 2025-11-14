import axios from 'axios';

// Base URL configurável via variável de ambiente Vite
const API_BASE_URL = (import.meta?.env?.VITE_API_URL) || 'http://127.0.0.1:8000/api';

/**
 * Serviço base de API para comunicação com o backend
 * Fornece configurações comuns e métodos utilitários usando Axios
 */

/**
 * Classe para gerenciar tokens de autenticação
 */
class TokenManager {
  static getAccessToken() {
    return localStorage.getItem('access_token');
  }

  static getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  static clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  static isAuthenticated() {
    return !!this.getAccessToken();
  }

  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      // Decodificar o payload do JWT (sem verificar assinatura)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar se o token expirou
      return payload.exp < currentTime;
    } catch (error) {
      // Se não conseguir decodificar, considerar como expirado
      return true;
    }
  }
}

/**
 * Classe principal para requisições HTTP usando Axios
 */
class ApiClient {
  constructor(config = {}) {
    // Configuração base do Axios
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config
    });

    // Interceptor para adicionar token automaticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = TokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas e erros
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      async (error) => {
        const hasResponse = !!error.response;
        const status = error.response?.status;
        const data = error.response?.data;
        const originalRequest = error.config || {};
        const isRefreshRequest = (originalRequest?.url || '').includes('/auth/token/refresh/');
        const hasRefreshToken = !!TokenManager.getRefreshToken();

        // Tentar renovar token automaticamente em 401 token_not_valid
        const tokenInvalid = status === 401 && (
          data?.code === 'token_not_valid' ||
          String(data?.detail || '').toLowerCase().includes('token not valid') ||
          String(data?.detail || '').toLowerCase().includes('given token not valid')
        );
        if (tokenInvalid && !originalRequest._retry && !isRefreshRequest && hasRefreshToken) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            const newAccess = TokenManager.getAccessToken();
            if (newAccess) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
            }
            return await this.axiosInstance.request(originalRequest);
          } catch (refreshErr) {
            TokenManager.clearTokens();
            const friendly = new ApiError(
              'Sessão expirada. Por favor, faça login novamente.',
              401,
              data
            );
            return Promise.reject(friendly);
          }
        }

        // Se for a própria chamada de refresh ou não houver refresh token, não tentar novamente
        if (tokenInvalid && (isRefreshRequest || !hasRefreshToken)) {
          TokenManager.clearTokens();
          const friendly = new ApiError(
            'Sessão expirada ou inválida. Faça login novamente.',
            401,
            data
          );
          return Promise.reject(friendly);
        }

        if (hasResponse) {
          let friendlyMessage = data?.user_message || data?.detail || data?.message || error.message || 'Erro na requisição';
          if (status === 401) {
            const code = String(data?.code || '').toLowerCase();
            if (code === 'not_authenticated') {
              friendlyMessage = 'Faça login para continuar.';
            } else if (code === 'authentication_failed') {
              friendlyMessage = 'Credenciais inválidas. Verifique e tente novamente.';
            } else {
              friendlyMessage = 'Sessão expirada ou inválida. Faça login novamente.';
            }
          }
          if (status === 403) {
            friendlyMessage = data?.user_message || friendlyMessage || 'Você não tem permissão para realizar esta ação.';
          }
          const apiError = new ApiError(friendlyMessage, status, data);
          return Promise.reject(apiError);
        } else if (error.request) {
          const apiError = new ApiError('Erro de conexão', 0, { originalError: error });
          return Promise.reject(apiError);
        } else {
          const apiError = new ApiError('Erro desconhecido', 0, { originalError: error });
          return Promise.reject(apiError);
        }
      }
    );
  }

  /**
   * Métodos HTTP públicos
   */
  async get(endpoint, config = {}) {
    return this.axiosInstance.get(endpoint, config);
  }

  async post(endpoint, data, config = {}) {
    return this.axiosInstance.post(endpoint, data, config);
  }

  async put(endpoint, data, config = {}) {
    return this.axiosInstance.put(endpoint, data, config);
  }

  async patch(endpoint, data, config = {}) {
    return this.axiosInstance.patch(endpoint, data, config);
  }

  async delete(endpoint, config = {}) {
    return this.axiosInstance.delete(endpoint, config);
  }

  /**
   * Método para fazer upload de arquivos
   */
  async upload(endpoint, formData, config = {}) {
    return this.axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    });
  }

  /**
   * Método para atualizar token de acesso
   */
  async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError('Token de refresh não encontrado', 401);
    }

    try {
      // Usar axios direto para evitar interceptores e loops em erro de refresh
      const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken
      }, { headers: { 'Content-Type': 'application/json' } });
      
      TokenManager.setTokens(response.access, response.refresh);
      const newAccess = TokenManager.getAccessToken();
      if (newAccess) {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      }
      return response;
    } catch (error) {
      TokenManager.clearTokens();
      throw error;
    }
  }
}

/**
 * Classe de erro personalizada para API
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  isAuthError() {
    return this.status === 401;
  }

  isForbiddenError() {
    return this.status === 403;
  }

  isNotFoundError() {
    return this.status === 404;
  }

  isValidationError() {
    return this.status === 400;
  }

  isServerError() {
    return this.status >= 500;
  }
}

// Instância global do cliente API
const apiClient = new ApiClient();

// Exportações
export { ApiClient, TokenManager, ApiError };
export default apiClient;