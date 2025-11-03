import React from 'react';
import { render, screen } from '@testing-library/react';

// Componente simples para testar
const SimpleComponent = () => {
  return <div>Teste simples funcionando!</div>;
};

describe('Teste simples de configuração', () => {
  test('Renderiza o componente corretamente', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Teste simples funcionando!')).toBeInTheDocument();
  });
});