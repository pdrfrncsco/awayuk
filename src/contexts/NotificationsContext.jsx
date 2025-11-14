import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { services } from '../services';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryStats, setCategoryStats] = useState({});
  const [settingsSaving, setSettingsSaving] = useState(false);

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
        setLoading(true);
        setError(null);
        const res = await services.notifications.getNotifications({ page: 1, limit: 50 });
        const items = Array.isArray(res) ? res : res?.results || [];
        const mapped = items.map(mapBackendNotification);
        setNotifications(mapped);
        setCategoryStats(computeCategoryStats(mapped));

        // Buscar contagem real se disponível
        try {
          const stats = await services.notifications.getNotificationStats();
          setUnreadCount(stats?.unread_notifications ?? mapped.filter(n => !n.read).length);
          const normalizedStats = normalizeStats(stats, mapped);
          if (normalizedStats) setCategoryStats(normalizedStats);
        } catch {
          setUnreadCount(mapped.filter(n => !n.read).length);
        }

        try {
          const prefs = await services.notifications.getNotificationSettings();
          const normalized = normalizeSettings(prefs);
          setSettings(prev => ({ ...prev, ...normalized }));
        } catch (e) {
        }

      } catch (error) {
        console.warn('Falha ao obter notificações:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, user, mapBackendNotification]);

  useEffect(() => {
    setCategoryStats(computeCategoryStats(notifications));
  }, [notifications]);

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
      await services.notifications.markAsRead(notificationId);
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
      await services.notifications.markAllAsRead();
    } catch (e) {
      console.warn('Falha ao marcar todas como lidas:', e.message);
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Remover notificação
  const removeNotification = useCallback(async (notificationId) => {
    try {
      await services.notifications.deleteNotification(notificationId);
    } catch (e) {
      console.warn('Falha ao remover notificação:', e.message);
    }
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
  const clearAllNotifications = useCallback(async () => {
    try {
      await services.notifications.deleteAllRead();
    } catch (e) {
      console.warn('Falha ao limpar notificações lidas:', e.message);
    }
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  // Atualizar configurações (aceita objeto ou par chave/valor)
  const updateSettings = useCallback(async (keyOrSettings, value) => {
    let next;
    if (typeof keyOrSettings === 'string') {
      next = (prev => ({ ...prev, [keyOrSettings]: value }));
      setSettings(prev => next(prev));
    } else {
      next = (prev => ({ ...prev, ...keyOrSettings }));
      setSettings(prev => next(prev));
    }
    try {
      setSettingsSaving(true);
      const current = typeof keyOrSettings === 'string'
        ? next(settings)
        : next(settings);
      const payload = toBackendSettings(current);
      await services.notifications.updateNotificationSettings(payload);
    } catch (e) {
      console.warn('Falha ao atualizar configurações:', e.message);
    } finally {
      setSettingsSaving(false);
    }
  }, [settings]);

  const computeCategoryStats = (list) => {
    const base = { all: { total: 0, unread: 0 }, event: { total: 0, unread: 0 }, opportunity: { total: 0, unread: 0 }, member: { total: 0, unread: 0 }, system: { total: 0, unread: 0 } };
    for (const n of list) {
      const cat = base[n.category] ? n.category : 'system';
      base[cat].total += 1;
      if (!n.read) base[cat].unread += 1;
      base.all.total += 1;
      if (!n.read) base.all.unread += 1;
    }
    return base;
  };

  const normalizeStats = (stats, mapped) => {
    if (!stats) return null;
    const base = computeCategoryStats(mapped);
    const source = stats.by_category || stats.category_counts || null;
    if (!source) return base;
    const apply = (cat, data) => {
      const total = data.total ?? data.count ?? data.all ?? base[cat].total;
      const unread = data.unread ?? data.unread_count ?? base[cat].unread;
      return { total, unread };
    };
    if (Array.isArray(source)) {
      for (const item of source) {
        const key = (item.category || item.name || '').toLowerCase();
        if (base[key]) base[key] = apply(key, item);
      }
      base.all = apply('all', stats);
      return base;
    }
    for (const key of Object.keys(source)) {
      if (base[key]) base[key] = apply(key, source[key]);
    }
    base.all = apply('all', stats);
    return base;
  };

  const sendTestNotification = useCallback(async () => {
    try {
      const res = await services.notifications.sendTestNotification();
      const item = Array.isArray(res) ? res[0] : res?.notification || res;
      if (item) {
        const mapped = mapBackendNotification(item);
        addNotification(mapped);
      } else {
        addNotification({ title: 'Notificação de teste', message: 'Teste enviado', category: 'system' });
      }
    } catch (e) {
      addNotification({ title: 'Falha no teste', message: e.message || 'Erro ao enviar notificação de teste', category: 'system' });
    }
  }, [addNotification, mapBackendNotification]);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await services.notifications.getNotifications({ page: 1, limit: 50 });
      const items = Array.isArray(res) ? res : res?.results || [];
      const mapped = items.map(mapBackendNotification);
      setNotifications(mapped);
      setCategoryStats(computeCategoryStats(mapped));
    } catch (e) {
    }
  }, [mapBackendNotification]);

  const normalizeSettings = (prefs) => {
    const flat = {
      emailNotifications: prefs.emailNotifications ?? prefs.email_notifications ?? settings.emailNotifications,
      pushNotifications: prefs.pushNotifications ?? prefs.push_notifications ?? settings.pushNotifications,
    };
    const categories = prefs.categories || {};
    return {
      ...flat,
      system: prefs.system ?? categories.system ?? settings.system,
      events: prefs.events ?? categories.events ?? settings.events,
      opportunities: prefs.opportunities ?? categories.opportunities ?? settings.opportunities,
      member: prefs.member ?? categories.member ?? settings.member
    };
  };

  const toBackendSettings = (cur) => {
    return {
      email_notifications: !!cur.emailNotifications,
      push_notifications: !!cur.pushNotifications,
      categories: {
        system: !!cur.system,
        events: !!cur.events,
        opportunities: !!cur.opportunities,
        member: !!cur.member
      }
    };
  };

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
    loading,
    error,
    categoryStats,
    settingsSaving,
    addNotification,
    showToast,
    removeToast,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    sendTestNotification,
    refreshNotifications,
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