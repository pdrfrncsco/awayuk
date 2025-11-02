import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OnboardingFlow from '../../components/onboarding/OnboardingFlow';

/**
 * Página de onboarding para novos membros
 * Esta página é acessada após o registro e login
 */
const Onboarding = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/onboarding' } });
    } else if (user?.profile?.onboardingCompleted) {
      // Se o onboarding já foi concluído, redirecionar para o dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OnboardingFlow />
      </div>
    </div>
  );
};

export default Onboarding;