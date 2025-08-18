import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PermissionsProvider, usePermissions } from './contexts/PermissionsContext';
import { RouteGuard } from './components/dashboard/PermissionGuard';
import Navigation from './components/homepage/Navigation';
import HeroSection from './components/homepage/HeroSection';
import FeaturesSection from './components/homepage/FeaturesSection';
import CommunitySection from './components/homepage/CommunitySection';
import TestimonialsSection from './components/homepage/TestimonialsSection';
import PricingSection from './components/homepage/PricingSection';
import ContactSection from './components/homepage/ContactSection';
import Footer from './components/homepage/Footer';
import CommunityExplorer from './pages/public/CommunityExplorer';
import MemberProfile from './pages/public/MemberProfile';
import EventsExplorer from './pages/public/EventsExplorer';
import EventDetails from './pages/public/EventDetails';
import BusinessOpportunities from './pages/public/BusinessOpportunities';
import OpportunityDetails from './pages/public/OpportunityDetails';
import AboutUs from './pages/public/AboutUs';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import {
  DashboardLayout,
  Dashboard,
  MembersManagement,
  EventsManagement,
  OpportunitiesManagement,
  ContentManagement,
  StatisticsManagement
} from './components/dashboard';
import { PERMISSIONS } from './contexts/PermissionsContext';

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

// Componente de proteção de rotas
const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

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
    <AuthProvider>
      <PermissionsProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/comunidade" element={<PublicLayout><CommunityExplorer /></PublicLayout>} />
            <Route path="/eventos" element={<PublicLayout><EventsExplorer /></PublicLayout>} />
            <Route path="/evento/:id" element={<PublicLayout><EventDetails /></PublicLayout>} />
            <Route path="/oportunidades" element={<PublicLayout><BusinessOpportunities /></PublicLayout>} />
            <Route path="/oportunidade/:id" element={<PublicLayout><OpportunityDetails /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><AboutUs /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/registo" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/membro/:id" element={<PublicLayout><MemberProfile /></PublicLayout>} />
            <Route path="/perfil/:id" element={<PublicLayout><MemberProfile /></PublicLayout>} />
            
            {/* Rotas do Dashboard (Protegidas) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
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
            </Route>
            
            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
