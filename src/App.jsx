import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/comunidade" element={<CommunityExplorer />} />
            <Route path="/eventos" element={<EventsExplorer />} />
            <Route path="/evento/:id" element={<EventDetails />} />
            <Route path="/oportunidades" element={<BusinessOpportunities />} />
            <Route path="/oportunidade/:id" element={<OpportunityDetails />} />
            <Route path="/sobre" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registo" element={<Register />} />
            <Route path="/membro/:id" element={<MemberProfile />} />
            <Route path="/perfil/:id" element={<MemberProfile />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
