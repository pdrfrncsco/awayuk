import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/homepage/Navigation';
import HeroSection from './components/homepage/HeroSection';
import FeaturesSection from './components/homepage/FeaturesSection';
import CommunitySection from './components/homepage/CommunitySection';
import TestimonialsSection from './components/homepage/TestimonialsSection';
import PricingSection from './components/homepage/PricingSection';
import ContactSection from './components/homepage/ContactSection';
import Footer from './components/homepage/Footer';
import CommunityExplorer from './components/CommunityExplorer';
import MemberProfile from './components/MemberProfile';

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
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comunidade" element={<CommunityExplorer />} />
          <Route path="/membro/:id" element={<MemberProfile />} />
          <Route path="/perfil/:id" element={<MemberProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
