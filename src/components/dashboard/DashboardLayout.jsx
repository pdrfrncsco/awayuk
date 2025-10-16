import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  UserGroupIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions, PERMISSIONS } from '../../contexts/PermissionsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { PermissionCheck } from './PermissionGuard';
import { NotificationCenter } from '../notifications';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userRole, canAccessDashboard } = usePermissions();
  const { unreadCount } = useNotifications();
  const displayName = user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Utilizador';
  
  // Se o utilizador não tem acesso ao dashboard, não renderiza nada
  if (!canAccessDashboard()) {
    return null;
  }

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    { 
      name: 'Onboarding', 
      href: '/dashboard/onboarding', 
      icon: DocumentTextIcon,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    { 
      name: 'Membros', 
      href: '/dashboard/membros', 
      icon: UsersIcon,
      permission: PERMISSIONS.VIEW_MEMBERS
    },
    { 
      name: 'Eventos', 
      href: '/dashboard/eventos', 
      icon: CalendarIcon,
      permission: PERMISSIONS.VIEW_EVENTS
    },
    { 
      name: 'Oportunidades', 
      href: '/dashboard/oportunidades', 
      icon: BriefcaseIcon,
      permission: PERMISSIONS.VIEW_OPPORTUNITIES
    },
    { 
      name: 'Conteúdos', 
      href: '/dashboard/conteudos', 
      icon: DocumentTextIcon,
      permission: PERMISSIONS.VIEW_CONTENT
    },
    { 
      name: 'Avaliações', 
      href: '/dashboard/testemunhos', 
      icon: ChatBubbleLeftRightIcon,
      permission: PERMISSIONS.EDIT_CONTENT
    },
    { 
      name: 'Estatísticas', 
      href: '/dashboard/estatisticas', 
      icon: ChartBarIcon,
      permission: PERMISSIONS.VIEW_STATISTICS
    },
    { 
      name: 'Roles & Permissões', 
      href: '/dashboard/roles', 
      icon: ShieldCheckIcon,
      permission: PERMISSIONS.MANAGE_USERS
    },
    { 
      name: 'Notificações', 
      href: '/dashboard/notificacoes', 
      icon: BellIcon,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    { 
      name: 'Comunidade', 
      href: '/dashboard/comunidade', 
      icon: UserGroupIcon,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    { 
      name: 'Conexões', 
      href: '/dashboard/conexoes', 
      icon: LinkIcon,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    { 
      name: 'Configurações', 
      href: '/dashboard/configuracoes', 
      icon: CogIcon,
      permission: PERMISSIONS.VIEW_SETTINGS
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AW</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">AWAYSUK</span>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <PermissionCheck key={item.name} permission={item.permission}>
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-red-100 text-red-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 flex-shrink-0 h-6 w-6 ${
                          isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{displayName}</p>
                <p className="text-xs font-medium text-gray-500">{user?.email}</p>
                <p className="text-xs font-medium text-red-600 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AW</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">AWAYSUK</span>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <PermissionCheck key={item.name} permission={item.permission}>
                    <Link
                      to={item.href}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{displayName}</p>
                <p className="text-xs font-medium text-gray-500">{user?.email}</p>
                <p className="text-xs font-medium text-red-600 capitalize">{userRole}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                title="Sair"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-20 md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setNotificationCenterOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Top navigation bar */}
        <div className="hidden md:block bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setNotificationCenterOpen(true)}
                  className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center shadow-lg animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Utilizador'}</span>
                    <p className="text-xs font-medium text-red-600 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-12rem)] p-4 sm:p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;