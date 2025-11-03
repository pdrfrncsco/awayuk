import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GuestRoute } from '../components/auth/ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';

// Mock do useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Navigate: ({ to }) => {
    mockedNavigate(to);
    return null;
  }
}));

describe('Testes de redirecionamento baseado em UserType', () => {
  // Limpar mocks entre testes
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test('Usuário do tipo member deve ser redirecionado para /perfil/id', () => {
    // Configurar mock do contexto de autenticação para um usuário do tipo member
    const authContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 123,
        user_type: 'member',
        username: 'testuser'
      }
    };

    // Renderizar o componente GuestRoute com o contexto mockado
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <GuestRoute>
            <div>Conteúdo protegido</div>
          </GuestRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Verificar se o redirecionamento foi feito para a página de perfil
    expect(mockedNavigate).toHaveBeenCalledWith('/perfil/123');
  });

  test('Usuário do tipo business deve ser redirecionado para o dashboard', () => {
    // Configurar mock do contexto de autenticação para um usuário do tipo business
    const authContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 456,
        user_type: 'business',
        username: 'businessuser'
      }
    };

    // Renderizar o componente GuestRoute com o contexto mockado
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <GuestRoute>
            <div>Conteúdo protegido</div>
          </GuestRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Verificar se o redirecionamento foi feito para o dashboard
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('Usuário não autenticado deve ver o conteúdo da rota', () => {
    // Configurar mock do contexto de autenticação para um usuário não autenticado
    const authContextValue = {
      isAuthenticated: false,
      isLoading: false,
      user: null
    };

    // Renderizar o componente GuestRoute com o contexto mockado
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <GuestRoute>
            <div>Conteúdo para visitantes</div>
          </GuestRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Verificar se o conteúdo é exibido (não houve redirecionamento)
    expect(screen.getByText('Conteúdo para visitantes')).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});