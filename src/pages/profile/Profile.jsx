import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { profileService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import ProfileImageUpload from '../../components/profile/ProfileImageUpload';
import CoverImageUpload from '../../components/profile/CoverImageUpload';
import AboutTabEditor from '../../components/profile/AboutTabEditor';
import ServicesManager from '../../components/profile/ServicesManager';
import PortfolioManager from '../../components/profile/PortfolioManager';
import ProfileEditor from '../../components/profile/ProfileEditor';
import { useToast } from '../../components/common/Toast';

const MemberProfile = () => {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const { ToastContainer } = useToast();
  const navigate = useNavigate();
  
  // Se não há ID na URL e o usuário está autenticado, redirecionar para o próprio perfil
  useEffect(() => {
    // Esperar o estado de autenticação resolver antes de redirecionar
    if (!isLoading && !id && user?.id) {
      navigate(`/perfil/${user.id}`, { replace: true });
      return;
    }
  }, [id, user?.id, navigate, isLoading]);
  
  const memberId = id ? parseInt(id) : null;
  const [activeTab, setActiveTab] = useState('sobre');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  });

  // Estados para dados do backend
  const [profileData, setProfileData] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Verificar se é o próprio perfil do usuário (memoizado para evitar re-renders)
  const isOwnProfile = useMemo(() => {
    return user && user.id === memberId;
  }, [user?.id, memberId]);

  // Função para carregar dados do perfil (memoizada para evitar re-criações)
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se memberId é válido
      if (!memberId || isNaN(memberId)) {
        console.error('ID do membro inválido:', memberId);
        throw new Error('ID do membro inválido. Por favor, verifique o link.');
      }

      // Carregar perfil detalhado
      console.log('Carregando perfil para memberId:', memberId);
      // Se for o próprio perfil, usar o endpoint autenticado (/auth/profile/)
      const profileResponse = isOwnProfile
        ? await profileService.getUserProfile()
        : await profileService.getUserProfile(memberId);
      console.log('Resposta da API getUserProfile:', profileResponse);
      
      // Verificar se a resposta contém dados válidos
      if (!profileResponse || !profileResponse.id) {
        console.error('Resposta inválida da API:', profileResponse);
        throw new Error(`Perfil não encontrado para o usuário ID ${memberId}. O usuário pode não existir.`);
      }
      
      setProfileData(profileResponse);

      // Carregar testemunhos
      const testimonialsResponse = await profileService.getUserTestimonials(memberId);
      setTestimonials(testimonialsResponse || []);

      // Se for o próprio perfil, carregar serviços e portfólio editáveis
      if (isOwnProfile) {
        const [servicesResponse, portfolioResponse] = await Promise.all([
          profileService.getUserServices(),
          profileService.getUserPortfolio()
        ]);
        setServices(servicesResponse || []);
        setPortfolio(portfolioResponse || []);
      } else {
        // Para outros perfis, usar os dados do perfil detalhado
        setServices(profileResponse?.services || []);
        setPortfolio(profileResponse?.portfolio_items || []);
      }

    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      
      // Tratamento específico para diferentes tipos de erro
      if (err.message && err.message.includes('404')) {
        setError(`Perfil não encontrado. O usuário com ID ${memberId} não existe.`);
      } else if (err.message && err.message.includes('Network Error')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (err.message && err.message.includes('ID do membro inválido')) {
        setError(err.message);
      } else {
        setError('Erro ao carregar dados do perfil. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [memberId, isOwnProfile]);

  // useEffect para chamar a função de carregamento
  useEffect(() => {
    // Evitar chamada inicial incorreta enquanto Auth ainda está a carregar.
    // Se o utilizador não está autenticado (isLoading === false e user === null), pode carregar por ID.
    if (!memberId) return;
    if (isLoading) return;
    loadProfileData();
  }, [memberId, loadProfileData, isLoading]);

  // Função para salvar as informações da aba "Sobre"
  const handleSaveAbout = async (formData) => {
    try {
      // Aqui você faria a chamada para a API para salvar os dados
      // const updatedProfile = await profileService.updateProfile(memberId, formData);
      
      // Por enquanto, vamos atualizar o estado local
      setProfileData(prev => ({
        ...prev,
        bio: formData.description,
        qualifications: formData.qualifications,
        languages: formData.languages,
        email: formData.email,
        phone: formData.phone,
        website: formData.website
      }));
      
      setIsEditingAbout(false);
      
      // Mostrar feedback de sucesso
      console.log('Informações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar informações:', error);
      throw error;
    }
  };

  // Função para cancelar a edição
  const handleCancelAbout = () => {
    setIsEditingAbout(false);
  };

  // Função para salvar os serviços
  const handleSaveServices = async (servicesData) => {
    try {
      // Aqui você faria a chamada para a API para salvar os serviços
      // const updatedServices = await profileService.updateServices(memberId, servicesData);
      
      // Por enquanto, vamos atualizar o estado local
      setServices(servicesData);
      setIsEditingServices(false);
      
      // Mostrar feedback de sucesso
      console.log('Serviços salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar serviços:', error);
      throw error;
    }
  };

  // Função para cancelar a edição dos serviços
  const handleCancelServices = () => {
    setIsEditingServices(false);
  };

  // Função para salvar o portfólio
  const handleSavePortfolio = async (portfolioData) => {
    try {
      // Aqui você faria a chamada para a API para salvar os dados
      // const updatedPortfolio = await profileService.updatePortfolio(memberId, portfolioData);
      
      // Por enquanto, vamos atualizar o estado local
      setPortfolio(portfolioData);
      setIsEditingPortfolio(false);
      
      // Mostrar feedback de sucesso
      console.log('Portfólio salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar portfólio:', error);
      throw error;
    }
  };

  // Função para cancelar a edição do portfólio
  const handleCancelPortfolio = () => {
    setIsEditingPortfolio(false);
  };

  // Função para salvar as informações básicas do perfil
  const handleSaveProfile = async (profileFormData) => {
    try {
      console.log('Dados a serem salvos:', profileFormData);
      
      // Fazer a chamada para a API para salvar os dados
      const updatedProfile = await profileService.updateProfile(profileFormData);
      
      console.log('Resposta da API:', updatedProfile);
      
      // Atualizar o estado local com os dados retornados da API
      setProfileData(prev => ({
        ...prev,
        first_name: profileFormData.first_name,
        last_name: profileFormData.last_name,
        profession: profileFormData.profession,
        location: profileFormData.location,
        category: profileFormData.category
      }));
      
      setIsEditingProfile(false);
      
      // Mostrar feedback de sucesso
      console.log('Perfil salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error;
    }
  };

  // Função para cancelar a edição do perfil
  const handleCancelProfile = () => {
    setIsEditingProfile(false);
  };

  // Dados do membro baseados no backend ou fallback para mock
  const member = profileData ? {
    id: profileData.id,
    name: profileData.full_name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Nome não informado',
    profession: profileData.profession || 'Profissional',
    location: profileData.location || 'Localização não informada',
    category: profileData.category || 'Geral',
    avatar: profileData.profile_image || "https://picsum.photos/150/150?random=10",
    coverImage: profileData.cover_image || "https://picsum.photos/1200/400?random=20",
    rating: profileData.rating || 0,
    reviewCount: profileData.review_count || 0,
    verified: profileData.is_verified || false,
    memberSince: profileData.member_since ? new Date(profileData.member_since).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Janeiro 2022',
    responseTime: profileData.response_time || 'Dentro de 2 horas',
    completedProjects: profileData.completed_projects || 0,
    description: profileData.bio || 'Biografia não informada',
    phone: profileData.phone || '',
    email: profileData.email || '',
    website: profileData.website || '',
    socialMedia: profileData.social_media || {},
    services: services,
    portfolio: portfolio,
    testimonials: testimonials,
    qualifications: profileData.qualifications || [],
    languages: profileData.languages || []
  } : {
    id: 1,
    name: "Ana Kiala",
    profession: "Designer de Interiores",
    location: "Londres",
    category: "Design & Criatividade",
    avatar: "https://picsum.photos/150/150?random=10",
    coverImage: "https://picsum.photos/1200/400?random=20",
    rating: 4.8,
    reviewCount: 23,
    verified: true,
    memberSince: "Janeiro 2022",
    responseTime: "Dentro de 2 horas",
    completedProjects: 45,
    description: "Designer de interiores apaixonada por criar espaços únicos e funcionais. Com mais de 8 anos de experiência, especializo-me em design residencial contemporâneo e consultoria de decoração. Acredito que cada espaço deve refletir a personalidade dos seus habitantes.",
    phone: "+44 20 1234 5678",
    email: "ana.kiala@example.com",
    website: "www.anakiladesign.co.uk",
    socialMedia: {
      instagram: "@anakiladesign",
      linkedin: "ana-kiala-design",
      facebook: "Ana Kiala Design"
    },
    services: [
      {
        id: 1,
        name: "Design Residencial Completo",
        description: "Projeto completo de design de interiores para residências, incluindo conceito, plantas, especificações e acompanhamento.",
        price: "A partir de £2,500",
        duration: "4-8 semanas",
        image: "https://picsum.photos/300/200?random=30"
      },
      {
        id: 2,
        name: "Consultoria de Decoração",
        description: "Sessão de consultoria para orientação sobre cores, móveis, layout e decoração de ambientes específicos.",
        price: "£150/hora",
        duration: "1-2 horas",
        image: "https://picsum.photos/300/200?random=31"
      },
      {
        id: 3,
        name: "Projeto de Cozinha",
        description: "Design especializado para cozinhas, incluindo layout funcional, escolha de materiais e especificações técnicas.",
        price: "A partir de £1,800",
        duration: "3-5 semanas",
        image: "https://picsum.photos/300/200?random=32"
      }
    ],
    portfolio: [
      {
        id: 1,
        title: "Apartamento Moderno em Canary Wharf",
        description: "Transformação completa de apartamento de 2 quartos com conceito minimalista e toques africanos.",
        image: "https://picsum.photos/400/300?random=40",
        category: "Residencial"
      },
      {
        id: 2,
        title: "Casa Vitoriana em Hampstead",
        description: "Renovação respeitosa de casa histórica combinando elementos clássicos com design contemporâneo.",
        image: "https://picsum.photos/400/300?random=41",
        category: "Residencial"
      },
      {
        id: 3,
        title: "Escritório Criativo em Shoreditch",
        description: "Design de espaço de trabalho colaborativo para startup de tecnologia.",
        image: "https://picsum.photos/400/300?random=42",
        category: "Comercial"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Carlos Mendes",
        rating: 5,
        comment: "Ana transformou completamente nossa casa. O resultado superou todas as expectativas. Profissional excepcional!",
        date: "Dezembro 2023",
        project: "Design Residencial Completo"
      },
      {
        id: 2,
        name: "Sofia Rodrigues",
        rating: 5,
        comment: "Consultoria excelente! Ana tem um olhar único e conseguiu resolver todos os nossos problemas de layout.",
        date: "Novembro 2023",
        project: "Consultoria de Decoração"
      },
      {
        id: 3,
        name: "Miguel Santos",
        rating: 4,
        comment: "Muito satisfeito com o projeto da cozinha. Ana é criativa e atenta aos detalhes.",
        date: "Outubro 2023",
        project: "Projeto de Cozinha"
      }
    ],
    qualifications: [
      "Bacharelado em Design de Interiores - University of Arts London",
      "Certificação BIID (British Institute of Interior Design)",
      "Especialização em Design Sustentável",
      "Curso de AutoCAD e SketchUp Avançado"
    ],
    languages: ["Português", "Inglês", "Francês"]
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-300"></i>);
    }

    return stars;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar formulário de contato para a API
      const contactData = {
        ...contactForm,
        recipient_id: memberId
      };
      
      // Aqui você pode adicionar uma chamada para um serviço de contato/mensagens
      // await contactService.sendMessage(contactData);
      
      console.log('Formulário de contato enviado:', contactData);
      setShowContactModal(false);
      setContactForm({ name: '', email: '', phone: '', message: '', service: '' });
      alert('Mensagem enviada com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contactar {member.name}
            </h3>
            <button
              onClick={() => setShowContactModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviço de Interesse
              </label>
              <select
                value={contactForm.service}
                onChange={(e) => setContactForm({...contactForm, service: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Selecione um serviço</option>
                {member && member.services && member.services.map(service => (
                  <option key={service.id} value={service.name}>{service.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem *
              </label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Descreva o seu projeto ou necessidade..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Se não há ID e o usuário está autenticado, não renderizar (redirecionando)
  if (!id && user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para o seu perfil...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Erro ao carregar perfil</p>
            <p className="text-sm">{error}</p>
          </div>
          <Link 
            to="/comunidade"
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar à Comunidade
          </Link>
        </div>
      </div>
    );
  }

  // Verificar se member existe
  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/comunidade"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar à Comunidade
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        {isOwnProfile ? (
          <CoverImageUpload
            currentImage={member.coverImage}
            onImageUpdate={(newImage) => {
              setProfileData(prev => ({
                ...prev,
                cover_image: newImage || prev?.cover_image
              }));
            }}
            height="h-64 md:h-80"
          />
        ) : (
          <>
            <img 
              src={member.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              {isOwnProfile ? (
              <ProfileImageUpload
                currentImage={member.avatar}
                onImageUpdate={(newImage) => {
                  setProfileData(prev => ({
                    ...prev,
                    profile_image: newImage || prev?.profile_image
                  }));
                }}
                size="large"
              />
              ) : (
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
                />
              )}
              {member.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <i className="fas fa-check text-sm"></i>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditingProfile && isOwnProfile ? (
                <ProfileEditor
                  initialData={{
                    first_name: profileData?.first_name || '',
                    last_name: profileData?.last_name || '',
                    profession: profileData?.profession || '',
                    location: profileData?.location || '',
                    category: profileData?.category || ''
                  }}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelProfile}
                />
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                      {member.name}
                      {member.verified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verificado
                        </span>
                      )}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">{member.profession}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span>
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {member.location}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt mr-1"></i>
                        Membro desde {member.memberSince}
                      </span>
                    </div>
                  </div>
                
                  <div className="flex flex-col md:items-end mt-4 md:mt-0">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(member.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({member.reviewCount} avaliações)</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      Responde {member.responseTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-check-circle mr-1"></i>
                      {member.completedProjects} projetos concluídos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>
                Editar Perfil
              </button>
            ) : (
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contactar
              </button>
            )}
            <a
              href={`tel:${member.phone}`}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Ligar
            </a>
            <a
              href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp
            </a>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
              <i className="fas fa-share-alt mr-2"></i>
              Partilhar
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'sobre', label: 'Sobre', icon: 'fas fa-user' },
                { id: 'servicos', label: 'Serviços', icon: 'fas fa-briefcase' },
                { id: 'portfolio', label: 'Portfolio', icon: 'fas fa-images' },
                { id: 'avaliacoes', label: 'Avaliações', icon: 'fas fa-star' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'sobre' && (
              <div className="space-y-6">
                {isEditingAbout ? (
                  <AboutTabEditor
                    profileData={{
                      description: member.description,
                      qualifications: member.qualifications,
                      languages: member.languages,
                      email: member.email,
                      phone: member.phone,
                      website: member.website
                    }}
                    onSave={handleSaveAbout}
                    onCancel={handleCancelAbout}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Sobre Mim</h3>
                      {isOwnProfile && (
                        <button
                          onClick={() => setIsEditingAbout(true)}
                          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Editar
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-700 leading-relaxed">{member.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Qualificações</h4>
                        <ul className="space-y-2">
                          {member.qualifications && member.qualifications.map((qual, index) => (
                            <li key={index} className="flex items-start">
                              <i className="fas fa-graduation-cap text-red-500 mt-1 mr-2"></i>
                              <span className="text-gray-700">{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Idiomas</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.languages && member.languages.map((lang, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-3 mt-6">Contactos</h4>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <i className="fas fa-envelope mr-2 text-gray-500"></i>
                            {member.email}
                          </p>
                          <p className="text-gray-700">
                            <i className="fas fa-phone mr-2 text-gray-500"></i>
                            {member.phone}
                          </p>
                          {member.website && (
                            <p className="text-gray-700">
                              <i className="fas fa-globe mr-2 text-gray-500"></i>
                              <a href={`https://${member.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {member.website}
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-3 mt-6">Redes Sociais</h4>
                        <div className="flex space-x-3">
                          <a href="#" className="text-pink-600 hover:text-pink-800">
                            <i className="fab fa-instagram text-xl"></i>
                          </a>
                          <a href="#" className="text-blue-600 hover:text-blue-800">
                            <i className="fab fa-linkedin text-xl"></i>
                          </a>
                          <a href="#" className="text-blue-700 hover:text-blue-900">
                            <i className="fab fa-facebook text-xl"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'servicos' && (
              <div>
                {isEditingServices ? (
                  <ServicesManager
                    services={services}
                    onSave={handleSaveServices}
                    onCancel={handleCancelServices}
                    isOwnProfile={isOwnProfile}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Serviços</h3>
                      {isOwnProfile && (
                        <button
                          onClick={() => setIsEditingServices(true)}
                          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Gerenciar Serviços
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {member && member.services && member.services.map(service => (
                        <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <img 
                            src={service.image} 
                            alt={service.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-red-600">{service.price}</span>
                              <span className="text-sm text-gray-500">
                                <i className="fas fa-clock mr-1"></i>
                                {service.duration}
                              </span>
                            </div>
                            {!isOwnProfile && (
                              <button
                                onClick={() => {
                                  setContactForm({...contactForm, service: service.name});
                                  setShowContactModal(true);
                                }}
                                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity"
                              >
                                Solicitar Orçamento
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {(!member.services || member.services.length === 0) && (
                      <div className="text-center py-12">
                        <i className="fas fa-briefcase text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">
                          {isOwnProfile ? 'Nenhum serviço adicionado ainda.' : 'Nenhum serviço disponível.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                {isEditingPortfolio ? (
                  <PortfolioManager
                    portfolio={portfolio}
                    onSave={handleSavePortfolio}
                    onCancel={handleCancelPortfolio}
                    isOwnProfile={isOwnProfile}
                  />
                ) : (
                  <div>
                    {isOwnProfile && (
                      <div className="mb-6 flex justify-end">
                        <button
                          onClick={() => setIsEditingPortfolio(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Gerenciar Portfólio
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolio && portfolio.map(project => (
                        <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={project.image || `https://picsum.photos/400/300?random=${project.id}`} 
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {project.category}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                            
                            {project.client && (
                              <p className="text-xs text-gray-500 mb-1">
                                <i className="fas fa-user mr-1"></i>
                                Cliente: {project.client}
                              </p>
                            )}
                            
                            {project.completedDate && (
                              <p className="text-xs text-gray-500">
                                <i className="fas fa-calendar mr-1"></i>
                                Concluído em: {new Date(project.completedDate).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {(!portfolio || portfolio.length === 0) && (
                      <div className="text-center py-12">
                        <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">
                          {isOwnProfile ? 'Nenhum projeto adicionado ainda.' : 'Nenhum projeto disponível.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{member.rating}</div>
                    <div className="flex justify-center mb-2">
                      {renderStars(member.rating)}
                    </div>
                    <p className="text-gray-600">{member.reviewCount} avaliações</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {member.testimonials && member.testimonials.map(testimonial => (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                          <p className="text-sm text-gray-500">{testimonial.project} • {testimonial.date}</p>
                        </div>
                        <div className="flex">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">{testimonial.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && <ContactModal />}
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default MemberProfile;