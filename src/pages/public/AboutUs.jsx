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
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Solidariedade',
      description: 'Apoiamos uns aos outros em todas as jornadas, criando uma rede de suporte genuína e duradoura.'
    },
    {
      icon: GlobeAltIcon,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Diversidade Cultural',
      description: 'Celebramos a riqueza das nossas diferentes origens, criando pontes entre culturas e tradições.'
    },
    {
      icon: AcademicCapIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Crescimento Contínuo',
      description: 'Promovemos o desenvolvimento pessoal e profissional através de partilha de conhecimento e experiências.'
    },
    {
      icon: SparklesIcon,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Inovação',
      description: 'Incentivamos ideias criativas e soluções inovadoras para os desafios da nossa comunidade.'
    }
  ];

  const team = [
    {
      name: 'Evandro Amaral',
      role: 'Fundador & Presidente',
      bio: 'Emigrou para o Reino Unido há 15 anos e dedica-se a ajudar outros angolanos na sua jornada.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Juelsa Amaral',
      role: 'Coordenador de Eventos e Projectos',
      bio: 'Especialista em criar experiências memoráveis que unem a nossa comunidade.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Pedro Francisco',
      role: 'Responsável de Parcerias',
      bio: 'Constrói pontes entre empresas e a nossa comunidade, criando oportunidades para todos.',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="gradient-bg pt-24 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              <span className="block">Sobre a</span>
              <span className="block text-yellow-200">AWAYUK</span>
            </h1>
            <p className="mt-3 text-lg text-yellow-100 max-w-3xl mx-auto mb-8">
              Uma comunidade vibrante de angolanos no Reino Unido, unidos pela paixão de crescer juntos
            </p>
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
                <p className="text-lg font-medium text-white">
                  "Longe de casa, mas nunca sozinhos"
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="wave-shape">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-md ${
                    index === 0 ? 'bg-red-100' :
                    index === 1 ? 'bg-yellow-100' :
                    index === 2 ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <stat.icon className={`h-8 w-8 ${
                      index === 0 ? 'text-red-600' :
                      index === 1 ? 'text-yellow-600' :
                      index === 2 ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
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

      <section id="mission" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              A Nossa Missão
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
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
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Networking Profissional:</strong> Conectamos talentos angolanos com oportunidades de carreira no Reino Unido
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Eventos Culturais:</strong> Organizamos encontros que celebram a nossa herança angolana
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-600">
                    <strong>Suporte à Integração:</strong> Ajudamos novos emigrantes a adaptar-se à vida no Reino Unido
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
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
      </section>

      <section id="values" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Os Nossos Valores
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Estes são os princípios que nos guiam e definem quem somos como comunidade
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
                <div className={`flex items-center justify-center h-12 w-12 rounded-md ${value.iconBg} ${value.iconColor}`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">{value.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Conheça a Nossa Equipa
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              As pessoas dedicadas que tornam a AWAYSUK uma realidade todos os dias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <div className="w-full h-64 bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                    <UserGroupIcon className="h-20 w-20 text-white opacity-50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-medium mb-4">
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
      </section>

      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Junta-te à Nossa Comunidade
          </h2>
          <p className="text-lg text-yellow-100 max-w-3xl mx-auto mb-8">
            Faz parte de uma rede que te apoia, inspira e celebra contigo. 
            Porque juntos somos mais fortes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
              Torna-te Membro
            </button>
            <button className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10">
              Contacta-nos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;