const FeaturesSection = () => {
  const features = [
    {
      icon: "fas fa-users",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Network Eficiente",
      description: "Conecte-se com outros angolanos em sua área ou setor de atuação. Encontre mentores, parceiros e colaboradores."
    },
    {
      icon: "fas fa-store",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Vitrine Digital",
      description: "Cada membro tem sua página personalizada para mostrar seus negócios, serviços ou habilidades profissionais."
    },
    {
      icon: "fas fa-calendar-alt",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Eventos Locais",
      description: "Descubra e participe de eventos da comunidade angolana em todo o Reino Unido."
    },
    {
      icon: "fas fa-comments",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Fórum de Discussão",
      description: "Debata temas relevantes, peça conselhos e compartilhe experiências com a comunidade."
    },
    {
      icon: "fas fa-briefcase",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Oportunidades",
      description: "Acesso exclusivo a vagas de emprego, estágios e oportunidades de negócio dentro da comunidade."
    },
    {
      icon: "fas fa-hand-holding-heart",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Apoio Comunitário",
      description: "Encontre ajuda e orientação sobre vistos, moradia, educação e outros desafios de viver no UK."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Como podemos ajudar a sua jornada no UK
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Ferramentas poderosas para conectar, crescer e prosperar na comunidade angolana
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <div className={`flex items-center justify-center h-12 w-12 rounded-md ${feature.iconBg} ${feature.iconColor}`}>
                <i className={`${feature.icon} text-xl`}></i>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;