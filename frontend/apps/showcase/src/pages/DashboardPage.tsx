import { Wallet } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import { DashboardRouter } from "../components/dashboard/DashboardRouter";
import { UserRole, type UserProfile } from "../types/user";

/**
 * Dashboard do usuário com investimentos, tokens e estatísticas
 * Exibe portfólio completo e histórico de transações
 */
export default function DashboardPage() {
  const { selectedAccount, isReady } = useWallet();

  // Se não há conta conectada, exibe mensagem
  if (!isReady || !selectedAccount) {
    return (
      <div className="min-h-screen bg-grafite-900 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-grafite-400" />
          <h2 className="text-xl font-semibold mb-2 text-white">Conecte sua carteira</h2>
          <p className="text-grafite-300">
            Para acessar seu dashboard, conecte uma carteira Web3
          </p>
        </div>
      </div>
    );
  }

  // Mock do perfil do usuário - será substituído por dados reais da API
  const mockUserProfile: UserProfile = {
    address: selectedAccount.address,
    role: UserRole.VIP_INVESTOR, // Pode ser alterado para testar diferentes dashboards
    isVip: true,
    kycVerified: true,
    isBanned: false,
    tier: 2,
    totalInvested: 5000n,
    projectsParticipated: 3,
    dailyLimit: 10000n,
    projectLimit: 5n,
    lastInvestment: Date.now(),
    dailySpent: 0n,
    dailyResetBlock: 0,
  };

  // Renderiza o dashboard baseado no papel do usuário
  return (
    <DashboardRouter
      userRole={mockUserProfile.role}
      userProfile={mockUserProfile}
    />
  );
}
