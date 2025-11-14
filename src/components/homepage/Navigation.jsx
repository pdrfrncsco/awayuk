import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../LanguageSelector';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    const result = logout();
    if (result.success) {
      setShowUserMenu(false);
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img src="/awuk.png" alt="AWUK" className="h-12 w-auto" />
            </Link>
          <div className="hidden md:flex space-x-1">
          </div>
        </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">

            <Link 
              to="/comunidade" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/comunidade' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {t('navigation.community')}
            </Link>
            <Link 
                to="/eventos" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/eventos' ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {t('navigation.events')}
              </Link>
              <Link 
                to="/oportunidades" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/oportunidades' ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {t('navigation.opportunities')}
              </Link>

            <Link 
              to="/sobre" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/sobre' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              to="/servicos" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/servicos' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {t('navigation.services')}
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:block"><LanguageSelector /></div>
             {isAuthenticated ? (
               <div className="relative">
                 <button
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   <img
                     src={
                       user?.profile_image ||
                       `https://ui-avatars.com/api/?name=${encodeURIComponent(
                         (user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilizador')
                       )}&background=f59e0b&color=fff`
                     }
                     alt={user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilizador'}
                     className="h-8 w-8 rounded-full"
                   />
                   <span>{user?.full_name || user?.first_name}</span>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 
                 {showUserMenu && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                     <Link
                       to="/perfil"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       onClick={() => setShowUserMenu(false)}
                     >
                       {t('common.profile')}
                     </Link>
                     <Link
                       to="/criar-evento"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       onClick={() => setShowUserMenu(false)}
                     >
                       <i className="fas fa-plus mr-2"></i>
                       Criar Evento
                     </Link>
                     <Link
                       to="/criar-oportunidade"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       onClick={() => setShowUserMenu(false)}
                     >
                       <i className="fas fa-briefcase mr-2"></i>
                       Criar Oportunidade
                     </Link>
                     <Link
                       to="/configuracoes"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       onClick={() => setShowUserMenu(false)}
                     >
                       {t('common.settings')}
                     </Link>
                     <hr className="my-1" />
                     <button
                       onClick={handleLogout}
                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                     >
                       {t('common.logout')}
                     </button>
                   </div>
                 )}
               </div>
             ) : (
               <>
                 <Link to="/login" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                   {t('common.login')}
                 </Link>
                 <Link to="/registo" className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition duration-300">
                   {t('common.register')}
                 </Link>
               </>
             )}
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
            <div className="flex justify-end px-2 py-2 bg-white border-t border-gray-200">
              <LanguageSelector />
            </div>
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
                {t('navigation.home')}
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
                {t('navigation.community')}
              </Link>
              <Link 
                to="/eventos" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/eventos' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.events')}
              </Link>
              <Link 
                to="/oportunidades" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/oportunidades' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.opportunities')}
              </Link>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md">
                Negócios
              </a>
              <Link 
                to="/sobre" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/sobre' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
              <Link 
                to="/servicos" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/servicos' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.services')}
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                 {isAuthenticated ? (
                   <div className="space-y-1">
                     <div className="flex items-center px-3 py-2">
                       <img
                         src={
                           user?.profile_image ||
                           `https://ui-avatars.com/api/?name=${encodeURIComponent(
                             (user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilizador')
                           )}&background=f59e0b&color=fff`
                         }
                         alt={user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilizador'}
                         className="h-10 w-10 rounded-full mr-3"
                       />
                       <div>
                         <div className="text-base font-medium text-gray-800">{user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim()}</div>
                         <div className="text-sm text-gray-500">{user?.email}</div>
                       </div>
                     </div>
                     <Link
                       to={`/perfil/${user?.id}`}
                       className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       {t('common.profile')}
                     </Link>
                     <Link
                       to="/configuracoes"
                       className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       {t('common.settings')}
                     </Link>
                     <button
                       onClick={() => {
                         handleLogout();
                         setIsMobileMenuOpen(false);
                       }}
                       className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
                     >
                       {t('common.logout')}
                     </button>
                   </div>
                 ) : (
                   <div className="space-y-1">
                     <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                       {t('common.login')}
                     </Link>
                     <Link to="/registo" className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                       {t('common.register')}
                     </Link>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;