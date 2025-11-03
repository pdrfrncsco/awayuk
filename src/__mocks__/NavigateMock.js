// Mock para o hook useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Navigate: ({ to }) => {
    mockedNavigate(to);
    return null;
  }
}));

export { mockedNavigate };