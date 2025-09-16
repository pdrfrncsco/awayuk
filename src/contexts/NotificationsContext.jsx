import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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

// Categorias de notificação
export const NOTIFICATION_CATEGORIES = {
  EVENTS: 'events',
  OPPORTUNITIES: 'opportunities',
  MESSAGES: 'messages',
  SYSTEM: 'system',
  COMMUNITY: 'community',
  PROFILE: 'profile'
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
    categories: {
      [NOTIFICATION_CATEGORIES.EVENTS]: true,
      [NOTIFICATION_CATEGORIES.OPPORTUNITIES]: true,
      [NOTIFICATION_CATEGORIES.MESSAGES]: true,
      [NOTIFICATION_CATEGORIES.SYSTEM]: true,
      [NOTIFICATION_CATEGORIES.COMMUNITY]: true,
      [NOTIFICATION_CATEGORIES.PROFILE]: true
    }
  });

  // Mock data para demonstração
  useEffect(() => {
    if (isAuthenticated && user) {
      const mockNotifications = [
        {
          id: 1,
          type: NOTIFICATION_TYPES.EVENT,
          category: NOTIFICATION_CATEGORIES.EVENTS,
          title: 'Novo Evento: Networking em Londres',
          message: 'Um novo evento de networking foi criado para a próxima semana.',
          data: { eventId: 123, location: 'Londres' },
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          actionUrl: '/events/123'
        },
        {
          id: 2,
          type: NOTIFICATION_TYPES.OPPORTUNITY,
          category: NOTIFICATION_CATEGORIES.OPPORTUNITIES,
          title: 'Nova Oportunidade de Emprego',
          message: 'Uma nova vaga de desenvolvedor foi publicada em Manchester.',
          data: { opportunityId: 456, company: 'Tech Solutions Ltd' },
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
          actionUrl: '/opportunities/456'
        },
        {
          id: 3,
          type: NOTIFICATION_TYPES.MESSAGE,
          category: NOTIFICATION_CATEGORIES.MESSAGES,
          title: 'Nova Mensagem',
          message: 'João Silva enviou-lhe uma mensagem.',
          data: { senderId: 789, senderName: 'João Silva' },
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
          actionUrl: '/messages/789'
        },
        {
          id: 4,
          type: NOTIFICATION_TYPES.SYSTEM,
          category: NOTIFICATION_CATEGORIES.SYSTEM,
          title: 'Perfil Atualizado',
          message: 'O seu perfil foi atualizado com sucesso.',
          data: {},
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          actionUrl: '/profile'
        },
        {
          id: 5,
          type: NOTIFICATION_TYPES.INFO,
          category: NOTIFICATION_CATEGORIES.COMMUNITY,
          title: 'Bem-vindo à Comunidade!',
          message: 'Explore as funcionalidades da plataforma e conecte-se com outros membros.',
          data: {},
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
          actionUrl: '/dashboard'
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    }
  }, [isAuthenticated, user]);

  // Adicionar nova notificação
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      isRead: false,
      createdAt: new Date(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Se as notificações push estão ativadas, mostrar toast
    if (settings.pushNotifications && settings.categories[notification.category]) {
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

    // Auto-remover após a duração especificada
    setTimeout(() => {
      removeToast(toastId);
    }, toast.duration);
  }, []);

  // Remover toast
  const removeToast = useCallback((toastId) => {
    setToastNotifications(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  // Marcar notificação como lida
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // Remover notificação
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      
      if (notification && !notification.isRead) {
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

  // Atualizar configurações
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Filtrar notificações por categoria
  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  // Obter notificações não lidas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.isRead);
  }, [notifications]);

  // Simular notificações em tempo real (em produção seria via WebSocket)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Simular recebimento de notificação aleatória
      if (Math.random() < 0.1) { // 10% de chance a cada 30 segundos
        const types = Object.values(NOTIFICATION_TYPES);
        const categories = Object.values(NOTIFICATION_CATEGORIES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const mockNotifications = {
          [NOTIFICATION_TYPES.EVENT]: {
            title: 'Novo Evento Disponível',
            message: 'Um novo evento foi criado na sua área.',
            category: NOTIFICATION_CATEGORIES.EVENTS
          },
          [NOTIFICATION_TYPES.OPPORTUNITY]: {
            title: 'Nova Oportunidade',
            message: 'Uma nova oportunidade de trabalho foi publicada.',
            category: NOTIFICATION_CATEGORIES.OPPORTUNITIES
          },
          [NOTIFICATION_TYPES.MESSAGE]: {
            title: 'Nova Mensagem',
            message: 'Você recebeu uma nova mensagem.',
            category: NOTIFICATION_CATEGORIES.MESSAGES
          }
        };

        const mockNotification = mockNotifications[randomType];
        if (mockNotification) {
          addNotification({
            type: randomType,
            category: mockNotification.category,
            title: mockNotification.title,
            message: mockNotification.message,
            data: {}
          });
        }
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, addNotification]);

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