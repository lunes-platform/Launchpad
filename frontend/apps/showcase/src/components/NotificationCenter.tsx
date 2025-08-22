import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import type { Notification, NotificationPriority } from '../services/notificationService';
import type { UserInvestment } from '../types';

interface NotificationCenterProps {
  investments: UserInvestment[];
  className?: string;
}

/**
 * Componente individual de notificação
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDismiss }) => {
  const typeInfo = NotificationService.getNotificationTypeInfo(notification.type);
  const priorityInfo = NotificationService.getPriorityInfo(notification.priority);
  
  const handleAction = () => {
    onMarkAsRead(notification.id);
    if (notification.actionUrl) {
      // Em uma aplicação real, isso seria um roteamento
      console.log('Navegando para:', notification.actionUrl);
    }
  };

  return (
    <div className={`p-4 border-l-4 rounded-lg transition-all duration-200 ${
      notification.status === 'unread' 
        ? 'bg-white border-l-blue-500 shadow-sm' 
        : 'bg-gray-50 border-l-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${typeInfo.bgColor}`}>
            <span>{typeInfo.icon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium text-sm ${
                notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {notification.title}
              </h4>
              
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {priorityInfo.label}
              </span>
              
              {notification.status === 'unread' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            
            <p className={`text-sm mb-2 ${
              notification.status === 'unread' ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {notification.message}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(notification.timestamp).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              
              {notification.actionUrl && (
                <button
                  onClick={handleAction}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver detalhes
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {notification.status === 'unread' && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="Marcar como lida"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Descartar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Centro de notificações principal
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  investments, 
  className = '' 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Inicializa e atualiza notificações
  useEffect(() => {
    NotificationService.initialize(investments);
    updateNotifications();
    
    // Atualiza notificações a cada 5 minutos
    const interval = setInterval(() => {
      NotificationService.initialize(investments);
      updateNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [investments]);

  const updateNotifications = () => {
    setNotifications(NotificationService.getAllNotifications());
  };

  const handleMarkAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
    updateNotifications();
  };

  const handleDismiss = (notificationId: string) => {
    NotificationService.dismissNotification(notificationId);
    updateNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    updateNotifications();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return notification.status === 'unread';
    if (filter === 'high') return notification.priority === 'high' || notification.priority === 'urgent';
    return notification.status !== 'dismissed' && notification.status !== 'archived';
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const highPriorityCount = notifications.filter(n => 
    (n.priority === 'high' || n.priority === 'urgent') && n.status === 'unread'
  ).length;

  return (
    <div className={`relative ${className}`}>
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notificações"
      >
        <Bell className="w-6 h-6" />
        
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs font-medium text-white rounded-full flex items-center justify-center ${
            highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Painel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filtros */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Todas', count: filteredNotifications.length },
                  { key: 'unread', label: 'Não lidas', count: unreadCount },
                  { key: 'high', label: 'Importantes', count: highPriorityCount }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === filterOption.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Lista de notificações */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDismiss={handleDismiss}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'Nenhuma notificação não lida' :
                     filter === 'high' ? 'Nenhuma notificação importante' :
                     'Nenhuma notificação'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Hook para usar notificações em componentes
 */
export const useNotifications = (investments: UserInvestment[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    NotificationService.initialize(investments);
    updateNotifications();
    
    const interval = setInterval(() => {
      NotificationService.initialize(investments);
      updateNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [investments]);

  const updateNotifications = () => {
    const allNotifications = NotificationService.getAllNotifications();
    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter(n => n.status === 'unread').length);
  };

  const markAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
    updateNotifications();
  };

  const markAllAsRead = () => {
    NotificationService.markAllAsRead();
    updateNotifications();
  };

  const dismiss = (notificationId: string) => {
    NotificationService.dismissNotification(notificationId);
    updateNotifications();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    refresh: updateNotifications
  };
};

export default NotificationCenter;