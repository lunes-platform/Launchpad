import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Route,
} from "react-router-dom";

// Wrapper para resolver compatibilidade de tipos React 19
const OutletComponent = () => {
  const Component = Outlet as React.ComponentType;
  return <Component />;
};
import { QueryProvider } from "./providers/QueryProvider";
import { WalletProvider } from "./contexts/WalletContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppConfigProvider } from "./contexts/AppConfigContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  HomePage,
  ProjectsPage,
  ProjectDetailPage,
  DashboardPage,
  ProfilePage,
  ProfileDetailsPage,
  SettingsPage,
  NotificationsPage,
  WalletPage,
  VipPage,
  VipReportsPage,
  UpgradeVipPage,
  LoginPage,
  KYCPage,
  InvestorRankingPage,
  RewardsSchedulePage,
  StakingPage,
} from "./pages";
import HowItWorksPage from "./pages/HowItWorksPage";
import { PartnersPage } from "./pages/PartnersPage";
import { TripleAProjectsPage } from "./pages/TripleAProjectsPage";
import { RaffleHistoryPage } from "./pages/RaffleHistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LaunchpoolPage from "./pages/LaunchpoolPage";

import RafflesPage from "./pages/RafflesPage";
import RaffleDetailsPage from "./pages/RaffleDetailsPage";
import ComponentsShowcase from "./pages/ComponentsShowcase";
import { DashboardDemo } from "./pages/DashboardDemo";
import InvestmentsPage from "./pages/InvestmentsPage";
import AirdropPage from "./pages/AirdropPage";
import ProjectListingPage from "./pages/ProjectListingPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import GovernancePage from "./pages/GovernancePage";
import DashboardStakingPage from "./pages/DashboardStakingPage";
// Admin Pages
import {
  AdminDashboard,
  AdminAnalytics,
  AdminUsers,
  AdminProjects,
  AdminRewards,
  AdminSettings,
} from "./pages/admin";
// Other Pages
// Dashboards removidos - agora usando UnifiedDashboard via DashboardRouter

import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationContainer } from "./components/ui/NotificationToast";
import { Layout as AppLayout } from "./components/layout/Layout";
import { useNotifications } from "./hooks/useNotifications";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./index.css";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserRole } from "./types/auth";

/**
 * Layout principal da aplicação
 * Contém navegação contextual e conteúdo principal
 * Usa Outlet do React Router para renderizar páginas filhas
 */
function Layout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <QueryProvider>
          <WalletProvider>
            <AuthProvider>
              <AppConfigProvider>
                <NotificationProvider
                  defaultDuration={5000}
                  maxNotifications={10}
                >
                  <AppContent />
                </NotificationProvider>
              </AppConfigProvider>
            </AuthProvider>
          </WalletProvider>
        </QueryProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

/**
 * Componente interno que usa o hook de notificações
 */
function AppContent() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <>
      <AppLayout>
        <OutletComponent />
      </AppLayout>

      {/* Container de notificações */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
        maxVisible={5}
      />
    </>
  );
}

/**
 * Configuração das rotas da aplicação usando React Router v6
 * Define a estrutura de navegação e componentes para cada rota
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Rotas Públicas
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "projetos",
        element: <ProjectsPage />,
      },
      {
        path: "projetos/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "raffles",
        element: <RafflesPage />,
      },
      {
        path: "raffles/:id",
        element: <RaffleDetailsPage />,
      },
      {
        path: "governanca",
        element: <GovernancePage />,
      },
      {
        path: "components",
        element: <ComponentsShowcase />,
      },
      {
        path: "how-it-works",
        element: <HowItWorksPage />,
      },
      {
        path: "parceiros",
        element: <PartnersPage />,
      },
      {
        path: "projetos-3a",
        element: <TripleAProjectsPage />,
      },

      // Rotas Protegidas Gerais
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "dashboard/investimentos", element: <InvestmentsPage /> },
          { path: "airdrop", element: <AirdropPage /> },
          { path: "dashboard-demo", element: <DashboardDemo /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "launchpool", element: <LaunchpoolPage /> },
          { path: "staking", element: <DashboardStakingPage /> },
          { path: "rewards-schedule", element: <RewardsSchedulePage /> },
          { path: "investor-ranking", element: <InvestorRankingPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/details", element: <ProfileDetailsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "wallet", element: <WalletPage /> },
          { path: "upgrade-vip", element: <UpgradeVipPage /> },
          { path: "raffle-history", element: <RaffleHistoryPage /> },
          { path: "listar-projeto", element: <ProjectListingPage /> },
          { path: "editar-projeto/:id", element: <EditProjectPage /> },
        ],
      },
      // Rota protegida específica para criação de projetos
      {
        element: (
          <ProtectedRoute 
            allowedRoles={[
              UserRole.INVESTOR_VIP, 
              UserRole.INVESTOR_VERIFIED, 
              UserRole.INVESTOR_STANDARD,
              UserRole.PRICE_ORACLE,
              UserRole.PROJECT_ISSUER, 
              UserRole.ADMIN
            ]} 
          />
        ),
        children: [
          { path: "criar-projeto", element: <CreateProjectPage /> },
        ],
      },

      // Rotas Administrativas
      {
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.ADMIN]}
          />
        ),
        children: [
          { path: "admin", element: <AdminDashboard /> },
          { path: "admin/analytics", element: <AdminAnalytics /> },
          { path: "admin/users", element: <AdminUsers /> },
          { path: "admin/projects", element: <AdminProjects /> },
          { path: "admin/rewards", element: <AdminRewards /> },
          { path: "admin/settings", element: <AdminSettings /> },
        ],
      },

      // Rota Protegida com requisito de KYC
      {
        element: <ProtectedRoute requiresKyc />,
        children: [{ path: "kyc", element: <KYCPage /> }],
      },

      // Rotas Protegidas para VIPs
      {
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.INVESTOR_VIP, UserRole.INVESTOR_VERIFIED]}
          />
        ),
        children: [
          { path: "vip", element: <VipPage /> },
          { path: "vip/reports", element: <VipReportsPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
