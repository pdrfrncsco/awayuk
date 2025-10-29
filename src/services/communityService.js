import ApiClient from './api';

const BASE = '/accounts';

const communityService = {
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
};

export default communityService;