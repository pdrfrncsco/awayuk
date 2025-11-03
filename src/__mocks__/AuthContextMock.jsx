import React from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const mockAuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
  refreshToken: jest.fn(),
  setUser: jest.fn()
};

export const mockAuthenticatedUser = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: 123,
    username: 'testuser',
    email: 'test@example.com',
    user_type: 'member',
    is_email_verified: true
  },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
  refreshToken: jest.fn(),
  setUser: jest.fn()
};

export const mockBusinessUser = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: 456,
    username: 'businessuser',
    email: 'business@example.com',
    user_type: 'business',
    is_email_verified: true
  },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
  refreshToken: jest.fn(),
  setUser: jest.fn()
};

export const mockAdminUser = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: 789,
    username: 'adminuser',
    email: 'admin@example.com',
    user_type: 'admin',
    is_email_verified: true
  },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
  refreshToken: jest.fn(),
  setUser: jest.fn()
};

export const AuthContextMock = ({ children, value = mockAuthContextValue }) => (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);