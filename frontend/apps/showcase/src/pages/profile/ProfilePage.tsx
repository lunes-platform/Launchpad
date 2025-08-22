import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "@launchpad/shared-ui";
import { User, Settings, Bell, Wallet } from "lucide-react";

function ProfilePage() {
  const { user, isLoading } = useAuth();

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

  const profileSections = [
    {
      title: "Meu Perfil",
      description: "Visualize e edite suas informações pessoais.",
      icon: <User className="h-6 w-6 text-gray-500" />,
      link: "/profile/details",
    },
    {
      title: "Configurações da Conta",
      description: "Ajuste as preferências e a segurança da sua conta.",
      icon: <Settings className="h-6 w-6 text-gray-500" />,
      link: "/settings",
    },
    {
      title: "Gerenciar Notificações",
      description: "Escolha como e quando você quer ser notificado.",
      icon: <Bell className="h-6 w-6 text-gray-500" />,
      link: "/notifications",
    },
    {
      title: "Minha Carteira",
      description: "Visualize o balanço e o histórico de transações.",
      icon: <Wallet className="h-6 w-6 text-gray-500" />,
      link: "/wallet",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Visão Geral da Conta</h1>
      <p className="text-gray-600 mb-8">
        Gerencie seu perfil, configurações e muito mais.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileSections.map((section) => (
          <Link to={section.link} key={section.title} className="no-underline">
            <Card
              hoverable
              clickable
              padding="lg"
              header={
                <div className="flex items-center space-x-4">
                  {section.icon}
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
              }
            >
              <p className="text-gray-600 mt-2">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
