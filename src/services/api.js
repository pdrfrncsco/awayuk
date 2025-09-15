import axios from 'axios';

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
}

/**
 * Classe principal para requisições HTTP usando Axios
 */
class ApiClient {
  constructor(config = {}) {
    // Configuração base do Axios
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
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
      (error) => {
        if (error.response) {
          // Erro com resposta do servidor
          const apiError = new ApiError(
            error.response.data?.message || error.message || 'Erro na requisição',
            error.response.status,
            error.response.data
          );
          return Promise.reject(apiError);
        } else if (error.request) {
          // Erro de rede
          const apiError = new ApiError('Erro de conexão', 0, { originalError: error });
          return Promise.reject(apiError);
        } else {
          // Outro tipo de erro
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
      const response = await this.axiosInstance.post('/auth/token/refresh/', {
        refresh: refreshToken
      });
      
      TokenManager.setTokens(response.access, response.refresh);
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