import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

export { I18nContext };

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de um I18nProvider');
  }
  return context;
};

// Idiomas suportados
export const SUPPORTED_LANGUAGES = {
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹'
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧'
  }
};

export const I18nProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt'); // Português como padrão
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Carregar traduções do idioma atual
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Importar dinamicamente as traduções
        const translationModule = await import(`../locales/${currentLanguage}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(`Erro ao carregar traduções para ${currentLanguage}:`, error);
        // Fallback para português se houver erro
        if (currentLanguage !== 'pt') {
          try {
            const fallbackModule = await import('../locales/pt.json');
            setTranslations(fallbackModule.default || fallbackModule);
          } catch (fallbackError) {
            console.error('Erro ao carregar traduções de fallback:', fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Carregar idioma salvo no localStorage ao inicializar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('awaysuk_language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Função para alterar idioma
  const changeLanguage = (languageCode) => {
    if (SUPPORTED_LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('awaysuk_language', languageCode);
    }
  };

  // Função para obter tradução
  const t = (key, params = {}) => {
    if (!key) return '';
    
    // Navegar através do objeto de traduções usando a chave
    const keys = key.split('.');
    let translation = translations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Retornar a chave se a tradução não for encontrada
        console.warn(`Tradução não encontrada para a chave: ${key}`);
        return key;
      }
    }
    
    // Se a tradução for uma string, aplicar parâmetros se fornecidos
    if (typeof translation === 'string') {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      }, translation);
    }
    
    return translation || key;
  };

  // Função para obter informações do idioma atual
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES[currentLanguage];
  };

  // Função para verificar se um idioma é suportado
  const isLanguageSupported = (languageCode) => {
    return !!SUPPORTED_LANGUAGES[languageCode];
  };

  const value = {
    currentLanguage,
    translations,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    isLanguageSupported
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;