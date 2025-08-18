import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-red-800">
            <span className="text-red-600">AWAY</span>UK
          </div>
          <div className="hidden md:flex space-x-1">
            <span className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full live-badge">
              ANGOLA
            </span>
          </div>
        </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/comunidade" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/comunidade' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Comunidade
            </Link>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Eventos
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Negócios
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Sobre
            </a>
          </div>
          <div className="flex items-center">
            <a href="#" className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition duration-300">
              Registar
            </a>
            <button 
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/comunidade" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/comunidade' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comunidade
              </Link>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md">
                Eventos
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md">
                Negócios
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md">
                Sobre
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button className="w-full text-left bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  Registar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;