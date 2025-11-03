import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContextMock, mockAuthenticatedUser } from '../__mocks__/AuthContextMock';
import { RouterMock } from '../__mocks__/RouterMock';

// Componente simples para testar
const TestComponent = () => {
  return <div>Teste de configuração funcionando!</div>;
};

describe('Teste de configuração do ambiente', () => {
  test('Renderiza o componente de teste corretamente', () => {
    render(<TestComponent />);
    expect(screen.getByText('Teste de configuração funcionando!')).toBeInTheDocument();
  });

  test('Funciona com o mock do AuthContext', () => {
    render(
      <AuthContextMock value={mockAuthenticatedUser}>
        <TestComponent />
      </AuthContextMock>
    );
    expect(screen.getByText('Teste de configuração funcionando!')).toBeInTheDocument();
  });

  test('Funciona com o mock do Router', () => {
    render(
      <RouterMock>
        <TestComponent />
      </RouterMock>
    );
    expect(screen.getByText('Teste de configuração funcionando!')).toBeInTheDocument();
  });
});