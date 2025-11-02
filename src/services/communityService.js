import ApiClient from './api';

const BASE = '/accounts';
const COMMUNITY_BASE = '/community';

const communityService = {
  // Conexões entre membros
  async listConnections() {
    return ApiClient.get(`${BASE}/connections/`);
  },

  async removeConnection(userId) {
    return ApiClient.delete(`${BASE}/connections/remove/${userId}/`);
  },

  async listConnectionRequests(type = 'incoming') {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return ApiClient.get(`${BASE}/connection-requests/${query}`);
  },

  async sendConnectionRequest(toUserId, message = '') {
    return ApiClient.post(`${BASE}/connection-requests/`, {
      to_user_id: toUserId,
      message,
    });
  },

  async acceptConnectionRequest(requestId) {
    return ApiClient.post(`${BASE}/connection-requests/${requestId}/accept/`);
  },

  async rejectConnectionRequest(requestId) {
    return ApiClient.post(`${BASE}/connection-requests/${requestId}/reject/`);
  },

  // Comunidades
  async getCommunities(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...params
      });
      
      return await ApiClient.get(`${COMMUNITY_BASE}/communities/?${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
      return { results: [], count: 0 };
    }
  },

  async getCommunity(communityId) {
    try {
      return await ApiClient.get(`${COMMUNITY_BASE}/communities/${communityId}/`);
    } catch (error) {
      console.error('Erro ao buscar comunidade:', error);
      throw error;
    }
  },

  async joinCommunity(communityId) {
    try {
      return await ApiClient.post(`${COMMUNITY_BASE}/communities/${communityId}/join/`);
    } catch (error) {
      console.error('Erro ao entrar na comunidade:', error);
      throw error;
    }
  },

  async leaveCommunity(communityId) {
    try {
      return await ApiClient.post(`${COMMUNITY_BASE}/communities/${communityId}/leave/`);
    } catch (error) {
      console.error('Erro ao sair da comunidade:', error);
      throw error;
    }
  }
};

export default communityService;