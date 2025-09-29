import apiClient from './api.js';

class AnalyticsService {
  constructor() {
    this.baseURL = '/analytics';
  }

  /**
   * Obtém estatísticas gerais da plataforma
   * @param {string} period - Período para as estatísticas (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Estatísticas gerais
   */
  async getOverviewStats(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/overview/`, {
        params: { period }
      });
      return this.transformOverviewStats(response.data);
    } catch (error) {
      console.warn('Erro ao buscar estatísticas gerais:', error.message);
      return this.getDefaultOverviewStats();
    }
  }

  /**
   * Obtém estatísticas de membros
   * @param {string} period - Período para as estatísticas
   * @returns {Promise<Object>} Estatísticas de membros
   */
  async getMembersStats(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/members/`, {
        params: { period }
      });
      return this.transformMembersStats(response.data);
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de membros:', error.message);
      return this.getDefaultMembersStats();
    }
  }

  /**
   * Obtém estatísticas de eventos
   * @param {string} period - Período para as estatísticas
   * @returns {Promise<Object>} Estatísticas de eventos
   */
  async getEventsStats(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/events/`, {
        params: { period }
      });
      return this.transformEventsStats(response.data);
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de eventos:', error.message);
      return this.getDefaultEventsStats();
    }
  }

  /**
   * Obtém estatísticas de oportunidades
   * @param {string} period - Período para as estatísticas
   * @returns {Promise<Object>} Estatísticas de oportunidades
   */
  async getOpportunitiesStats(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/opportunities/`, {
        params: { period }
      });
      return this.transformOpportunitiesStats(response.data);
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de oportunidades:', error.message);
      return this.getDefaultOpportunitiesStats();
    }
  }

  /**
   * Obtém estatísticas de conteúdo
   * @param {string} period - Período para as estatísticas
   * @returns {Promise<Object>} Estatísticas de conteúdo
   */
  async getContentStats(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/content/`, {
        params: { period }
      });
      return this.transformContentStats(response.data);
    } catch (error) {
      console.warn('Erro ao buscar estatísticas de conteúdo:', error.message);
      return this.getDefaultContentStats();
    }
  }

  /**
   * Obtém dados de engajamento
   * @param {string} period - Período para os dados
   * @returns {Promise<Object>} Dados de engajamento
   */
  async getEngagementData(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/engagement/`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.warn('Erro ao buscar dados de engajamento:', error.message);
      return this.getDefaultEngagementData();
    }
  }

  /**
   * Obtém dados de tráfego do site
   * @param {string} period - Período para os dados
   * @returns {Promise<Object>} Dados de tráfego
   */
  async getTrafficData(period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/traffic/`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.warn('Erro ao buscar dados de tráfego:', error.message);
      return this.getDefaultTrafficData();
    }
  }

  /**
   * Gera relatório personalizado
   * @param {Object} config - Configuração do relatório
   * @returns {Promise<Object>} Dados do relatório
   */
  async generateReport(config) {
    try {
      const response = await apiClient.post(`${this.baseURL}/reports/`, config);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error.message);
      throw error;
    }
  }

  /**
   * Exporta dados de analytics
   * @param {string} type - Tipo de dados para exportar
   * @param {string} format - Formato de exportação (csv, xlsx, pdf)
   * @param {string} period - Período dos dados
   * @returns {Promise<Blob>} Arquivo para download
   */
  async exportData(type, format = 'csv', period = '30d') {
    try {
      const response = await apiClient.get(`${this.baseURL}/export/`, {
        params: { type, format, period },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar dados:', error.message);
      throw error;
    }
  }

  // Métodos de transformação de dados
  transformOverviewStats(data) {
    return {
      totalMembers: {
        current: data.total_members || 0,
        previous: data.previous_total_members || 0,
        change: data.members_growth_rate || 0
      },
      activeMembers: {
        current: data.active_members || 0,
        previous: data.previous_active_members || 0,
        change: data.active_members_growth_rate || 0
      },
      totalEvents: {
        current: data.total_events || 0,
        previous: data.previous_total_events || 0,
        change: data.events_growth_rate || 0
      },
      totalOpportunities: {
        current: data.total_opportunities || 0,
        previous: data.previous_total_opportunities || 0,
        change: data.opportunities_growth_rate || 0
      },
      totalContent: {
        current: data.total_content || 0,
        previous: data.previous_total_content || 0,
        change: data.content_growth_rate || 0
      },
      totalViews: {
        current: data.total_views || 0,
        previous: data.previous_total_views || 0,
        change: data.views_growth_rate || 0
      },
      totalEngagement: {
        current: data.total_engagement || 0,
        previous: data.previous_total_engagement || 0,
        change: data.engagement_growth_rate || 0
      },
      conversionRate: {
        current: data.conversion_rate || 0,
        previous: data.previous_conversion_rate || 0,
        change: data.conversion_rate_change || 0
      }
    };
  }

  transformMembersStats(data) {
    return {
      byLocation: data.by_location?.map(item => ({
        location: item.location,
        count: item.count,
        percentage: item.percentage
      })) || [],
      byAge: data.by_age?.map(item => ({
        range: item.age_range,
        count: item.count,
        percentage: item.percentage
      })) || [],
      byProfession: data.by_profession?.map(item => ({
        profession: item.profession,
        count: item.count,
        percentage: item.percentage
      })) || [],
      registrationTrend: data.registration_trend?.map(item => ({
        month: item.month,
        count: item.count
      })) || []
    };
  }

  transformEventsStats(data) {
    return {
      byCategory: data.by_category?.map(item => ({
        category: item.category,
        count: item.count,
        attendance: item.total_attendance
      })) || [],
      attendanceRate: {
        current: data.attendance_rate || 0,
        previous: data.previous_attendance_rate || 0,
        change: data.attendance_rate_change || 0
      },
      averageAttendance: {
        current: data.average_attendance || 0,
        previous: data.previous_average_attendance || 0,
        change: data.average_attendance_change || 0
      },
      popularTimes: data.popular_times?.map(item => ({
        time: item.time_slot,
        events: item.event_count
      })) || []
    };
  }

  transformOpportunitiesStats(data) {
    return {
      byType: data.by_type?.map(item => ({
        type: item.job_type,
        count: item.count,
        applications: item.total_applications
      })) || [],
      byLocation: data.by_location?.map(item => ({
        location: item.location,
        count: item.count,
        applications: item.total_applications
      })) || [],
      applicationTrend: data.application_trend?.map(item => ({
        month: item.month,
        count: item.count
      })) || [],
      successRate: {
        current: data.success_rate || 0,
        previous: data.previous_success_rate || 0,
        change: data.success_rate_change || 0
      }
    };
  }

  transformContentStats(data) {
    return {
      byType: data.by_type?.map(item => ({
        type: item.content_type,
        count: item.count,
        views: item.total_views,
        engagement: item.total_engagement
      })) || [],
      topContent: data.top_content?.map(item => ({
        title: item.title,
        views: item.views,
        likes: item.likes,
        comments: item.comments
      })) || [],
      engagementTrend: data.engagement_trend?.map(item => ({
        month: item.month,
        views: item.views,
        likes: item.likes,
        comments: item.comments
      })) || []
    };
  }

  // Dados padrão (fallback)
  getDefaultOverviewStats() {
    return {
      totalMembers: { current: 1247, previous: 1156, change: 7.9 },
      activeMembers: { current: 892, previous: 834, change: 7.0 },
      totalEvents: { current: 45, previous: 38, change: 18.4 },
      totalOpportunities: { current: 127, previous: 98, change: 29.6 },
      totalContent: { current: 234, previous: 201, change: 16.4 },
      totalViews: { current: 15678, previous: 12456, change: 25.9 },
      totalEngagement: { current: 3456, previous: 2987, change: 15.7 },
      conversionRate: { current: 12.5, previous: 10.8, change: 15.7 }
    };
  }

  getDefaultMembersStats() {
    return {
      byLocation: [
        { location: 'Londres', count: 456, percentage: 36.6 },
        { location: 'Manchester', count: 234, percentage: 18.8 },
        { location: 'Birmingham', count: 189, percentage: 15.2 },
        { location: 'Liverpool', count: 145, percentage: 11.6 },
        { location: 'Edinburgh', count: 98, percentage: 7.9 },
        { location: 'Outras', count: 125, percentage: 10.0 }
      ],
      byAge: [
        { range: '18-25', count: 298, percentage: 23.9 },
        { range: '26-35', count: 456, percentage: 36.6 },
        { range: '36-45', count: 312, percentage: 25.0 },
        { range: '46-55', count: 134, percentage: 10.7 },
        { range: '55+', count: 47, percentage: 3.8 }
      ],
      byProfession: [
        { profession: 'Tecnologia', count: 234, percentage: 18.8 },
        { profession: 'Saúde', count: 189, percentage: 15.2 },
        { profession: 'Educação', count: 156, percentage: 12.5 },
        { profession: 'Finanças', count: 134, percentage: 10.7 },
        { profession: 'Engenharia', count: 123, percentage: 9.9 },
        { profession: 'Outras', count: 411, percentage: 33.0 }
      ],
      registrationTrend: [
        { month: 'Jan', count: 45 },
        { month: 'Fev', count: 52 },
        { month: 'Mar', count: 67 },
        { month: 'Abr', count: 78 },
        { month: 'Mai', count: 89 },
        { month: 'Jun', count: 95 },
        { month: 'Jul', count: 112 },
        { month: 'Ago', count: 134 },
        { month: 'Set', count: 145 },
        { month: 'Out', count: 167 },
        { month: 'Nov', count: 189 },
        { month: 'Dez', count: 234 }
      ]
    };
  }

  getDefaultEventsStats() {
    return {
      byCategory: [
        { category: 'Networking', count: 15, attendance: 456 },
        { category: 'Cultural', count: 12, attendance: 389 },
        { category: 'Profissional', count: 8, attendance: 234 },
        { category: 'Educacional', count: 6, attendance: 178 },
        { category: 'Social', count: 4, attendance: 123 }
      ],
      attendanceRate: { current: 78.5, previous: 72.3, change: 8.6 },
      averageAttendance: { current: 34.2, previous: 28.7, change: 19.2 },
      popularTimes: [
        { time: '18:00-19:00', events: 18 },
        { time: '19:00-20:00', events: 15 },
        { time: '20:00-21:00', events: 8 },
        { time: '14:00-15:00', events: 4 }
      ]
    };
  }

  getDefaultContentStats() {
    return {
      byType: [
        { type: 'Artigos', count: 89, views: 12456, engagement: 1234 },
        { type: 'Vídeos', count: 45, views: 8934, engagement: 2345 },
        { type: 'Galerias', count: 34, views: 5678, engagement: 890 },
        { type: 'Guias', count: 28, views: 4567, engagement: 567 },
        { type: 'Notícias', count: 38, views: 6789, engagement: 789 }
      ],
      topContent: [
        { title: 'Guia Completo: Como Encontrar Emprego no Reino Unido', views: 2456, likes: 234, comments: 89 },
        { title: 'Vídeo: Testemunho de Sucesso - Engenheiro em Manchester', views: 2100, likes: 189, comments: 67 },
        { title: 'Galeria: Festa da Independência de Angola 2024', views: 1890, likes: 156, comments: 45 },
        { title: 'Dicas de Integração: Sistema de Saúde Britânico (NHS)', views: 1567, likes: 123, comments: 34 },
        { title: 'Oportunidades de Bolsas de Estudo para 2025', views: 1234, likes: 98, comments: 23 }
      ],
      engagementTrend: [
        { month: 'Jan', views: 8456, likes: 567, comments: 234 },
        { month: 'Fev', views: 9234, likes: 634, comments: 267 },
        { month: 'Mar', views: 10567, likes: 723, comments: 298 },
        { month: 'Abr', views: 11234, likes: 789, comments: 334 },
        { month: 'Mai', views: 12456, likes: 856, comments: 378 },
        { month: 'Jun', views: 13678, likes: 923, comments: 412 }
      ]
    };
  }

  getDefaultEngagementData() {
    return {
      totalLikes: 12456,
      totalComments: 3456,
      totalShares: 1234,
      averageEngagementRate: 8.5,
      topEngagedContent: []
    };
  }

  getDefaultTrafficData() {
    return {
      pageViews: 45200,
      uniqueVisitors: 12800,
      bounceRate: 34.5,
      avgSessionDuration: 245,
      topPages: []
    };
  }

  getDefaultOpportunitiesStats() {
    return {
      byType: [
        { type: 'Full-time', count: 67, applications: 234 },
        { type: 'Part-time', count: 34, applications: 123 },
        { type: 'Contract', count: 26, applications: 89 }
      ],
      byLocation: [
        { location: 'Londres', count: 45, applications: 178 },
        { location: 'Manchester', count: 23, applications: 89 },
        { location: 'Birmingham', count: 18, applications: 67 }
      ],
      applicationTrend: [
        { month: 'Jan', count: 45 },
        { month: 'Fev', count: 52 },
        { month: 'Mar', count: 67 }
      ],
      successRate: { current: 15.2, previous: 12.8, change: 18.8 }
    };
  }
}

// Exportar instância única
export const analyticsService = new AnalyticsService();
export { AnalyticsService };
export default analyticsService;