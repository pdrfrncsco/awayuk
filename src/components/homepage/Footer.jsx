import { useTranslation } from '../../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { name: t('navigation.home'), href: "#home" },
    { name: t('features.title'), href: "#features" },
    { name: t('navigation.community'), href: "#community" },
    { name: "Preços", href: "#pricing" }
  ];

  const supportLinks = [
    { name: "Centro de Ajuda", href: "#" },
    { name: "Contacto", href: "#contact" },
    { name: "FAQ", href: "#" },
    { name: "Suporte Técnico", href: "#" }
  ];

  const communityLinks = [
    { name: "Fórum", href: "#" },
    { name: "Eventos", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Newsletter", href: "#" }
  ];

  const companyLinks = [
    { name: "Sobre Nós", href: "#" },
    { name: "Carreiras", href: "#" },
    { name: "Imprensa", href: "#" },
    { name: "Parceiros", href: "#" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", href: "#" },
    { name: "Instagram", icon: "fab fa-instagram", href: "#" },
    { name: "Twitter", icon: "fab fa-twitter", href: "#" },
    { name: "LinkedIn", icon: "fab fa-linkedin-in", href: "#" },
    { name: "YouTube", icon: "fab fa-youtube", href: "#" }
  ];

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-yellow-500 to-red-500 text-white">
                <i className="fas fa-globe-africa text-xl"></i>
              </div>
              <span className="ml-3 text-xl font-bold text-white">AWUK</span>
            </div>
            <p className="text-gray-300 text-base">
              {t('footer.description')}
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{social.name}</span>
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.quickLinks')}</h3>
                <ul className="mt-4 space-y-4">
                  {platformLinks.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-base text-gray-300 hover:text-white">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.support')}</h3>
                <ul className="mt-4 space-y-4">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-base text-gray-300 hover:text-white">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.community')}</h3>
                <ul className="mt-4 space-y-4">
                  {communityLinks.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-base text-gray-300 hover:text-white">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.legal')}</h3>
                <ul className="mt-4 space-y-4">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-base text-gray-300 hover:text-white">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                {t('footer.termsOfService')}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                {t('footer.cookiePolicy')}
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;