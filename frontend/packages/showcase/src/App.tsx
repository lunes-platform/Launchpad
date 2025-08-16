import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from '@/contexts/WalletContext'
import { AppProvider } from '@/contexts/AppContext'
import PWAManager from '@/components/pwa/PWAManager'
import { Layout } from '@/components/layout/Layout'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { detectBrowserExtensions, createExtensionWarning } from '@/utils/extensionCompatibility'

// Páginas Públicas/Marketing
import HomePage from '@/pages/HomePage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import LaunchpoolPage from '@/pages/LaunchpoolPage'
import RafflePage from '@/pages/RafflePage'
import ComoParticiparPage from '@/pages/ComoParticiparPage'
import ParaProjetosPage from '@/pages/ParaProjetosPage'
import FAQPage from '@/pages/FAQPage'
import SobrePage from '@/pages/SobrePage'
import TermosServicoPage from '@/pages/TermosServicoPage'
import PoliticaPrivacidadePage from '@/pages/PoliticaPrivacidadePage'
import GovernancePage from '@/pages/GovernancePage'
import TreasuryPage from '@/pages/TreasuryPage'
import DocsPage from '@/pages/DocsPage'
import ObservatorioPage from '@/pages/ObservatorioPage'
import LaunchPhasesPage from '@/pages/LaunchPhasesPage'
import SettingsPage from '@/pages/SettingsPage'
import PaymentsPage from '@/pages/PaymentsPage'

// Páginas Dashboard Usuário
import DashboardPage from '@/pages/DashboardPage'
import { MyInvestmentsPage } from '@/pages/dashboard/MyInvestmentsPage'
import { InvestmentDetailsPage } from '@/pages/dashboard/InvestmentDetailsPage'
import { ClaimTokensPage } from '@/pages/dashboard/ClaimTokensPage'
import { WalletsPage } from '@/pages/dashboard/WalletsPage'
import { HistoryPage } from '@/pages/dashboard/HistoryPage'
import { AirdropClaimsPage } from '@/pages/dashboard/AirdropClaimsPage'
import { UserSettingsPage } from '@/pages/dashboard/UserSettingsPage'

// Páginas Admin
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { CreateProjectPage } from '@/pages/admin/CreateProjectPage'
import { EditProjectPage } from '@/pages/admin/EditProjectPage'
import { ProjectAllocationsPage } from '@/pages/admin/ProjectAllocationsPage'
import { ProjectDepositsPage } from '@/pages/admin/ProjectDepositsPage'
import { ProjectDistributionsPage } from '@/pages/admin/ProjectDistributionsPage'
import { AdminTreasuryPage } from '@/pages/admin/AdminTreasuryPage'
import { PendingOperationsPage } from '@/pages/admin/PendingOperationsPage'
import { TreasurySettingsPage } from '@/pages/admin/TreasurySettingsPage'
import { AdminCustodyPage } from '@/pages/admin/AdminCustodyPage'
import { AirdropCampaignsPage } from '@/pages/admin/AirdropCampaignsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminPlatformSettingsPage } from '@/pages/admin/AdminPlatformSettingsPage'
import { AdminAuditPage } from '@/pages/admin/AdminAuditPage'

// Páginas Especiais
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  useEffect(() => {
    // Detect browser extensions and check for conflicts
    const extensions = detectBrowserExtensions()
    const warning = createExtensionWarning()
    
    if (extensions.length > 0) {
      console.log('🔌 Extensões detectadas:', extensions.map(ext => ext.name).join(', '))
    }
    
    if (warning.show) {
      console.warn('⚠️ Conflito de extensões:', warning.message)
    }
  }, [])

  return (
    <ErrorBoundary>
      <AppProvider>
        <WalletProvider>
          <Layout>
            <PWAManager />
            <Routes>
            {/* 🌐 ÁREA PÚBLICA/MARKETING */}
            <Route path="/" element={<HomePage />} />
            
            {/* Projetos */}
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/projetos/:id" element={<ProjectDetailsPage />} />
            
            {/* Funcionalidades Principais */}
            <Route path="/launchpool" element={<LaunchpoolPage />} />
            <Route path="/rifa" element={<RafflePage />} />
            
            {/* Páginas Informativas */}
            <Route path="/como-participar" element={<ComoParticiparPage />} />
            <Route path="/para-projetos" element={<ParaProjetosPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/termos-servico" element={<TermosServicoPage />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
            
            {/* Páginas Principais */}
            <Route path="/governanca" element={<GovernancePage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/treasury" element={<TreasuryPage />} />
            <Route path="/tesouraria" element={<TreasuryPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/documentacao" element={<DocsPage />} />
            <Route path="/observatorio" element={<ObservatorioPage />} />
            <Route path="/fases" element={<LaunchPhasesPage />} />
            <Route path="/launch-phases" element={<LaunchPhasesPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pagamentos" element={<PaymentsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            
            {/* Compatibilidade URLs inglês */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />

            {/* 👤 ÁREA AUTENTICADA (USUÁRIO) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/meus-investimentos" element={<MyInvestmentsPage />} />
            <Route path="/dashboard/meus-investimentos/:id" element={<InvestmentDetailsPage />} />
            <Route path="/dashboard/tokens-a-reivindicar" element={<ClaimTokensPage />} />
            <Route path="/dashboard/carteiras" element={<WalletsPage />} />
            <Route path="/dashboard/historico" element={<HistoryPage />} />
            <Route path="/dashboard/configuracoes" element={<UserSettingsPage />} />
            <Route path="/dashboard/airdrop-claims" element={<AirdropClaimsPage />} />

            {/* 🔧 ÁREA AUTENTICADA (ADMIN) */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            
            {/* Gerenciar Projetos */}
            <Route path="/admin/projetos" element={<AdminProjectsPage />} />
            <Route path="/admin/projetos/novo" element={<CreateProjectPage />} />
            <Route path="/admin/projetos/:id/editar" element={<EditProjectPage />} />
            <Route path="/admin/projetos/:id/alocacoes" element={<ProjectAllocationsPage />} />
            <Route path="/admin/projetos/:id/depositos" element={<ProjectDepositsPage />} />
            <Route path="/admin/projetos/:id/distribuicoes" element={<ProjectDistributionsPage />} />
            
            {/* Gerenciar Tesouraria */}
            <Route path="/admin/tesouraria" element={<AdminTreasuryPage />} />
            <Route path="/admin/tesouraria/operacoes-pendentes" element={<PendingOperationsPage />} />
            <Route path="/admin/tesouraria/configuracoes" element={<TreasurySettingsPage />} />
            
            {/* Gerenciar Custódia */}
            <Route path="/admin/custodia" element={<AdminCustodyPage />} />
            <Route path="/admin/custodia/airdrop-campaigns" element={<AirdropCampaignsPage />} />
            
            {/* Outras funcionalidades Admin */}
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/configuracoes-plataforma" element={<AdminPlatformSettingsPage />} />
            <Route path="/admin/auditoria" element={<AdminAuditPage />} />
            
            {/* 404 - Página não encontrada */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </WalletProvider>
    </AppProvider>
    </ErrorBoundary>
  )
}

export default App
