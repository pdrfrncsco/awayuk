import { ApiClient } from './api.js';

class OpportunitiesService {
  constructor() {
    this.apiClient = ApiClient;
  }

  // Buscar oportunidades com filtros e paginação
  async getOpportunities(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await this.apiClient.get(`/api/opportunities/?${params.toString()}`);
      
      // Transformar dados da API para o formato esperado pelo frontend
      return {
        results: response.data.results.map(item => this.transformOpportunityFromAPI(item)),
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      };
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      // Retornar dados mock em caso de erro
      return this.getMockOpportunities(filters);
    }
  }

  // Buscar oportunidade específica por ID
  async getOpportunity(opportunityId) {
    try {
      const response = await this.apiClient.get(`/opportunities/${opportunityId}/`);
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao buscar oportunidade:', error);
      throw error;
    }
  }

  // Criar nova oportunidade
  async createOpportunity(opportunityData) {
    try {
      const transformedData = this.transformOpportunityToAPI(opportunityData);
      const response = await this.apiClient.post('/opportunities/', transformedData);
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      throw error;
    }
  }

  // Atualizar oportunidade
  async updateOpportunity(opportunityId, opportunityData) {
    try {
      const transformedData = this.transformOpportunityToAPI(opportunityData);
      const response = await this.apiClient.put(`/api/opportunities/${opportunityId}/`, transformedData);
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      throw error;
    }
  }

  // Deletar oportunidade
  async deleteOpportunity(opportunityId) {
    try {
      await this.apiClient.delete(`/api/opportunities/${opportunityId}/`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar oportunidade:', error);
      throw error;
    }
  }

  // Buscar candidaturas de uma oportunidade
  async getApplications(opportunityId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);

      const response = await this.apiClient.get(`/api/opportunities/${opportunityId}/applications/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      throw error;
    }
  }

  // Buscar estatísticas de oportunidades
  async getOpportunityStats() {
    try {
      const response = await this.apiClient.get('/api/opportunities/stats/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total_opportunities: 0,
        active_opportunities: 0,
        paused_opportunities: 0,
        expired_opportunities: 0,
        total_applications: 0,
        featured_opportunities: 0,
        remote_opportunities: 0
      };
    }
  }

  // Alterar status da oportunidade
  async updateOpportunityStatus(opportunityId, status) {
    try {
      const response = await this.apiClient.patch(`/api/opportunities/${opportunityId}/`, { status });
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      throw error;
    }
  }

  // Marcar/desmarcar como destaque
  async toggleFeatured(opportunityId, featured) {
    try {
      const response = await this.apiClient.patch(`/api/opportunities/${opportunityId}/`, { featured });
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      throw error;
    }
  }

  // Duplicar oportunidade
  async duplicateOpportunity(opportunityId) {
    try {
      const response = await this.apiClient.post(`/api/opportunities/${opportunityId}/duplicate/`);
      return this.transformOpportunityFromAPI(response.data);
    } catch (error) {
      console.error('Erro ao duplicar oportunidade:', error);
      throw error;
    }
  }
  
  // Buscar tipos de trabalho
  async getJobTypes() {
    try {
      const response = await this.apiClient.get('/api/opportunities/job-types/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de trabalho:', error);
      return [
        { id: 'full-time', name: 'Tempo Integral' },
        { id: 'part-time', name: 'Meio Período' },
        { id: 'contract', name: 'Contrato' },
        { id: 'internship', name: 'Estágio' },
        { id: 'temporary', name: 'Temporário' }
      ];
    }
  }

  // Exportar oportunidades
  async exportOpportunities(filters = {}, format = 'csv') {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('job_type', filters.type);
      if (filters.location) params.append('location', filters.location);
      params.append('format', format);

      const response = await this.apiClient.get(`/api/opportunities/export/?${params.toString()}`, {
        responseType: 'blob'
      });

      // Criar download do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `oportunidades_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erro ao exportar oportunidades:', error);
      throw error;
    }
  }
  
  // Buscar localizações
  async getLocations() {
    try {
      const response = await this.apiClient.get('/api/opportunities/locations/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      // Retornar dados mock em caso de erro
      return [
        'Londres',
        'Manchester',
        'Birmingham',
        'Liverpool',
        'Glasgow',
        'Edimburgo',
        'Cardiff',
        'Belfast',
        'Bristol',
        'Newcastle'
      ];
    }
  }

  // Buscar tipos de trabalho disponíveis
  async getJobTypes() {
    try {
      const response = await this.apiClient.get('/api/opportunities/job-types/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de trabalho:', error);
      return this.getDefaultJobTypes();
    }
  }

  // Buscar localizações disponíveis
  async getLocations() {
    try {
      const response = await this.apiClient.get('/api/opportunities/locations/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      return this.getDefaultLocations();
    }
  }

  // Transformar dados da API para o formato do frontend
  transformOpportunityFromAPI(apiOpportunity) {
    return {
      id: apiOpportunity.id,
      title: apiOpportunity.title,
      company: apiOpportunity.company,
      location: apiOpportunity.location,
      type: apiOpportunity.job_type,
      salary: {
        min: parseFloat(apiOpportunity.salary_min || 0),
        max: parseFloat(apiOpportunity.salary_max || 0)
      },
      experience: apiOpportunity.experience_level,
      status: apiOpportunity.status,
      description: apiOpportunity.description,
      requirements: apiOpportunity.requirements || [],
      benefits: apiOpportunity.benefits || [],
      postedDate: apiOpportunity.created_at?.split('T')[0] || apiOpportunity.posted_date,
      expiryDate: apiOpportunity.expiry_date,
      applications: apiOpportunity.applications_count || 0,
      views: apiOpportunity.views_count || 0,
      featured: apiOpportunity.featured || false,
      remote: apiOpportunity.remote || false,
      created_at: apiOpportunity.created_at,
      updated_at: apiOpportunity.updated_at
    };
  }

  // Transformar dados do frontend para o formato da API
  transformOpportunityToAPI(frontendOpportunity) {
    return {
      title: frontendOpportunity.title,
      company: frontendOpportunity.company,
      location: frontendOpportunity.location,
      job_type: frontendOpportunity.type,
      salary_min: frontendOpportunity.salary?.min,
      salary_max: frontendOpportunity.salary?.max,
      experience_level: frontendOpportunity.experience,
      status: frontendOpportunity.status,
      description: frontendOpportunity.description,
      requirements: frontendOpportunity.requirements,
      benefits: frontendOpportunity.benefits,
      expiry_date: frontendOpportunity.expiryDate,
      featured: frontendOpportunity.featured,
      remote: frontendOpportunity.remote
    };
  }

  // Dados mock para fallback
  getMockOpportunities(filters = {}) {
    const mockOpportunities = [
      {
        id: 1,
        title: 'Desenvolvedor Frontend React',
        company: 'TechCorp Solutions',
        location: 'Londres',
        type: 'full-time',
        salary: { min: 45000, max: 65000 },
        experience: 'mid-level',
        status: 'active',
        description: 'Procuramos um desenvolvedor React experiente para se juntar à nossa equipa dinâmica.',
        requirements: ['React', 'TypeScript', 'Node.js', 'Git'],
        benefits: ['Seguro de saúde', 'Trabalho remoto', 'Formação contínua'],
        postedDate: '2024-12-10',
        expiryDate: '2025-01-10',
        applications: 23,
        views: 156,
        featured: true,
        remote: true
      },
      {
        id: 2,
        title: 'Gestor de Projetos',
        company: 'Business Dynamics Ltd',
        location: 'Manchester',
        type: 'full-time',
        salary: { min: 50000, max: 70000 },
        experience: 'senior',
        status: 'active',
        description: 'Oportunidade para liderar projetos estratégicos numa empresa em crescimento.',
        requirements: ['PMP', 'Agile', 'Scrum', 'Liderança'],
        benefits: ['Bónus anual', 'Carro da empresa', 'Plano de pensões'],
        postedDate: '2024-12-08',
        expiryDate: '2025-01-08',
        applications: 15,
        views: 89,
        featured: false,
        remote: false
      },
      {
        id: 3,
        title: 'Designer UX/UI',
        company: 'Creative Studio',
        location: 'Birmingham',
        type: 'contract',
        salary: { min: 300, max: 450 },
        experience: 'mid-level',
        status: 'paused',
        description: 'Contrato de 6 meses para redesign de plataforma digital.',
        requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        benefits: ['Horário flexível', 'Equipamento fornecido'],
        postedDate: '2024-12-05',
        expiryDate: '2024-12-25',
        applications: 8,
        views: 45,
        featured: false,
        remote: true
      }
    ];

    // Aplicar filtros aos dados mock
    let filtered = mockOpportunities;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm) ||
        opp.company.toLowerCase().includes(searchTerm) ||
        opp.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(opp => opp.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(opp => opp.type === filters.type);
    }

    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(opp => opp.location === filters.location);
    }

    return {
      results: filtered,
      count: filtered.length,
      next: null,
      previous: null
    };
  }

  // Tipos de trabalho padrão
  getDefaultJobTypes() {
    return [
      { value: 'full-time', label: 'Tempo Integral' },
      { value: 'part-time', label: 'Meio Período' },
      { value: 'contract', label: 'Contrato' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'internship', label: 'Estágio' }
    ];
  }

  // Localizações padrão
  getDefaultLocations() {
    return [
      'Londres',
      'Manchester',
      'Birmingham',
      'Edinburgh',
      'Liverpool',
      'Bristol',
      'Leeds',
      'Glasgow'
    ];
  }

  // Utilitário para formatar data
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Utilitário para formatar salário
  formatSalary(salary, type) {
    const isDaily = type === 'contract' || type === 'freelance';
    const currency = '£';
    const period = isDaily ? '/dia' : '/ano';
    
    if (salary.min === salary.max) {
      return `${currency}${salary.min.toLocaleString()}${period}`;
    }
    return `${currency}${salary.min.toLocaleString()} - ${currency}${salary.max.toLocaleString()}${period}`;
  }
}

// Criar instância do serviço
const opportunitiesServiceInstance = new OpportunitiesService();

export { opportunitiesServiceInstance, OpportunitiesService };
export default opportunitiesServiceInstance;