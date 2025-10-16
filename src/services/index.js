/**
 * Arquivo central de exportação dos serviços
 * Facilita a importação dos serviços em outros componentes
 */

// Importar e exportar o cliente base da API
export { ApiClient, TokenManager, ApiError } from './api.js';

// Importar serviços específicos
import authServiceInstance, { AuthService } from './authService.js';
import notificationServiceInstance, { NotificationService } from './notificationService.js';
import eventServiceInstance, { EventService } from './eventService.js';
import opportunityServiceInstance, { OpportunityService } from './opportunityService.js';
import profileServiceInstance, { ProfileService } from './profileService.js';
import dashboardServiceInstance from './dashboardService.js';
import membersServiceInstance from './membersService.js';
import eventsServiceInstance, { EventsService } from './eventsService.js';
import opportunitiesServiceInstance, { OpportunitiesService } from './opportunitiesService.js';
import analyticsServiceInstance, { AnalyticsService } from './analyticsService.js';
import contentServiceInstance, { ContentService } from './contentService.js';
import accountsServiceInstance, { AccountsService } from './accountsService.js';
import onboardingServiceInstance, { OnboardingService } from './onboardingService.js';

// Exportar serviços específicos
export { default as authService, AuthService } from './authService.js';
export { default as notificationService, NotificationService } from './notificationService.js';
export { default as eventService, EventService } from './eventService.js';
export { default as opportunityService, OpportunityService } from './opportunityService.js';
export { default as profileService, ProfileService } from './profileService.js';
export { default as dashboardService } from './dashboardService.js';
export { default as membersService } from './membersService.js';
export { default as eventsService, EventsService } from './eventsService.js';
export { default as opportunitiesService, OpportunitiesService } from './opportunitiesService.js';
export { default as analyticsService, AnalyticsService } from './analyticsService.js';
export { default as contentService, ContentService } from './contentService.js';
export { default as accountsService, AccountsService } from './accountsService.js';
export { default as onboardingService, OnboardingService } from './onboardingService.js';

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
  auth: authServiceInstance,
  notifications: notificationServiceInstance,
  events: eventServiceInstance,
  opportunities: opportunityServiceInstance,
  profile: profileServiceInstance,
  dashboard: dashboardServiceInstance,
  members: membersServiceInstance,
  eventsService: eventsServiceInstance,
  opportunitiesService: opportunitiesServiceInstance,
  analytics: analyticsServiceInstance,
  content: contentServiceInstance,
  accounts: accountsServiceInstance,
  onboarding: onboardingServiceInstance
};

/**
 * Configuração global dos serviços
 * Permite configurar todos os serviços de uma vez
 */
export const configureServices = (config) => {
  // Configurar URL base se fornecida
  if (config.baseURL) {
    // Atualizar a configuração base de todos os serviços
    authServiceInstance.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    notificationServiceInstance.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    eventServiceInstance.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    opportunityServiceInstance.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
    profileServiceInstance.apiClient.axiosInstance.defaults.baseURL = config.baseURL;
  }

  // Configurar timeout se fornecido
  if (config.timeout) {
    authServiceInstance.apiClient.axiosInstance.defaults.timeout = config.timeout;
    notificationServiceInstance.apiClient.axiosInstance.defaults.timeout = config.timeout;
    eventServiceInstance.apiClient.axiosInstance.defaults.timeout = config.timeout;
    opportunityServiceInstance.apiClient.axiosInstance.defaults.timeout = config.timeout;
    profileServiceInstance.apiClient.axiosInstance.defaults.timeout = config.timeout;
  }

  // Configurar headers globais se fornecidos
  if (config.headers) {
    Object.assign(authServiceInstance.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(notificationServiceInstance.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(eventServiceInstance.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(opportunityServiceInstance.apiClient.axiosInstance.defaults.headers, config.headers);
    Object.assign(profileServiceInstance.apiClient.axiosInstance.defaults.headers, config.headers);
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
      await authServiceInstance.apiClient.get('/health/');
      results.auth = true;
    } catch (error) {
      console.warn('Auth service health check failed:', error.message);
    }

    try {
      await notificationServiceInstance.apiClient.get('/health/');
      results.notifications = true;
    } catch (error) {
      console.warn('Notification service health check failed:', error.message);
    }

    try {
      await eventServiceInstance.apiClient.get('/health/');
      results.events = true;
    } catch (error) {
      console.warn('Event service health check failed:', error.message);
    }

    try {
      await opportunityServiceInstance.apiClient.get('/health/');
      results.opportunities = true;
    } catch (error) {
      console.warn('Opportunity service health check failed:', error.message);
    }

    try {
      await profileServiceInstance.apiClient.get('/health/');
      results.profile = true;
    } catch (error) {
      console.warn('Profile service health check failed:', error.message);
    }

  } catch (error) {
    console.error('Health check failed:', error);
  }

  return results;
};

// Exportação padrão com todos os serviços
export default services;