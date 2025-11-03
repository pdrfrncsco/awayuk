import React from 'react';
import { MemoryRouter } from 'react-router-dom';

export const RouterMock = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);