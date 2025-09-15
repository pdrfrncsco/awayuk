/**
 * Arquivo central de exportação dos serviços
 * Facilita a importação dos serviços em outros componentes
 */

// Importar e exportar o cliente base da API
export { ApiClient, TokenManager, ApiError } from './api.js';

// Importar e exportar serviços específicos
export { default as authService, AuthService } from './authService.js';
export { default as notificationService, NotificationService } from './notificationService.js';
export { default as eventService, EventService } from './eventService.js';
export { default as opportunityService, OpportunityService } from './opportunityService.js';

/**
 * Objeto com todos os serviços para importação conveniente
 * 
 * Exemplo de uso:
 * import { services } from '@/services';
 * 
 * // Usar os serviços
 * const user = await services.auth.login(username, password);
 * const notifications = await services.notifications.getNotifications();
 * const events = await services.events.getEvents();
 * const opportunities = await services.opportunities.getOpportunities();
 */
export const services = {
  auth: authService,
  notifications: notificationService,
  events: eventService,
  opportunities: opportunityService
};

/**
 * Configuração global dos serviços
 * Permite configurar todos os serviços de uma vez
 */
export const configureServices = (config) => {
  // Configurar URL base se fornecida
  if (config.baseURL) {
    // Atualizar a configuração base de todos os serviços
    authService.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    notificationService.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    eventService.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    opportunityService.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
  }

  // Configurar timeout se fornecido
  if (config.timeout) {
    authService.apiClient.axiosInstance.defaults.timeout = config.timeout;
    notificationService.apiClient.axiosInstance.defaults.timeout = config.timeout;
    eventService.apiClient.axiosInstance.defaults.timeout = config.timeout;
    opportunityService.apiClient.axiosInstance.defaults.timeout = config.timeout;
  }

  // Configurar headers globais se fornecidos
  if (config.headers) {
    Object.assign(authService.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(notificationService.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(eventService.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(opportunityService.apiClient.axiosInstance.defaults.headers, config.headers);
  }
};

/**
 * Utilitário para verificar se todos os serviços estão funcionando
 * Útil para testes de conectividade
 */
export const healthCheck = async () => {
  const results = {
    auth: false,
    notifications: false,
    events: false,
    opportunities: false
  };

  try {
    // Tentar fazer uma requisição simples para cada serviço
    // Nota: Estes endpoints devem existir no backend para health check
    
    try {
      await authService.apiClient.get('/health/');
      results.auth = true;
    } catch (error) {
      console.warn('Auth service health check failed:', error.message);
    }

    try {
      await notificationService.apiClient.get('/health/');
      results.notifications = true;
    } catch (error) {
      console.warn('Notification service health check failed:', error.message);
    }

    try {
      await eventService.apiClient.get('/health/');
      results.events = true;
    } catch (error) {
      console.warn('Event service health check failed:', error.message);
    }

    try {
      await opportunityService.apiClient.get('/health/');
      results.opportunities = true;
    } catch (error) {
      console.warn('Opportunity service health check failed:', error.message);
    }

  } catch (error) {
    console.error('Health check failed:', error);
  }

  return results;
};

// Exportação padrão com todos os serviços
export default services;