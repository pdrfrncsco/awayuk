import React from 'react';

/**
 * Componente de spinner de carregamento
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.size - Tamanho do spinner ('sm', 'md', 'lg', 'xl')
 * @param {string} props.color - Cor do spinner
 * @param {string} props.message - Mensagem a exibir abaixo do spinner
 * @param {boolean} props.fullScreen - Se true, ocupa toda a tela
 * @param {string} props.className - Classes CSS adicionais
 * @returns {React.ReactElement} Componente de loading
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'yellow', 
  message = 'A carregar...', 
  fullScreen = false,
  className = ''
}) => {
  // Definir tamanhos do spinner
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Definir cores do spinner
  const colorClasses = {
    yellow: 'border-yellow-500',
    red: 'border-red-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]}`;

  // Container para tela cheia
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`animate-spin rounded-full border-4 border-t-transparent ${spinnerClass} mx-auto`}></div>
          {message && (
            <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Spinner normal
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-t-transparent ${spinnerClass}`}></div>
      {message && (
        <p className="mt-2 text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

/**
 * Componente de loading inline (para usar dentro de botões, etc.)
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.size - Tamanho do spinner
 * @param {string} props.color - Cor do spinner
 * @returns {React.ReactElement} Spinner inline
 */
export const InlineSpinner = ({ size = 'sm', color = 'white' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };

  const colorClasses = {
    yellow: 'border-yellow-500',
    red: 'border-red-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    ></div>
  );
};

/**
 * Componente de loading para páginas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da página
 * @param {string} props.message - Mensagem de carregamento
 * @returns {React.ReactElement} Loading de página
 */
export const PageLoader = ({ title = 'AWAYSUK', message = 'A carregar...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo ou ícone */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 mb-6">
          <span className="text-white font-bold text-xl">AW</span>
        </div>
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
        
        {/* Mensagem */}
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

/**
 * Componente de loading para cards/seções
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.lines - Número de linhas de skeleton
 * @param {boolean} props.avatar - Se deve mostrar avatar skeleton
 * @returns {React.ReactElement} Skeleton loader
 */
export const SkeletonLoader = ({ lines = 3, avatar = false }) => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        {avatar && (
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`h-3 bg-gray-300 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;