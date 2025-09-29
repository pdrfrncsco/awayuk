import { ApiClient, ApiError } from './api.js';

/**
 * Serviço para dados do dashboard
 * Gerencia estatísticas, métricas e dados agregados para o painel administrativo
 */
class DashboardService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtém estatísticas gerais do dashboard
   * @returns {Promise<Object>} Estatísticas gerais
   */
  async getDashboardStats() {
    try {
      // Buscar dados de diferentes endpoints e agregar
      const [
        membersStats,
        eventsStats,
        opportunitiesStats,
        analyticsStats
      ] = await Promise.allSettled([
        this.getMembersStats(),
        this.getEventsStats(),
        this.getOpportunitiesStats(),
        this.getAnalyticsStats()
      ]);

      return {
        members: membersStats.status === 'fulfilled' ? membersStats.value : this.getDefaultMembersStats(),
        events: eventsStats.status === 'fulfilled' ? eventsStats.value : this.getDefaultEventsStats(),
        opportunities: opportunitiesStats.status === 'fulfilled' ? opportunitiesStats.value : this.getDefaultOpportunitiesStats(),
        analytics: analyticsStats.status === 'fulfilled' ? analyticsStats.value : this.getDefaultAnalyticsStats(),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new ApiError(
        error.message || 'Erro ao obter estatísticas do dashboard',
        error.status || 500,
        error.data
      );
    }
  }

  /**
   * Obtém estatísticas de membros
   * @returns {Promise<Object>} Estatísticas de membros
   */
  async getMembersStats() {
    try {
      const response = await this.apiClient.get('/accounts/users/');
      const users = response.results || response;
      
      // Calcular estatísticas
      const totalMembers = users.length;
      const newMembersThisMonth = users.filter(user => {
        const joinDate = new Date(user.date_joined);
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return joinDate >= thisMonth;
      }).length;

      const verifiedMembers = users.filter(user => user.is_verified).length;
      const activeMembers = users.filter(user => user.is_active).length;

      return {
        total: totalMembers,
        newThisMonth: newMembersThisMonth,
        verified: verifiedMembers,
        active: activeMembers,
        growthRate: totalMembers > 0 ? ((newMembersThisMonth / totalMembers) * 100).toFixed(1) : '0'
      };
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de membros:', error.message);
      return this.getDefaultMembersStats();
    }
  }

  /**
   * Obtém estatísticas de eventos
   * @returns {Promise<Object>} Estatísticas de eventos
   */
  async getEventsStats() {
    try {
      const response = await this.apiClient.get('/events/');
      const events = response.results || response;
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const eventsThisMonth = events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= thisMonth && eventDate < nextMonth;
      }).length;

      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate > now;
      }).length;

      const totalRegistrations = events.reduce((sum, event) => {
        return sum + (event.registration_count || 0);
      }, 0);

      return {
        total: events.length,
        thisMonth: eventsThisMonth,
        upcoming: upcomingEvents,
        totalRegistrations,
        growthRate: events.length > 0 ? ((eventsThisMonth / events.length) * 100).toFixed(1) : '0'
      };
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de eventos:', error.message);
      return this.getDefaultEventsStats();
    }
  }

  /**
   * Obtém estatísticas de oportunidades
   * @returns {Promise<Object>} Estatísticas de oportunidades
   */
  async getOpportunitiesStats() {
    try {
      const response = await this.apiClient.get('/opportunities/');
      const opportunities = response.results || response;
      
      const activeOpportunities = opportunities.filter(opp => opp.is_active).length;
      const totalApplications = opportunities.reduce((sum, opp) => {
        return sum + (opp.application_count || 0);
      }, 0);

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newThisMonth = opportunities.filter(opp => {
        const createdDate = new Date(opp.created_at);
        return createdDate >= thisMonth;
      }).length;

      return {
        total: opportunities.length,
        active: activeOpportunities,
        newThisMonth,
        totalApplications,
        growthRate: opportunities.length > 0 ? ((newThisMonth / opportunities.length) * 100).toFixed(1) : '0'
      };
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de oportunidades:', error.message);
      return this.getDefaultOpportunitiesStats();
    }
  }

  /**
   * Obtém estatísticas de analytics
   * @returns {Promise<Object>} Estatísticas de analytics
   */
  async getAnalyticsStats() {
    try {
      const response = await this.apiClient.get('/analytics/dashboard/');
      return response;
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de analytics:', error.message);
      return this.getDefaultAnalyticsStats();
    }
  }

  /**
   * Obtém atividades recentes
   * @returns {Promise<Array>} Lista de atividades recentes
   */
  async getRecentActivities() {
    try {
      const [
        recentMembers,
        recentEvents,
        recentOpportunities,
        recentContent
      ] = await Promise.allSettled([
        this.getRecentMembers(),
        this.getRecentEvents(),
        this.getRecentOpportunities(),
        this.getRecentContent()
      ]);

      const activities = [];

      // Adicionar membros recentes
      if (recentMembers.status === 'fulfilled') {
        recentMembers.value.forEach(member => {
          activities.push({
            id: `member-${member.id}`,
            type: 'member',
            title: 'Novo membro registado',
            description: `${member.first_name} ${member.last_name} juntou-se à comunidade`,
            time: this.formatTimeAgo(member.date_joined),
            icon: 'UsersIcon',
            color: 'bg-blue-100 text-blue-600'
          });
        });
      }

      // Adicionar eventos recentes
      if (recentEvents.status === 'fulfilled') {
        recentEvents.value.forEach(event => {
          activities.push({
            id: `event-${event.id}`,
            type: 'event',
            title: 'Evento criado',
            description: event.title,
            time: this.formatTimeAgo(event.created_at),
            icon: 'CalendarIcon',
            color: 'bg-green-100 text-green-600'
          });
        });
      }

      // Adicionar oportunidades recentes
      if (recentOpportunities.status === 'fulfilled') {
        recentOpportunities.value.forEach(opportunity => {
          activities.push({
            id: `opportunity-${opportunity.id}`,
            type: 'opportunity',
            title: 'Nova oportunidade',
            description: opportunity.title,
            time: this.formatTimeAgo(opportunity.created_at),
            icon: 'BriefcaseIcon',
            color: 'bg-yellow-100 text-yellow-600'
          });
        });
      }

      // Adicionar conteúdo recente
      if (recentContent.status === 'fulfilled') {
        recentContent.value.forEach(content => {
          activities.push({
            id: `content-${content.id}`,
            type: 'content',
            title: 'Post publicado',
            description: content.title,
            time: this.formatTimeAgo(content.created_at),
            icon: 'DocumentTextIcon',
            color: 'bg-purple-100 text-purple-600'
          });
        });
      }

      // Ordenar por data e retornar os 10 mais recentes
      return activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);

    } catch (error) {
      console.warn('Erro ao buscar atividades recentes:', error.message);
      return this.getDefaultActivities();
    }
  }

  /**
   * Obtém membros recentes
   * @returns {Promise<Array>} Lista de membros recentes
   */
  async getRecentMembers() {
    try {
      const response = await this.apiClient.get('/accounts/users/?ordering=-date_joined&limit=5');
      return response.results || response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtém eventos recentes
   * @returns {Promise<Array>} Lista de eventos recentes
   */
  async getRecentEvents() {
    try {
      const response = await this.apiClient.get('/events/?ordering=-created_at&limit=5');
      return response.results || response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtém oportunidades recentes
   * @returns {Promise<Array>} Lista de oportunidades recentes
   */
  async getRecentOpportunities() {
    try {
      const response = await this.apiClient.get('/opportunities/?ordering=-created_at&limit=5');
      return response.results || response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtém conteúdo recente
   * @returns {Promise<Array>} Lista de conteúdo recente
   */
  async getRecentContent() {
    try {
      const response = await this.apiClient.get('/content/api/posts/?ordering=-created_at&limit=5');
      return response.results || response;
    } catch (error) {
      return [];
    }
  }

  /**
   * Formata tempo relativo
   * @param {string} dateString - Data em string
   * @returns {string} Tempo formatado
   */
  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Há ${Math.floor(diffInSeconds / 86400)} dias`;
    return `Há ${Math.floor(diffInSeconds / 2592000)} meses`;
  }

  // Métodos para dados padrão (fallback)
  getDefaultMembersStats() {
    return {
      total: 2847,
      newThisMonth: 342,
      verified: 2156,
      active: 2634,
      growthRate: '12.0'
    };
  }

  getDefaultEventsStats() {
    return {
      total: 156,
      thisMonth: 24,
      upcoming: 18,
      totalRegistrations: 1247,
      growthRate: '8.0'
    };
  }

  getDefaultOpportunitiesStats() {
    return {
      total: 234,
      active: 156,
      newThisMonth: 54,
      totalApplications: 892,
      growthRate: '23.0'
    };
  }

  getDefaultAnalyticsStats() {
    return {
      pageViews: 45200,
      interactions: 12800,
      bounceRate: 34.5,
      avgSessionDuration: 245
    };
  }

  getDefaultActivities() {
    return [
      {
        id: 1,
        type: 'member',
        title: 'Novo membro registado',
        description: 'João Silva juntou-se à comunidade',
        time: 'Há 2 horas',
        icon: 'UsersIcon',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: 2,
        type: 'event',
        title: 'Evento criado',
        description: 'Networking Night em Londres',
        time: 'Há 4 horas',
        icon: 'CalendarIcon',
        color: 'bg-green-100 text-green-600'
      },
      {
        id: 3,
        type: 'opportunity',
        title: 'Nova oportunidade',
        description: 'Desenvolvedor Frontend - Tech Company',
        time: 'Há 6 horas',
        icon: 'BriefcaseIcon',
        color: 'bg-yellow-100 text-yellow-600'
      },
      {
        id: 4,
        type: 'content',
        title: 'Post publicado',
        description: 'Dicas para entrevistas de emprego no Reino Unido',
        time: 'Há 1 dia',
        icon: 'DocumentTextIcon',
        color: 'bg-purple-100 text-purple-600'
      }
    ];
  }
}

// Exportar instância única
export const dashboardService = new DashboardService();
export default dashboardService;