import React from "react";
import { AlertTriangle, Mail, ExternalLink, Clock, Shield } from "lucide-react";
import type { UserProfile } from "../../types/user";
import { UserBadge } from "../ui/UserBadge";

interface BannedUserLayoutProps {
  userProfile: UserProfile;
  children: React.ReactNode;
}

/**
 * Layout restrito para usuários banidos
 * Exibe informações sobre o banimento e opções limitadas
 */
export function BannedUserLayout({
  userProfile,
  children,
}: BannedUserLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com aviso de banimento */}
      <header className="bg-red-600 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Lunes Launchpad</h1>
              <p className="text-red-100 text-sm">Acesso Restrito</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserBadge
              role="banned"
              isVip={false}
              isVerified={false}
              size="sm"
            />
            <div className="text-right">
              <p className="text-sm font-medium">Usuário Banido</p>
              <p className="text-xs text-red-100">
                {userProfile.address.slice(0, 8)}...
                {userProfile.address.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Aviso de banimento */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-900 mb-2">
                Conta Suspensa
              </h2>
              <p className="text-red-700 mb-4">
                Sua conta foi suspensa devido a violações dos termos de uso da
                plataforma. Durante este período, o acesso a investimentos,
                staking e participação em rifas está bloqueado.
              </p>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Funcionalidades Disponíveis
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Visualização de informações públicas</li>
                  <li>• Resgate de tokens já adquiridos (claim)</li>
                  <li>• Acesso ao histórico de transações</li>
                  <li>• Contato com suporte para recurso</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Opções de contato */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-grafite">
                Entrar em Contato
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Se você acredita que este banimento foi aplicado por engano, entre
              em contato conosco.
            </p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Enviar Recurso</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExternalLink className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-grafite">
                Termos de Uso
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Revise nossos termos de uso para entender as políticas da
              plataforma.
            </p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Ver Termos</span>
            </button>
          </div>
        </div>

        {/* Conteúdo limitado */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Funcionalidades Limitadas
          </h3>
          <div className="border-t border-gray-200 pt-4">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-grafite text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-grafite-300">
            © 2024 Lunes Launchpad. Todos os direitos reservados.
          </p>
          <p className="text-sm text-grafite-400 mt-2">
            Para questões sobre suspensão de conta, entre em contato com nosso
            suporte.
          </p>
        </div>
      </footer>
    </div>
  );
}
