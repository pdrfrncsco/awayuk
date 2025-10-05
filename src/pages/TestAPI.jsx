import React, { useState } from 'react';
import { authService, profileService } from '../services';

// Mostrar a URL real da API lida do .env
const API_URL = (import.meta?.env?.VITE_API_URL) || 'http://127.0.0.1:8000/api';

const TestAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, testFunction) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: true, data: result } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Login Test',
      test: () => authService.login('testuser', 'testpass123')
    },
    {
      name: 'Profile Test',
      test: () => authService.getProfile()
    },
    {
      name: 'Token Check',
      test: () => {
        const token = authService.getAccessToken();
        return Promise.resolve({ 
          hasToken: !!token,
          isAuthenticated: authService.isAuthenticated()
        });
      }
    },
    {
      name: 'Profile Load Test (ID: 2)',
      test: () => profileService.getUserProfile(2)
    },
    {
      name: 'Profile Services Test (ID: 2)',
      test: () => profileService.getUserServices(2)
    },
    {
      name: 'Profile Portfolio Test (ID: 2)',
      test: () => profileService.getUserPortfolio(2)
    }
  ];

  // Adicionar teste para perfil do usuário autenticado
  tests.unshift({
    name: 'Authenticated Profile Test',
    test: () => profileService.getUserProfile()
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Teste de Integração API
          </h1>
          
          <div className="space-y-6">
            {tests.map((test) => (
              <div key={test.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {test.name}
                  </h2>
                  <button
                    onClick={() => testEndpoint(test.name, test.test)}
                    disabled={loading[test.name]}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {loading[test.name] ? 'Testando...' : 'Testar'}
                  </button>
                </div>
                
                {results[test.name] && (
                  <div className={`p-4 rounded-md ${
                    results[test.name].success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className={`font-medium ${
                      results[test.name].success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {results[test.name].success ? '✅ Sucesso' : '❌ Erro'}
                    </div>
                    <pre className={`mt-2 text-sm ${
                      results[test.name].success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {JSON.stringify(
                        results[test.name].success 
                          ? results[test.name].data 
                          : results[test.name].error, 
                        null, 
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Informações da API
            </h3>
            <div className="text-blue-700 space-y-1">
              <p><strong>Backend URL:</strong> {API_URL}</p>
              <p><strong>Frontend URL:</strong> http://localhost:5174</p>
              <p><strong>Status:</strong> Ambos os servidores estão rodando</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;