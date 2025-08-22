import React from "react";
import { UserRole, type UserProfile } from "../../types/user";
import { AdminDashboard } from "../../pages/admin/AdminDashboard";
import UnifiedDashboard from "./UnifiedDashboard";
import { VipInvestorDashboard } from "./VipInvestorDashboard";
import { BannedUserDashboard } from "./BannedUserDashboard";
import { PendingUserDashboard } from "./PendingUserDashboard";
import { RejectedUserDashboard } from "./RejectedUserDashboard";

interface DashboardRouterProps {
  userRole: UserRole;
  userProfile: UserProfile;
}

/**
 * Router de dashboards que renderiza o dashboard apropriado
 * baseado no papel do usuário e status de verificação
 */
export function DashboardRouter({
  userRole,
  userProfile,
}: DashboardRouterProps) {
  // Dashboard para usuários banidos
  if (userProfile.isBanned) {
    return (
      <BannedUserDashboard
        banInfo={{
          reason: "Violação dos termos de uso",
          startDate: new Date().toISOString(),
          isPermanent: false,
          appealable: true,
          appealDeadline: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          caseId: "BAN-" + Date.now(),
        }}
        userName={userProfile.address}
      />
    );
  }

  // Dashboard baseado no status de verificação KYC
  if (!userProfile.kycVerified && userRole !== UserRole.ADMIN) {
    return (
      <PendingUserDashboard
        userName={userProfile.address}
        verificationSteps={[
          {
            id: "1",
            title: "Documentos Pessoais",
            description: "Envie seus documentos de identificação",
            status: "completed",
            required: true,
          },
          {
            id: "2",
            title: "Verificação de Endereço",
            description: "Comprove seu endereço residencial",
            status: "pending",
            required: true,
          },
          {
            id: "3",
            title: "Verificação Facial",
            description: "Complete a verificação biométrica",
            status: "pending",
            required: true,
          },
        ]}
        overallStatus="pending"
        estimatedCompletionTime="2-3 dias úteis"
      />
    );
  }

  // Dashboard baseado no papel do usuário (apenas para usuários verificados)
  switch (userRole) {
    case UserRole.ADMIN:
      return <AdminDashboard />;

    case UserRole.VIP_INVESTOR:
      return (
        <VipInvestorDashboard
          metrics={{
            totalInvested: Number(userProfile.totalInvested || 0n),
            portfolioValue: Number(userProfile.totalInvested || 0n),
            totalReturns: 0,
            returnsPercentage: 0,
            vipLevel: userProfile.tier || 1,
            exclusiveDeals: 3,
            stakingRewards: 0,
            referralEarnings: 0,
          }}
          userName={userProfile.address}
        />
      );

    case UserRole.PROJECT:
    case UserRole.VERIFIED_INVESTOR:
    case UserRole.STANDARD_INVESTOR:
      // Dashboard unificado que detecta automaticamente se o usuário tem projetos
      return <UnifiedDashboard />;

    default:
      // Fallback para usuários não verificados ou com papel indefinido
      return (
        <PendingUserDashboard
          userName={userProfile.address}
          verificationSteps={[
            {
              id: "1",
              title: "Documentos Pessoais",
              description: "Envie seus documentos de identificação",
              status: "pending",
              required: true,
            },
            {
              id: "2",
              title: "Verificação de Endereço",
              description: "Comprove seu endereço residencial",
              status: "pending",
              required: true,
            },
            {
              id: "3",
              title: "Verificação Facial",
              description: "Complete a verificação biométrica",
              status: "pending",
              required: true,
            },
          ]}
          overallStatus="pending"
          estimatedCompletionTime="2-3 dias úteis"
        />
      );
  }
}

export default DashboardRouter;
