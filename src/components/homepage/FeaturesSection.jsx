import { useTranslation } from '../../hooks/useTranslation';

const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: "fas fa-users",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: t('features.community.title'),
      description: t('features.community.description')
    },
    {
      icon: "fas fa-store",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: t('features.store.title'),
      description: t('features.store.description')
    },
    {
      icon: "fas fa-graduation-cap",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: t('features.resources.title'),
      description: t('features.resources.description')
    },
    {
      icon: "fas fa-calendar-alt",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: t('features.events.title'),
      description: t('features.events.description')
    },
    {
      icon: "fas fa-briefcase",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: t('features.opportunities.title'),
      description: t('features.opportunities.description')
    },
    {
      icon: "fas fa-hand-holding-heart",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: t('features.support.title'),
      description: t('features.support.description')
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            {t('features.subtitle')}
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