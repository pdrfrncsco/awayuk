import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  CogIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    settings,
    updateSettings
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    if (filter !== 'all') return notification.category === filter;
    return true;
  });

  const getNotificationIcon = (category) => {
    const iconClass = "h-5 w-5";
    switch (category) {
      case 'system':
        return <CogIcon className={iconClass} />;
      case 'event':
        return <BellIcon className={iconClass} />;
      case 'opportunity':
        return <BellIcon className={iconClass} />;
      case 'member':
        return <BellIcon className={iconClass} />;
      default:
        return <BellIcon className={iconClass} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'system':
        return 'bg-gray-100 text-gray-800';
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'opportunity':
        return 'bg-green-100 text-green-800';
      case 'member':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Todas as notificações foram lidas'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <CogIcon className="h-4 w-4 mr-2" />
            Configurações
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Notificações de Sistema</label>
                <p className="text-sm text-gray-500">Receber notificações sobre atualizações do sistema</p>
              </div>
              <button
                onClick={() => updateSettings('system', !settings.system)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.system ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.system ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Notificações de Eventos</label>
                <p className="text-sm text-gray-500">Receber notificações sobre novos eventos</p>
              </div>
              <button
                onClick={() => updateSettings('events', !settings.events)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.events ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.events ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Notificações de Oportunidades</label>
                <p className="text-sm text-gray-500">Receber notificações sobre novas oportunidades</p>
              </div>
              <button
                onClick={() => updateSettings('opportunities', !settings.opportunities)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.opportunities ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.opportunities ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'unread', label: 'Não lidas' },
          { key: 'read', label: 'Lidas' },
          { key: 'system', label: 'Sistema' },
          { key: 'event', label: 'Eventos' },
          { key: 'opportunity', label: 'Oportunidades' },
          { key: 'member', label: 'Membros' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              filter === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notificação</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Não há notificações para mostrar.'
                : `Não há notificações ${filter === 'unread' ? 'não lidas' : filter === 'read' ? 'lidas' : `da categoria ${filter}`}.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-4 rounded-lg border ${
                notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${getCategoryColor(notification.category)}`}>
                    {getNotificationIcon(notification.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                        {notification.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Marcar como lida"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Remover notificação"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={clearAllNotifications}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Limpar todas as notificações
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;