import { useTranslation } from '../../hooks/useTranslation';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="gradient-bg pt-24 pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mt-10 sm:mt-12 lg:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="mt-3 text-lg text-yellow-100">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                {t('hero.cta')}
              </a>
              <a href="#" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10">
                <i className="fas fa-play-circle mr-2"></i> {t('hero.learnMore')}
              </a>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0">
            <div className="relative rounded-xl shadow-xl">
              <img className="w-full rounded-lg" src="https://picsum.photos/1350/800?random=30" alt="AWUK" />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg w-3/4">
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full border-2 border-yellow-500" src="https://picsum.photos/50/50?random=2" alt="User" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Maria K.</p>
                    <p className="text-sm text-gray-500">Encontrei 3 clientes esta semana!</p>
                  </div>
                </div>
              </div>
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
  );
};

export default HeroSection;