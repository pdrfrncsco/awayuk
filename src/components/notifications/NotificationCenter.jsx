import React, { useState, Fragment } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  Cog6ToothIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useNotifications, NOTIFICATION_CATEGORIES, NOTIFICATION_TYPES } from '../../contexts/NotificationsContext';

const NotificationCenter = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    settings,
    updateSettings
  } = useNotifications();

  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const categories = [
    { 
      id: 'all', 
      name: 'Todas', 
      icon: BellIcon, 
      notifications: notifications 
    },
    { 
      id: NOTIFICATION_CATEGORIES.EVENTS, 
      name: 'Eventos', 
      icon: CalendarIcon, 
      notifications: getNotificationsByCategory(NOTIFICATION_CATEGORIES.EVENTS) 
    },
    { 
      id: NOTIFICATION_CATEGORIES.OPPORTUNITIES, 
      name: 'Oportunidades', 
      icon: BriefcaseIcon, 
      notifications: getNotificationsByCategory(NOTIFICATION_CATEGORIES.OPPORTUNITIES) 
    },
    { 
      id: NOTIFICATION_CATEGORIES.MESSAGES, 
      name: 'Mensagens', 
      icon: ChatBubbleLeftIcon, 
      notifications: getNotificationsByCategory(NOTIFICATION_CATEGORIES.MESSAGES) 
    },
    { 
      id: NOTIFICATION_CATEGORIES.COMMUNITY, 
      name: 'Comunidade', 
      icon: UserGroupIcon, 
      notifications: getNotificationsByCategory(NOTIFICATION_CATEGORIES.COMMUNITY) 
    },
    { 
      id: NOTIFICATION_CATEGORIES.SYSTEM, 
      name: 'Sistema', 
      icon: InformationCircleIcon, 
      notifications: getNotificationsByCategory(NOTIFICATION_CATEGORIES.SYSTEM) 
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.EVENT:
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case NOTIFICATION_TYPES.OPPORTUNITY:
        return <BriefcaseIcon className="h-5 w-5 text-indigo-500" />;
      case NOTIFICATION_TYPES.MESSAGE:
        return <ChatBubbleLeftIcon className="h-5 w-5 text-pink-500" />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-PT');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Em produção, usar navigate do react-router
      window.location.href = notification.actionUrl;
      onClose();
    }
  };

  const handleSettingsChange = (category, enabled) => {
    updateSettings({
      categories: {
        ...settings.categories,
        [category]: enabled
      }
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    <div>
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Notificações
                      </Dialog.Title>
                      {unreadCount > 0 && (
                        <p className="text-sm text-gray-500">
                          {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                      title="Configurações"
                    >
                      <Cog6ToothIcon className="h-5 w-5" />
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                        title="Marcar todas como lidas"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={clearAllNotifications}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-md"
                      title="Limpar todas"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Configurações de Notificação
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notificações por email</span>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notificações push</span>
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Categorias:</p>
                        {Object.entries(settings.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-700 capitalize">
                              {category.replace('_', ' ')}
                            </span>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => handleSettingsChange(category, e.target.checked)}
                              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                  <Tab.List className="flex space-x-1 bg-gray-100 p-1 mx-6 mt-4 rounded-lg">
                    {categories.map((category, index) => (
                      <Tab
                        key={category.id}
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ${
                            selected
                              ? 'bg-white shadow text-yellow-700'
                              : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                          }`
                        }
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.name}</span>
                          {category.notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                              {category.notifications.filter(n => !n.isRead).length}
                            </span>
                          )}
                        </div>
                      </Tab>
                    ))}
                  </Tab.List>

                  <Tab.Panels className="mt-4">
                    {categories.map((category) => (
                      <Tab.Panel key={category.id} className="px-6 pb-6">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {category.notifications.length === 0 ? (
                            <div className="text-center py-8">
                              <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">Nenhuma notificação</p>
                            </div>
                          ) : (
                            category.notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                  notification.isRead
                                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className={`text-sm font-medium ${
                                          notification.isRead ? 'text-gray-900' : 'text-gray-900'
                                        }`}>
                                          {notification.title}
                                        </p>
                                        <p className={`mt-1 text-sm ${
                                          notification.isRead ? 'text-gray-500' : 'text-gray-600'
                                        }`}>
                                          {notification.message}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-400">
                                          {formatTimeAgo(notification.createdAt)}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-2 ml-4">
                                        {!notification.isRead && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notification.id);
                                          }}
                                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                                          title="Remover"
                                        >
                                          <XMarkIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NotificationCenter;