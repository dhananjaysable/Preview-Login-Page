import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const NotificationItem = React.memo(({ 
  id, 
  type, 
  title, 
  message, 
  duration = 4000, 
  onClose 
}: NotificationProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          icon: <Check className="w-5 h-5" />,
          iconBg: 'rgba(255, 255, 255, 0.2)',
        };
      case 'info':
        return {
          bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          icon: <Info className="w-5 h-5" />,
          iconBg: 'rgba(255, 255, 255, 0.2)',
        };
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          icon: <AlertTriangle className="w-5 h-5" />,
          iconBg: 'rgba(255, 255, 255, 0.2)',
        };
      case 'error':
        return {
          bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          icon: <AlertCircle className="w-5 h-5" />,
          iconBg: 'rgba(255, 255, 255, 0.2)',
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          icon: <Check className="w-5 h-5" />,
          iconBg: 'rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const config = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={isExiting ? { opacity: 0, x: 100, scale: 0.95 } : { opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      style={{
        width: '100%',
        maxWidth: '380px',
        borderRadius: '12px',
        background: config.bg,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '12px',
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px',
        padding: '16px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Icon */}
        <div style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: config.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
        }}>
          {config.icon}
        </div>

        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h4 style={{
              margin: 0,
              marginBottom: '4px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              lineHeight: '1.4',
            }}>
              {title}
            </h4>
          )}
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.95)',
            wordBreak: 'break-word',
          }}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255, 255, 255, 0.4)',
            transformOrigin: 'left',
          }}
        />
      )}

      {/* Decorative shine effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      }} />
    </motion.div>
  );
});

NotificationItem.displayName = 'NotificationItem';

interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}

export const NotificationContainer = React.memo(({ notifications, onClose }: NotificationContainerProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 40px)',
      }}
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <div key={notification.id} style={{ pointerEvents: 'auto' }}>
            <NotificationItem {...notification} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
});

NotificationContainer.displayName = 'NotificationContainer';
