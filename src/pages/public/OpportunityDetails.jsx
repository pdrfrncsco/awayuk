import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  MapPinIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShareIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import VisitorAction from '../../components/auth/VisitorAction';

const OpportunityDetails = () => {
  const { id } = useParams();
  const opportunityId = parseInt(id) || 1;
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Mock data para oportunidades (mesmo do BusinessOpportunities)
  const opportunities = [
    {
      id: 1,
      title: 'Desenvolvedor Full Stack',
      type: 'emprego',
      company: 'TechAngola UK',
      location: 'Londres',
      area: 'tecnologia',
      level: 'senior',
      salary: '£45,000 - £65,000',
      workType: 'Híbrido',
      description: 'Procuramos um desenvolvedor experiente para integrar nossa equipe em Londres. Experiência com React, Node.js e bases de dados.',
      fullDescription: 'Estamos à procura de um Desenvolvedor Full Stack talentoso para se juntar à nossa equipe dinâmica em Londres. Esta é uma excelente oportunidade para trabalhar com tecnologias modernas e contribuir para projetos inovadores que servem a comunidade angolana no Reino Unido.\n\nComo parte da nossa equipe, você será responsável por desenvolver e manter aplicações web robustas, trabalhar em estreita colaboração com designers e outros desenvolvedores, e contribuir para a arquitetura técnica dos nossos produtos.',
      requirements: ['3+ anos de experiência em desenvolvimento web', 'Proficiência em React e Node.js', 'Experiência com bases de dados SQL e NoSQL', 'Inglês fluente', 'Português nativo (preferencial)'],
      responsibilities: [
        'Desenvolver e manter aplicações web usando React e Node.js',
        'Colaborar com a equipe de design para implementar interfaces de utilizador',
        'Escrever código limpo, testável e bem documentado',
        'Participar em revisões de código e sessões de planeamento',
        'Resolver problemas técnicos e otimizar performance'
      ],
      benefits: ['Seguro de saúde privado', 'Férias flexíveis (25 dias + feriados)', 'Trabalho remoto 2-3 dias por semana', 'Orçamento para formação e conferências', 'Equipamento de trabalho fornecido'],
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      contact: {
        email: 'rh@techangola.co.uk',
        phone: '+44 20 1234 5678',
        person: 'Maria Santos',
        position: 'Gestora de Recursos Humanos'
      },
      companyInfo: {
        about: 'A TechAngola UK é uma empresa de tecnologia focada em criar soluções digitais para a comunidade angolana no Reino Unido. Fundada em 2020, já servimos mais de 10,000 utilizadores.',
        size: '20-50 funcionários',
        founded: '2020',
        website: 'www.techangola.co.uk'
      },
      logo: '/api/placeholder/120/120',
      images: ['/api/placeholder/800/400', '/api/placeholder/800/400']
    },
    {
      id: 2,
      title: 'Estágio em Marketing Digital',
      type: 'estagio',
      company: 'Angola Business Network',
      location: 'Manchester',
      area: 'marketing',
      level: 'junior',
      salary: '£18,000 - £22,000',
      workType: 'Presencial',
      description: 'Oportunidade de estágio para estudantes ou recém-formados interessados em marketing digital e comunicação.',
      fullDescription: 'Oferecemos uma oportunidade única de estágio em marketing digital para jovens talentos que desejam iniciar a sua carreira numa empresa que valoriza a diversidade e a inovação.\n\nDurante este estágio de 12 meses, você terá a oportunidade de trabalhar em projetos reais, aprender com profissionais experientes e desenvolver competências valiosas em marketing digital.',
      requirements: ['Formação em Marketing, Comunicação ou área relacionada', 'Conhecimentos básicos de redes sociais', 'Português e Inglês fluentes', 'Entusiasmo para aprender', 'Disponibilidade para estágio de 12 meses'],
      responsibilities: [
        'Apoiar na criação de conteúdo para redes sociais',
        'Assistir na gestão de campanhas de marketing digital',
        'Realizar pesquisas de mercado e análise de concorrência',
        'Apoiar na organização de eventos e webinars',
        'Colaborar na criação de materiais promocionais'
      ],
      benefits: ['Formação contínua em marketing digital', 'Mentoria personalizada', 'Certificações Google e Facebook', 'Ambiente de trabalho multicultural', 'Possibilidade de contratação após estágio'],
      postedDate: '2024-01-10',
      deadline: '2024-02-10',
      contact: {
        email: 'estagios@abn.co.uk',
        phone: '+44 161 234 5678',
        person: 'João Pereira',
        position: 'Diretor de Marketing'
      },
      companyInfo: {
        about: 'A Angola Business Network é uma organização dedicada a promover negócios e oportunidades para a comunidade angolana no Reino Unido.',
        size: '10-20 funcionários',
        founded: '2018',
        website: 'www.abn.co.uk'
      },
      logo: '/api/placeholder/120/120',
      images: ['/api/placeholder/800/400']
    }
  ];

  const opportunity = opportunities.find(opp => opp.id === opportunityId) || opportunities[0];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emprego':
        return <BriefcaseIcon className="h-6 w-6" />;
      case 'estagio':
        return <AcademicCapIcon className="h-6 w-6" />;
      case 'negocio':
        return <BuildingOfficeIcon className="h-6 w-6" />;
      default:
        return <BriefcaseIcon className="h-6 w-6" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'emprego':
        return 'Emprego';
      case 'estagio':
        return 'Estágio';
      case 'negocio':
        return 'Oportunidade de Negócio';
      default:
        return 'Oportunidade';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleApply = () => {
    setIsApplied(!isApplied);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Confira esta oportunidade: ${opportunity.title} na ${opportunity.company}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(opportunity.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }
  };

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Contactar {opportunity.contact.person}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="Escreva a sua mensagem..."></textarea>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowContactModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowContactModal(false)}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to="/oportunidades" 
            className="inline-flex items-center gap-2 text-white hover:text-yellow-200 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar às Oportunidades
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                  {getTypeIcon(opportunity.type)}
                  {getTypeLabel(opportunity.type)}
                </span>
                <span className="text-sm opacity-75">
                  Publicado em {formatDate(opportunity.postedDate)}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{opportunity.title}</h1>
              <p className="text-xl opacity-90 mb-6">{opportunity.company}</p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyPoundIcon className="h-5 w-5" />
                  <span>{opportunity.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>{opportunity.workType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Prazo: {formatDate(opportunity.deadline)}</span>
                </div>
              </div>
            </div>
            
            {/* Sidebar de Ações */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full lg:w-80">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={opportunity.logo} 
                  alt={opportunity.company}
                  className="w-16 h-16 rounded-lg bg-white p-2"
                />
                <div>
                  <h3 className="font-bold">{opportunity.company}</h3>
                  <p className="text-sm opacity-75">{opportunity.companyInfo.size}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <VisitorAction
                  onAction={handleApply}
                  showModal={false}
                  redirectTo="/login"
                  requireMember={false}
                  actionType="opportunity"
                >
                  <button
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                      isApplied 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {isApplied ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        Candidatura Enviada
                      </span>
                    ) : (
                      'Candidatar-se'
                    )}
                  </button>
                </VisitorAction>
                
                <VisitorAction
                  onAction={() => setShowContactModal(true)}
                  showModal={false}
                  redirectTo="/login"
                  requireMember={false}
                  actionType="message"
                >
                  <button
                    className="w-full px-4 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Contactar Empresa
                  </button>
                </VisitorAction>
                
                <div className="flex gap-2">
                  <VisitorAction
                    onAction={() => setIsFavorite(!isFavorite)}
                    showModal={true}
                    redirectTo="/login"
                    requireMember={false}
                    actionType="favorite"
                  >
                    <button
                      className="flex-1 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      {isFavorite ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-300" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                  </VisitorAction>
                  
                  <div className="relative group">
                    <button className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button onClick={() => handleShare('facebook')} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Facebook</button>
                      <button onClick={() => handleShare('twitter')} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Twitter</button>
                      <button onClick={() => handleShare('whatsapp')} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">WhatsApp</button>
                      <button onClick={() => handleShare('email')} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Email</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Navegação por Abas */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Visão Geral' },
                  { id: 'requirements', label: 'Requisitos' },
                  { id: 'responsibilities', label: 'Responsabilidades' },
                  { id: 'company', label: 'Empresa' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Conteúdo das Abas */}
            <div className="bg-white rounded-lg shadow-md p-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Descrição da Oportunidade</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {opportunity.fullDescription}
                    </p>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <GiftIcon className="h-5 w-5 text-yellow-500" />
                      Benefícios
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {opportunity.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'requirements' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                    Requisitos
                  </h2>
                  <ul className="space-y-3">
                    {opportunity.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'responsibilities' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <DocumentTextIcon className="h-6 w-6 text-yellow-500" />
                    Responsabilidades
                  </h2>
                  <ul className="space-y-3">
                    {opportunity.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'company' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Sobre a {opportunity.company}</h2>
                  <div className="flex items-start gap-6 mb-6">
                    <img 
                      src={opportunity.logo} 
                      alt={opportunity.company}
                      className="w-24 h-24 rounded-lg bg-gray-100 p-3"
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-2">{opportunity.company}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Tamanho:</strong> {opportunity.companyInfo.size}</p>
                        <p><strong>Fundada:</strong> {opportunity.companyInfo.founded}</p>
                        <p><strong>Website:</strong> <a href={`https://${opportunity.companyInfo.website}`} className="text-yellow-600 hover:underline">{opportunity.companyInfo.website}</a></p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{opportunity.companyInfo.about}</p>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-bold mb-4">Contacto</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{opportunity.contact.person}</p>
                          <p className="text-sm text-gray-600">{opportunity.contact.position}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <a href={`mailto:${opportunity.contact.email}`} className="flex items-center gap-2 text-yellow-600 hover:underline">
                          <EnvelopeIcon className="h-4 w-4" />
                          {opportunity.contact.email}
                        </a>
                        <a href={`tel:${opportunity.contact.phone}`} className="flex items-center gap-2 text-yellow-600 hover:underline">
                          <PhoneIcon className="h-4 w-4" />
                          {opportunity.contact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Informações Rápidas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="text-gray-900">{getTypeLabel(opportunity.type)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Localização</p>
                  <p className="text-gray-900">{opportunity.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Salário</p>
                  <p className="text-gray-900">{opportunity.salary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Modalidade</p>
                  <p className="text-gray-900">{opportunity.workType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prazo de Candidatura</p>
                  <p className="text-gray-900">{formatDate(opportunity.deadline)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Contacto */}
      {showContactModal && <ContactModal />}
    </div>
  );
};

export default OpportunityDetails;