import apiClient from './api.js';

class ContentService {
  // Content CRUD operations
  async getContents(params = {}) {
    try {
      const response = await apiClient.get('/content', { params });
      return this.transformContentListResponse(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      return this.getDefaultContentList();
    }
  }

  async getContent(id) {
    try {
      const response = await apiClient.get(`/content/${id}`);
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      return this.getDefaultContent();
    }
  }

  async createContent(contentData) {
    try {
      const response = await apiClient.post('/content', this.transformContentRequest(contentData));
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async updateContent(id, contentData) {
    try {
      const response = await apiClient.put(`/content/${id}`, this.transformContentRequest(contentData));
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  async deleteContent(id) {
    try {
      await apiClient.delete(`/content/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  async duplicateContent(id) {
    try {
      const response = await apiClient.post(`/content/${id}/duplicate`);
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error duplicating content:', error);
      throw error;
    }
  }

  // Content status management
  async updateContentStatus(id, status) {
    try {
      const response = await apiClient.patch(`/content/${id}/status`, { status });
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error updating content status:', error);
      throw error;
    }
  }

  async toggleFeatured(id) {
    try {
      const response = await apiClient.patch(`/content/${id}/featured`);
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }

  async scheduleContent(id, publishDate) {
    try {
      const response = await apiClient.patch(`/content/${id}/schedule`, { publishDate });
      return this.transformContentResponse(response.data);
    } catch (error) {
      console.error('Error scheduling content:', error);
      throw error;
    }
  }

  // Categories management
  async getCategories() {
    try {
      const response = await apiClient.get('/content/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getDefaultCategories();
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await apiClient.post('/content/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const response = await apiClient.put(`/content/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await apiClient.delete(`/content/categories/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Content types management
  async getContentTypes() {
    try {
      const response = await apiClient.get('/content/types');
      return response.data;
    } catch (error) {
      console.error('Error fetching content types:', error);
      return this.getDefaultContentTypes();
    }
  }

  // Media management
  async uploadMedia(file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await apiClient.post('/content/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  async getMediaLibrary(params = {}) {
    try {
      const response = await apiClient.get('/content/media', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching media library:', error);
      return { items: [], total: 0 };
    }
  }

  async deleteMedia(id) {
    try {
      await apiClient.delete(`/content/media/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  // Content statistics
  async getContentStats(period = '30d') {
    try {
      const response = await apiClient.get('/content/stats', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      return this.getDefaultContentStats();
    }
  }

  async getContentEngagement(id) {
    try {
      const response = await apiClient.get(`/content/${id}/engagement`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content engagement:', error);
      return { views: 0, likes: 0, comments: 0, shares: 0 };
    }
  }

  // Comments management
  async getContentComments(contentId, params = {}) {
    try {
      const response = await apiClient.get(`/content/${contentId}/comments`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching content comments:', error);
      return { items: [], total: 0 };
    }
  }

  async moderateComment(commentId, action) {
    try {
      const response = await apiClient.patch(`/content/comments/${commentId}/moderate`, { action });
      return response.data;
    } catch (error) {
      console.error('Error moderating comment:', error);
      throw error;
    }
  }

  // Search and filtering
  async searchContent(query, filters = {}) {
    try {
      const params = { query, ...filters };
      const response = await apiClient.get('/content/search', { params });
      return this.transformContentListResponse(response.data);
    } catch (error) {
      console.error('Error searching content:', error);
      return this.getDefaultContentList();
    }
  }

  // Export functionality
  async exportContent(format = 'csv', filters = {}) {
    try {
      const params = { format, ...filters };
      const response = await apiClient.get('/content/export', { 
        params,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `content_export_${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting content:', error);
      throw error;
    }
  }

  // Data transformation methods
  transformContentResponse(data) {
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      category: data.category,
      status: data.status,
      author: data.author?.name || data.author,
      authorAvatar: data.author?.avatar || '/api/placeholder/32/32',
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featured_image || data.featuredImage,
      publishedDate: data.published_date || data.publishedDate,
      lastModified: data.last_modified || data.lastModified,
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      tags: data.tags || [],
      featured: data.featured || false,
      readTime: data.read_time || data.readTime,
      duration: data.duration,
      eventDate: data.event_date || data.eventDate,
      photoCount: data.photo_count || data.photoCount,
      seoTitle: data.seo_title || data.seoTitle,
      seoDescription: data.seo_description || data.seoDescription,
      slug: data.slug
    };
  }

  transformContentRequest(data) {
    return {
      title: data.title,
      type: data.type,
      category: data.category,
      status: data.status,
      excerpt: data.excerpt,
      content: data.content,
      featured_image: data.featuredImage,
      published_date: data.publishedDate,
      tags: data.tags,
      featured: data.featured,
      read_time: data.readTime,
      duration: data.duration,
      event_date: data.eventDate,
      photo_count: data.photoCount,
      seo_title: data.seoTitle,
      seo_description: data.seoDescription,
      slug: data.slug
    };
  }

  transformContentListResponse(data) {
    return {
      items: data.items?.map(item => this.transformContentResponse(item)) || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.total_pages || data.totalPages || 1
    };
  }

  // Default/fallback data
  getDefaultContentList() {
    return {
      items: [
        {
          id: 1,
          title: 'Guia Completo: Como Encontrar Emprego no Reino Unido',
          type: 'article',
          category: 'emprego',
          status: 'published',
          author: 'Maria Silva',
          authorAvatar: '/api/placeholder/32/32',
          excerpt: 'Um guia abrangente com dicas práticas para angolanos que procuram oportunidades de trabalho no Reino Unido.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          featuredImage: '/api/placeholder/400/200',
          publishedDate: '2024-12-10',
          lastModified: '2024-12-12',
          views: 1250,
          likes: 89,
          comments: 23,
          shares: 15,
          tags: ['emprego', 'cv', 'entrevista', 'networking'],
          featured: true,
          readTime: 8
        },
        {
          id: 2,
          title: 'Evento Cultural: Noite Angolana em Londres',
          type: 'event',
          category: 'cultura',
          status: 'published',
          author: 'João Santos',
          authorAvatar: '/api/placeholder/32/32',
          excerpt: 'Junte-se a nós para uma noite especial celebrando a cultura angolana no coração de Londres.',
          content: 'Evento especial com música, dança e gastronomia angolana...',
          featuredImage: '/api/placeholder/400/200',
          publishedDate: '2024-12-08',
          lastModified: '2024-12-08',
          views: 890,
          likes: 156,
          comments: 45,
          shares: 32,
          tags: ['cultura', 'música', 'dança', 'gastronomia'],
          featured: false,
          eventDate: '2024-12-20'
        }
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1
    };
  }

  getDefaultContent() {
    return {
      id: 1,
      title: 'Conteúdo de Exemplo',
      type: 'article',
      category: 'geral',
      status: 'draft',
      author: 'Utilizador',
      authorAvatar: '/api/placeholder/32/32',
      excerpt: 'Este é um conteúdo de exemplo.',
      content: 'Conteúdo completo aqui...',
      featuredImage: '/api/placeholder/400/200',
      publishedDate: null,
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      featured: false,
      readTime: 5
    };
  }

  getDefaultCategories() {
    return [
      { value: 'emprego', label: 'Emprego', count: 15 },
      { value: 'cultura', label: 'Cultura', count: 8 },
      { value: 'integracao', label: 'Integração', count: 12 },
      { value: 'educacao', label: 'Educação', count: 6 },
      { value: 'testemunhos', label: 'Testemunhos', count: 4 },
      { value: 'eventos', label: 'Eventos', count: 10 },
      { value: 'noticias', label: 'Notícias', count: 7 }
    ];
  }

  getDefaultContentTypes() {
    return [
      { value: 'article', label: 'Artigo', icon: 'DocumentTextIcon' },
      { value: 'video', label: 'Vídeo', icon: 'VideoCameraIcon' },
      { value: 'gallery', label: 'Galeria', icon: 'PhotoIcon' },
      { value: 'guide', label: 'Guia', icon: 'DocumentTextIcon' },
      { value: 'news', label: 'Notícia', icon: 'DocumentTextIcon' },
      { value: 'event', label: 'Evento', icon: 'CalendarIcon' }
    ];
  }

  getDefaultContentStats() {
    return {
      totalContents: 45,
      publishedContents: 38,
      draftContents: 5,
      scheduledContents: 2,
      totalViews: 15420,
      totalLikes: 1250,
      totalComments: 340,
      totalShares: 890,
      topCategories: [
        { category: 'emprego', count: 15, percentage: 33.3 },
        { category: 'integracao', count: 12, percentage: 26.7 },
        { category: 'eventos', count: 10, percentage: 22.2 },
        { category: 'cultura', count: 8, percentage: 17.8 }
      ],
      engagementTrends: [
        { date: '2024-12-01', views: 450, likes: 35, comments: 12 },
        { date: '2024-12-02', views: 520, likes: 42, comments: 18 },
        { date: '2024-12-03', views: 380, likes: 28, comments: 9 },
        { date: '2024-12-04', views: 610, likes: 55, comments: 24 },
        { date: '2024-12-05', views: 720, likes: 68, comments: 31 }
      ]
    };
  }
}

// Create and export service instance
const contentService = new ContentService();
export { ContentService, contentService };
export default contentService;