import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button } from "@launchpad/shared-ui";
import { Bell, Mail, Settings } from "lucide-react";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "investment_update",
    title: "Atualização no Projeto SolarMax",
    description: "A fase 2 de desenvolvimento foi concluída com sucesso.",
    timestamp: "2 horas atrás",
    read: false,
  },
  {
    id: 2,
    type: "kyc_approved",
    title: "Sua verificação KYC foi aprovada!",
    description: "Agora você tem acesso a todos os recursos da plataforma.",
    timestamp: "1 dia atrás",
    read: false,
  },
  {
    id: 3,
    type: "reward",
    title: "Você recebeu 50 LPT (Launchpad Tokens)",
    description: "Recompensa por seu investimento contínuo.",
    timestamp: "3 dias atrás",
    read: true,
  },
  {
    id: 4,
    type: "security_alert",
    title: "Alerta de Segurança: Novo login detectado",
    description:
      "Um novo login na sua conta foi detectado a partir de um dispositivo desconhecido.",
    timestamp: "5 dias atrás",
    read: true,
  },
];

const NotificationsPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-gray-600">
            Você tem {unreadCount} notificações não lidas.
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Gerenciar Preferências
        </Button>
      </div>

      <Card padding="lg" className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-4 rounded-lg transition-colors ${
              notification.read ? "bg-gray-50" : "bg-primary-50"
            }`}
          >
            <div className="flex-shrink-0 mr-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? "bg-gray-200" : "bg-primary-100"}`}
              >
                <Mail
                  className={`h-5 w-5 ${notification.read ? "text-gray-600" : "text-primary-600"}`}
                />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600">
                {notification.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {notification.timestamp}
              </p>
            </div>
            {!notification.read && (
              <div className="flex-shrink-0 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como lida
                </Button>
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default NotificationsPage;
