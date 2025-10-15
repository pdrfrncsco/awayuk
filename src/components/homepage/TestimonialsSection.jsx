import { getProfileImageUrl } from '../../utils/getProfileImageUrl';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Teresa Silva",
      profession: "Empreendedora - Catering",
      profile_image: "https://picsum.photos/50/50?random=7",
      testimonial: "Graças à Angolan Way UK, consegui clientes regulares para meu negócio de catering. Em 3 meses, meu faturamento aumentou 40%!",
      rating: 5
    },
    {
      name: "Miguel Costa",
      profession: "Engenheiro Civil",
      profile_image: "https://picsum.photos/50/50?random=8",
      testimonial: "Encontrei meu primeiro emprego no UK através da plataforma. A rede de contatos que construí aqui foi fundamental para minha carreira.",
      rating: 4.5
    },
    {
      name: "Ana Paula",
      profession: "Estudante Universitária",
      profile_image: "https://picsum.photos/50/50?random=9",
      testimonial: "Como estudante, a plataforma me ajudou a encontrar acomodação segura e acessível, além de um grupo de estudo com outros angolanos.",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    return stars;
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            O que dizem sobre nós
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Histórias reais de membros que transformaram suas vidas com a Angola Connect UK
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={getProfileImageUrl({ profile_image: testimonial.profile_image, name: testimonial.name })}
                    alt={testimonial.name}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.profession}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90">
            Ver mais depoimentos
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;