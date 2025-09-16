const CommunitySection = () => {
  const members = [
    {
      name: "Ana Kiala",
      profession: "Designer de Interiores",
      location: "Londres",
      avatar: "https://picsum.photos/40/40?random=3",
      image: "https://picsum.photos/634/400?random=10"
    },
    {
      name: "João Manuel",
      profession: "Consultor Financeiro",
      location: "Manchester",
      avatar: "https://picsum.photos/40/40?random=4",
      image: "https://picsum.photos/634/400?random=11"
    },
    {
      name: "Luísa Domingos",
      profession: "Chef de Cozinha",
      location: "Birmingham",
      avatar: "https://picsum.photos/40/40?random=5",
      image: "https://picsum.photos/634/400?random=12"
    },
    {
      name: "Pedro Santos",
      profession: "Desenvolvedor de Software",
      location: "Edimburgo",
      avatar: "https://picsum.photos/40/40?random=6",
      image: "https://picsum.photos/634/400?random=13"
    }
  ];

  return (
    <section id="community" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Conheça nossa comunidade
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Membros que já estão conectados e prosperando na plataforma
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <div key={index} className="user-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300">
              <div className="relative pb-48 overflow-hidden">
                <img className="absolute inset-0 h-full w-full object-cover" src={member.image} alt="Member" />
              </div>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={member.avatar} alt="Avatar" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.profession}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{member.location}</span>
                  <a href="#" className="text-sm font-medium text-red-600 hover:text-red-500">Ver perfil →</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90">
            Explorar mais membros
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;