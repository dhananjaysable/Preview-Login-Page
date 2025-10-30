import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationContainer, NotificationProps, NotificationType } from '../components/NotificationPopup';

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    duration?: number
  ) => void;
  success: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      title?: string,
      duration: number = 4000
    ) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      
      const newNotification: NotificationProps = {
        id,
        type,
        title,
        message,
        duration,
        onClose: (notificationId: string) => {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        },
      };

      setNotifications((prev) => [...prev, newNotification]);
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('success', message, title, duration);
    },
    [showNotification]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('info', message, title, duration);
    },
    [showNotification]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('warning', message, title, duration);
    },
    [showNotification]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('error', message, title, duration);
    },
    [showNotification]
  );

  const handleClose = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    showNotification,
    success,
    info,
    warning,
    error,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onClose={handleClose} />
    </NotificationContext.Provider>
  );
};
