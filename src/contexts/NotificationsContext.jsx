import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services';

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  EVENT: 'event',
  OPPORTUNITY: 'opportunity',
  MESSAGE: 'message',
  SYSTEM: 'system'
};

// Categorias de notificação (alinhadas com a UI)
export const NOTIFICATION_CATEGORIES = {
  SYSTEM: 'system',
  EVENT: 'event',
  OPPORTUNITY: 'opportunity',
  MEMBER: 'member'
};

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    system: true,
    events: true,
    opportunities: true,
    member: true
  });

  // Mapa do backend -> frontend
  const mapBackendNotification = useCallback((n) => {
    const typeName = (n.notification_type_name || '').toLowerCase();
    let category = 'system';
    if (typeName.includes('event') || typeName.includes('evento')) category = 'event';
    else if (typeName.includes('opport') || typeName.includes('oportun')) category = 'opportunity';
    else if (typeName.includes('member') || typeName.includes('membro')) category = 'member';
    else if (typeName.includes('system') || typeName.includes('sistem')) category = 'system';

    return {
      id: n.id,
      title: n.title,
      message: n.message,
      category,
      read: !!n.is_read,
      timestamp: n.created_at,
      actionUrl: n.action_url || '',
      actionText: n.action_text || ''
    };
  }, []);

  // Carregar notificações reais do backend
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const load = async () => {
      try {
        const res = await notificationService.getNotifications({ page: 1, limit: 50 });
        const items = Array.isArray(res) ? res : res?.results || [];
        const mapped = items.map(mapBackendNotification);
        setNotifications(mapped);

        // Buscar contagem real se disponível
        try {
          const stats = await notificationService.getNotificationStats();
          setUnreadCount(stats?.unread_notifications ?? mapped.filter(n => !n.read).length);
        } catch {
          setUnreadCount(mapped.filter(n => !n.read).length);
        }
      } catch (error) {
        console.warn('Falha ao obter notificações:', error.message);
      }
    };

    load();
  }, [isAuthenticated, user, mapBackendNotification]);

  // Adicionar nova notificação
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: new Date(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Mostrar toast se permitido
    const key = newNotification.category === 'event' ? 'events' :
      newNotification.category === 'opportunity' ? 'opportunities' :
      newNotification.category;
    if (settings.pushNotifications && settings[key]) {
      showToast(newNotification);
    }
  }, [settings]);

  // Mostrar notificação toast
  const showToast = useCallback((notification) => {
    const toastId = Date.now();
    const toast = {
      id: toastId,
      ...notification,
      autoHide: true,
      duration: 5000
    };

    setToastNotifications(prev => [...prev, toast]);

    setTimeout(() => {
      removeToast(toastId);
    }, toast.duration);
  }, []);

  // Remover toast
  const removeToast = useCallback((toastId) => {
    setToastNotifications(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  // Marcar notificação como lida (sincroniza com backend)
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
    } catch (e) {
      console.warn('Falha ao marcar como lida:', e.message);
    }

    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marcar todas como lidas (sincroniza com backend)
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
    } catch (e) {
      console.warn('Falha ao marcar todas como lidas:', e.message);
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Remover notificação
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      return newNotifications;
    });
  }, []);

  // Limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Atualizar configurações (aceita objeto ou par chave/valor)
  const updateSettings = useCallback((keyOrSettings, value) => {
    if (typeof keyOrSettings === 'string') {
      setSettings(prev => ({ ...prev, [keyOrSettings]: value }));
    } else {
      setSettings(prev => ({ ...prev, ...keyOrSettings }));
    }
  }, []);

  // Filtrar notificações por categoria
  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  // Obter notificações não lidas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Desativar simulação de tempo real por enquanto
  useEffect(() => {
    // Sem simulação para evitar inconsistências com categorias
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    toastNotifications,
    settings,
    addNotification,
    showToast,
    removeToast,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationsByCategory,
    getUnreadNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;