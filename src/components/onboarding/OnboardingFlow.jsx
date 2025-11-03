import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente que gerencia o fluxo de onboarding para novos membros
 * Guia o usuário através de etapas para completar seu perfil
 */
const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    interests: [],
    skills: [],
    bio: '',
    location: '',
    profileImage: null,
    contactPreferences: {
      email: true,
      notifications: true
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Definição das etapas do onboarding
  const steps = [
    {
      title: 'Bem-vindo à comunidade',
      description: 'Vamos configurar o seu perfil para que possa aproveitar ao máximo a plataforma'
    },
    {
      title: 'Seus interesses',
      description: 'Selecione áreas que são do seu interesse'
    },
    {
      title: 'Suas competências',
      description: 'Conte-nos sobre suas habilidades e experiências'
    },
    {
      title: 'Sobre você',
      description: 'Adicione uma breve biografia e sua localização'
    },
    {
      title: 'Foto de perfil',
      description: 'Adicione uma foto para personalizar seu perfil'
    },
    {
      title: 'Preferências de contacto',
      description: 'Configure como deseja receber notificações'
    },
    {
      title: 'Concluído!',
      description: 'Seu perfil está pronto para uso'
    }
  ];

  // Lista de interesses disponíveis
  const availableInterests = [
    'Cultura', 'Negócios', 'Tecnologia', 'Educação', 
    'Saúde', 'Esportes', 'Arte', 'Música', 'Gastronomia'
  ];

  // Lista de competências disponíveis
  const availableSkills = [
    'Marketing', 'Programação', 'Design', 'Vendas', 
    'Gestão', 'Ensino', 'Escrita', 'Fotografia', 'Culinária'
  ];

  // Manipulador para alterações nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('interest-')) {
        const interest = name.replace('interest-', '');
        setFormData(prev => {
          const newInterests = checked 
            ? [...prev.interests, interest]
            : prev.interests.filter(i => i !== interest);
          
          return { ...prev, interests: newInterests };
        });
      } else if (name.startsWith('skill-')) {
        const skill = name.replace('skill-', '');
        setFormData(prev => {
          const newSkills = checked 
            ? [...prev.skills, skill]
            : prev.skills.filter(s => s !== skill);
          
          return { ...prev, skills: newSkills };
        });
      } else if (name.startsWith('contact-')) {
        const preference = name.replace('contact-', '');
        setFormData(prev => ({
          ...prev,
          contactPreferences: {
            ...prev.contactPreferences,
            [preference]: checked
          }
        }));
      }
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        profileImage: e.target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manipulador para avançar para a próxima etapa
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Manipulador para voltar para a etapa anterior
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Manipulador para enviar os dados do formulário
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Aqui seria feita a chamada à API para salvar os dados
      // Por enquanto, apenas simulamos uma atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar o usuário no contexto de autenticação
      updateUser({
        ...user,
        role: 'member',
        onboarding_completed: true,
        profile: {
          ...user.profile,
          ...formData
        }
      });
      
      // Avançar para a etapa final
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error('Erro ao salvar dados de onboarding:', error);
      // Aqui poderia ser mostrada uma mensagem de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipulador para finalizar o onboarding
  const handleFinish = () => {
    navigate('/dashboard');
  };

  // Renderização do conteúdo baseado na etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Boas-vindas
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Olá, {user?.name || 'novo membro'}!
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos felizes por se juntar à nossa comunidade. Vamos configurar seu perfil para que possa aproveitar ao máximo a plataforma.
            </p>
          </div>
        );
      
      case 1: // Interesses
        return (
          <div>
            <p className="text-gray-600 mb-4">
              Selecione áreas que são do seu interesse para personalizarmos sua experiência:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableInterests.map(interest => (
                <label key={interest} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name={`interest-${interest}`}
                    checked={formData.interests.includes(interest)}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-500 focus:ring-red-400"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 2: // Competências
        return (
          <div>
            <p className="text-gray-600 mb-4">
              Selecione suas principais competências:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSkills.map(skill => (
                <label key={skill} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name={`skill-${skill}`}
                    checked={formData.skills.includes(skill)}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-500 focus:ring-red-400"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 3: // Bio e localização
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Londres, Reino Unido"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        );
      
      case 4: // Foto de perfil
        return (
          <div className="text-center">
            <div className="mb-6">
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Preview"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-red-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer">
              Escolher foto
              <input
                type="file"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
                className="sr-only"
              />
            </label>
          </div>
        );
      
      case 5: // Preferências de contacto
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Configure como deseja receber informações:
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="contact-email"
                  checked={formData.contactPreferences.email}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span>Receber atualizações por email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="contact-notifications"
                  checked={formData.contactPreferences.notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span>Receber notificações na plataforma</span>
              </label>
            </div>
          </div>
        );
      
      case 6: // Concluído
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Parabéns!
            </h3>
            <p className="text-gray-600 mb-6">
              Seu perfil está completo e você agora é um membro da comunidade. Aproveite todas as funcionalidades disponíveis!
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-600 mt-1">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Indicador de progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-full h-1 ${
                index < currentStep 
                  ? 'bg-red-500' 
                  : index === currentStep 
                    ? 'bg-red-300' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Início</span>
          <span>Concluído</span>
        </div>
      </div>

      {/* Conteúdo da etapa atual */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Botões de navegação */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
            currentStep === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Voltar
        </button>
        
        {currentStep < steps.length - 2 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-600"
          >
            Próximo
          </button>
        ) : currentStep === steps.length - 2 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-600 disabled:bg-red-300"
          >
            {isSubmitting ? 'Salvando...' : 'Concluir'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-600"
          >
            Ir para o Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;