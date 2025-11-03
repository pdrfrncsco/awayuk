// Mock para o módulo de API
export const ApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn()
};

export const TokenManager = {
  getToken: jest.fn(),
  setToken: jest.fn(),
  clearToken: jest.fn(),
  refreshToken: jest.fn()
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}