import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { I18nProvider } from './contexts/I18nContext';
import { RouteGuard } from './components/dashboard/PermissionGuard';
import ProtectedRoute, { GuestRoute, VerifiedRoute } from './components/auth/ProtectedRoute';
import { BusinessRoute, MemberRoute, AdminRoute, MultiTypeRoute } from './components/guards/UserTypeGuard';
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
import EventDetail from './pages/public/EventDetail';
// Consolidated events to public pages; removed EventDetails, EventList, and admin EventDetail
import CreateEvent from './pages/events/CreateEvent';
import DashboardCreateEvent from './pages/events/DashboardCreateEvent';
import DashboardEditEvent from './pages/events/DashboardEditEvent';
import OnboardingPage from './pages/onboarding/Onboarding';
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
  // StatisticsManagement,
  RolesManagement,
  Onboarding,
  OnboardingAdmin
} from './components/dashboard';
import { TestimonialsModeration } from './components/dashboard';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import CommunityPage from './pages/dashboard/CommunityPage';
import ConnectionsPage from './pages/dashboard/ConnectionsPage';
import { PERMISSIONS } from './contexts/PermissionsContext';
import { ToastNotifications } from './components/notifications';
import { useAuth } from './contexts/AuthContext';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from './contexts/NotificationsContext';
import TestAPI from './pages/TestAPI';

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
          <SessionExpiredHandler />
          <div className="min-h-screen bg-white">
            <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/comunidade" element={<PublicLayout><CommunityExplorer /></PublicLayout>} />
            <Route path="/eventos" element={<PublicLayout><EventsExplorer /></PublicLayout>} />
            <Route path="/evento/:slug" element={<PublicLayout><EventDetail /></PublicLayout>} />
        <Route path="/onboarding" element={<PublicLayout><OnboardingPage /></PublicLayout>} />
        { /* Removed admin event detail route using slug to avoid duplication */ }
<Route path="/criar-evento" element={
              <MultiTypeRoute allowedTypes={['member', 'admin']} redirectTo="/dashboard">
                <PublicLayout><CreateEvent /></PublicLayout>
              </MultiTypeRoute>
            } />
            { /* Removed duplicate event details route; using EventDetail instead */ }
            <Route path="/oportunidades" element={<PublicLayout><BusinessOpportunities /></PublicLayout>} />
            <Route path="/criar-oportunidade" element={
              <MultiTypeRoute allowedTypes={['business', 'admin']} redirectTo="/dashboard">
                <PublicLayout><CreateOpportunity /></PublicLayout>
              </MultiTypeRoute>
            } />
            <Route path="/oportunidade/:id" element={<PublicLayout><OpportunityDetails /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><AboutUs /></PublicLayout>} />
            <Route path="/test-api" element={<PublicLayout><TestAPI /></PublicLayout>} />
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
                <AdminRoute>
                  <RouteGuard permission={PERMISSIONS.VIEW_MEMBERS}>
                    <MembersManagement />
                  </RouteGuard>
                </AdminRoute>
              } />
              <Route path="eventos" element={
                <MultiTypeRoute allowedTypes={['member', 'admin']}>
                  <RouteGuard permission={PERMISSIONS.VIEW_EVENTS}>
                    <EventsManagement />
                  </RouteGuard>
                </MultiTypeRoute>
              } />
              <Route path="oportunidades" element={
                <MultiTypeRoute allowedTypes={['business', 'admin']}>
                  <RouteGuard permission={PERMISSIONS.VIEW_OPPORTUNITIES}>
                    <OpportunitiesManagement />
                  </RouteGuard>
                </MultiTypeRoute>
              } />
              <Route path="oportunidades/nova" element={
                <MultiTypeRoute allowedTypes={['business', 'admin']}>
                  <RouteGuard permission={PERMISSIONS.CREATE_OPPORTUNITY}>
                    <CreateOpportunity />
                  </RouteGuard>
                </MultiTypeRoute>
              } />
              <Route path="eventos/novo" element={
                <MultiTypeRoute allowedTypes={['member', 'admin']}>
                  <RouteGuard permission={PERMISSIONS.CREATE_EVENT}>
                    <DashboardCreateEvent />
                  </RouteGuard>
                </MultiTypeRoute>
              } />
              <Route path="eventos/:id/editar" element={
                <MultiTypeRoute allowedTypes={['member', 'admin']}>
                  <RouteGuard permission={PERMISSIONS.EDIT_EVENT}>
                    <DashboardEditEvent />
                  </RouteGuard>
                </MultiTypeRoute>
              } />
              <Route path="conteudos" element={
                <RouteGuard permission={PERMISSIONS.VIEW_CONTENT}>
                  <ContentManagement />
                </RouteGuard>
              } />
              <Route path="onboarding" element={
                <RouteGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
                  <Onboarding />
                </RouteGuard>
              } />
              <Route path="onboarding-admin" element={
                <AdminRoute>
                  <RouteGuard permission={PERMISSIONS.MANAGE_APPLICATIONS}>
                    <OnboardingAdmin />
                  </RouteGuard>
                </AdminRoute>
              } />
              <Route path="testemunhos" element={
                <RouteGuard permission={PERMISSIONS.EDIT_CONTENT}>
                  <TestimonialsModeration />
                </RouteGuard>
              } />
              <Route path="estatisticas" element={
                <RouteGuard permission={PERMISSIONS.VIEW_STATISTICS}>
                  <div>Estatísticas - Em manutenção</div>
                </RouteGuard>
              } />
              <Route path="roles" element={
                <AdminRoute>
                  <RouteGuard permission={PERMISSIONS.MANAGE_USERS}>
                    <RolesManagement />
                  </RouteGuard>
                </AdminRoute>
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

// Handler para sessão expirada: mostra toast e redireciona para login
const SessionExpiredHandler = () => {
  const { sessionExpired, isAuthenticated } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const shownRef = useRef(false);

  useEffect(() => {
    if (sessionExpired && !isAuthenticated && !shownRef.current) {
      shownRef.current = true;
      try {
        showToast({
          title: 'Sessão expirada',
          message: 'Por favor, faça login novamente.',
          category: NOTIFICATION_CATEGORIES.SYSTEM,
          type: NOTIFICATION_TYPES.ERROR
        });
      } catch {}
      navigate('/login', { replace: true });
      setTimeout(() => { shownRef.current = false; }, 5000);
    }
  }, [sessionExpired, isAuthenticated, showToast, navigate]);

  return null;
};

export default App;
