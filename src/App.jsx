import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { I18nProvider } from './contexts/I18nContext';
import { RouteGuard } from './components/dashboard/PermissionGuard';
import ProtectedRoute, { GuestRoute, VerifiedRoute } from './components/auth/ProtectedRoute';
import { PageLoader } from './components/common/LoadingSpinner';
import Navigation from './components/homepage/Navigation';
import HeroSection from './components/homepage/HeroSection';
import FeaturesSection from './components/homepage/FeaturesSection';
import CommunitySection from './components/homepage/CommunitySection';
import TestimonialsSection from './components/homepage/TestimonialsSection';
import PricingSection from './components/homepage/PricingSection';
import ContactSection from './components/homepage/ContactSection';
import Footer from './components/homepage/Footer';
import CommunityExplorer from './pages/public/CommunityExplorer';
import EventsExplorer from './pages/public/EventsExplorer';
import EventDetails from './pages/public/EventDetails';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import CreateEvent from './pages/events/CreateEvent';
import OpportunityList from './pages/opportunities/OpportunityList';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import CreateOpportunity from './pages/opportunities/CreateOpportunity';
import BusinessOpportunities from './pages/public/BusinessOpportunities';
import OpportunityDetails from './pages/public/OpportunityDetails';
import AboutUs from './pages/public/AboutUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Unauthorized from './pages/auth/Unauthorized';
import Profile from './pages/profile/Profile';
import {
  DashboardLayout,
  Dashboard,
  MembersManagement,
  EventsManagement,
  OpportunitiesManagement,
  ContentManagement,
  StatisticsManagement,
  RolesManagement
} from './components/dashboard';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import CommunityPage from './pages/dashboard/CommunityPage';
import ConnectionsPage from './pages/dashboard/ConnectionsPage';
import { PERMISSIONS } from './contexts/PermissionsContext';
import { ToastNotifications } from './components/notifications';

// Componente da página inicial
const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <CommunitySection />
    <TestimonialsSection />
    <PricingSection />
    <ContactSection />
  </>
);

// Componente para páginas que requerem email verificado
const VerifiedDashboardRoute = ({ children }) => (
  <VerifiedRoute fallback={<PageLoader message="A verificar autenticação..." />}>
    {children}
  </VerifiedRoute>
);

// Componente de layout público
const PublicLayout = ({ children }) => (
  <>
    <Navigation />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <PermissionsProvider>
          <NotificationsProvider>
          <CommunityProvider>
            <Router>
          <div className="min-h-screen bg-white">
            <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/comunidade" element={<PublicLayout><CommunityExplorer /></PublicLayout>} />
            <Route path="/eventos" element={<PublicLayout><EventList /></PublicLayout>} />
            <Route path="/eventos/:slug" element={<PublicLayout><EventDetail /></PublicLayout>} />
            <Route path="/criar-evento" element={
              <ProtectedRoute fallback={<PageLoader />}>
                <PublicLayout><CreateEvent /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/evento/:id" element={<PublicLayout><EventDetails /></PublicLayout>} />
            <Route path="/oportunidades" element={<PublicLayout><OpportunityList /></PublicLayout>} />
            <Route path="/oportunidades/:slug" element={<PublicLayout><OpportunityDetail /></PublicLayout>} />
            <Route path="/criar-oportunidade" element={
              <ProtectedRoute fallback={<PageLoader />}>
                <PublicLayout><CreateOpportunity /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/oportunidade/:id" element={<PublicLayout><OpportunityDetails /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><AboutUs /></PublicLayout>} />
            <Route path="/login" element={
              <GuestRoute>
                <PublicLayout><Login /></PublicLayout>
              </GuestRoute>
            } />
            <Route path="/registo" element={
              <GuestRoute>
                <PublicLayout><Register /></PublicLayout>
              </GuestRoute>
            } />
            <Route path="/verificar-email" element={
              <ProtectedRoute fallback={<PageLoader />}>
                <VerifyEmail />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute fallback={<PageLoader />}>
                <PublicLayout><Profile /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/nao-autorizado" element={<Unauthorized />} />
            <Route path="/membro/:id" element={<PublicLayout><Profile /></PublicLayout>} />
            <Route path="/perfil/:id" element={<PublicLayout><Profile /></PublicLayout>} />
            
            {/* Rotas do Dashboard (Protegidas) */}
            <Route path="/dashboard" element={
              <VerifiedDashboardRoute>
                <DashboardLayout />
              </VerifiedDashboardRoute>
            }>
              <Route index element={
                <RouteGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
                  <Dashboard />
                </RouteGuard>
              } />
              <Route path="membros" element={
                <RouteGuard permission={PERMISSIONS.VIEW_MEMBERS}>
                  <MembersManagement />
                </RouteGuard>
              } />
              <Route path="eventos" element={
                <RouteGuard permission={PERMISSIONS.VIEW_EVENTS}>
                  <EventsManagement />
                </RouteGuard>
              } />
              <Route path="oportunidades" element={
                <RouteGuard permission={PERMISSIONS.VIEW_OPPORTUNITIES}>
                  <OpportunitiesManagement />
                </RouteGuard>
              } />
              <Route path="conteudos" element={
                <RouteGuard permission={PERMISSIONS.VIEW_CONTENT}>
                  <ContentManagement />
                </RouteGuard>
              } />
              <Route path="estatisticas" element={
                <RouteGuard permission={PERMISSIONS.VIEW_STATISTICS}>
                  <StatisticsManagement />
                </RouteGuard>
              } />
              <Route path="roles" element={
                <RouteGuard permission={PERMISSIONS.MANAGE_USERS}>
                  <RolesManagement />
                </RouteGuard>
              } />
              <Route path="notificacoes" element={
                <RouteGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
                  <NotificationsPage />
                </RouteGuard>
              } />
              <Route path="comunidade" element={
                <RouteGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
                  <CommunityPage />
                </RouteGuard>
              } />
              <Route path="conexoes" element={
                <RouteGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
                  <ConnectionsPage />
                </RouteGuard>
              } />
            </Route>
            
            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
            <ToastNotifications />
              </Router>
            </CommunityProvider>
          </NotificationsProvider>
        </PermissionsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
