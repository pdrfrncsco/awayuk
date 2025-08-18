import React from 'react';
import { 
  HeartIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const AboutUs = () => {
  const stats = [
    { label: 'Membros Ativos', value: '500+', icon: UserGroupIcon },
    { label: 'Eventos Realizados', value: '150+', icon: CalendarIcon },
    { label: 'Oportunidades Criadas', value: '200+', icon: BriefcaseIcon },
    { label: 'Cidades Representadas', value: '25+', icon: MapPinIcon }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Solidariedade',
      description: 'Apoiamos uns aos outros em todas as jornadas, criando uma rede de suporte genuína e duradoura.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Diversidade Cultural',
      description: 'Celebramos a riqueza das nossas diferentes origens, criando pontes entre culturas e tradições.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Crescimento Contínuo',
      description: 'Promovemos o desenvolvimento pessoal e profissional através de partilha de conhecimento e experiências.'
    },
    {
      icon: SparklesIcon,
      title: 'Inovação',
      description: 'Incentivamos ideias criativas e soluções inovadoras para os desafios da nossa comunidade.'
    }
  ];

  const team = [
    {
      name: 'Maria Santos',
      role: 'Fundadora & Presidente',
      bio: 'Emigrou para o Reino Unido há 15 anos e dedica-se a ajudar outros portugueses na sua jornada.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'João Silva',
      role: 'Coordenador de Eventos',
      bio: 'Especialista em criar experiências memoráveis que unem a nossa comunidade.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Ana Costa',
      role: 'Responsável de Parcerias',
      bio: 'Constrói pontes entre empresas e a nossa comunidade, criando oportunidades para todos.',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre a AWAYSUK
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Uma comunidade vibrante de angolanos no Reino Unido, unidos pela paixão de crescer juntos
            </p>
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
                <p className="text-lg font-medium">
                  "Longe de casa, mas nunca sozinhos"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              A Nossa Missão
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Criamos uma ponte entre Angola e o Reino Unido, oferecendo suporte, oportunidades e 
              uma verdadeira sensação de pertença a todos os angolanos que escolheram fazer do UK a sua casa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                O Que Fazemos
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Networking Profissional:</strong> Conectamos talentos angolanos com oportunidades de carreira no Reino Unido
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Eventos Culturais:</strong> Organizamos encontros que celebram a nossa herança angolana
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Suporte à Integração:</strong> Ajudamos novos emigrantes a adaptar-se à vida no Reino Unido
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Desenvolvimento Pessoal:</strong> Oferecemos workshops e formações para crescimento contínuo
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                A Nossa História
              </h4>
              <p className="text-gray-600 mb-4">
                A AWAYSUK nasceu em 2025 da necessidade de criar uma verdadeira comunidade angolana no Reino Unido. 
                Começámos como um pequeno grupo de amigos que se reunia mensalmente num café em Londres.
              </p>
              <p className="text-gray-600 mb-4">
                Hoje, somos uma rede nacional que abrange desde Londres até Manchester, de Birmingham a Edinburgh, 
                conectando angolanos em todas as principais cidades britânicas.
              </p>
              <p className="text-gray-600">
                O nosso crescimento orgânico reflete a necessidade real de pertença e suporte que todos sentimos 
                quando estamos longe de casa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Os Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estes são os princípios que nos guiam e definem quem somos como comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Conheça a Nossa Equipa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As pessoas dedicadas que tornam a AWAYSUK uma realidade todos os dias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <UserGroupIcon className="h-20 w-20 text-white opacity-50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Junta-te à Nossa Comunidade
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Faz parte de uma rede que te apoia, inspira e celebra contigo. 
            Porque juntos somos mais fortes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Torna-te Membro
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
              Contacta-nos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;