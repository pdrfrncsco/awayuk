const PricingSection = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "£0",
      period: "/mês",
      description: "Perfeito para começar a conectar-se",
      features: [
        "Perfil básico",
        "Acesso ao fórum",
        "Visualizar eventos",
        "Mensagens limitadas (5/mês)",
        "Busca básica de membros"
      ],
      buttonText: "Começar Grátis",
      buttonClass: "bg-gray-800 text-white hover:bg-gray-700",
      popular: false
    },
    {
      name: "Pro",
      price: "£9.99",
      period: "/mês",
      description: "Para profissionais que querem crescer",
      features: [
        "Tudo do plano Gratuito",
        "Página de negócio personalizada",
        "Mensagens ilimitadas",
        "Criar e promover eventos",
        "Analytics básicos",
        "Suporte prioritário"
      ],
      buttonText: "Escolher Pro",
      buttonClass: "bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90",
      popular: true
    },
    {
      name: "Business",
      price: "£24.99",
      period: "/mês",
      description: "Para empresas e organizações",
      features: [
        "Tudo do plano Pro",
        "Múltiplas páginas de negócio",
        "Analytics avançados",
        "Publicidade destacada",
        "API de integração",
        "Gerente de conta dedicado"
      ],
      buttonText: "Escolher Business",
      buttonClass: "bg-gray-800 text-white hover:bg-gray-700",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Planos que se adaptam às suas necessidades
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Escolha o plano ideal para impulsionar sua presença na comunidade angolana
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-yellow-500 transform scale-105' : ''}`}>
              {plan.popular && (
                <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-center py-2 text-sm font-medium">
                  Mais Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <i className="fas fa-check text-green-500"></i>
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button className={`w-full py-3 px-4 rounded-md text-base font-medium transition duration-300 ${plan.buttonClass}`}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            Todos os planos incluem acesso completo à comunidade e suporte técnico.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Cancele a qualquer momento. Sem taxas ocultas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;