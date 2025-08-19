import { useContext } from 'react';
import { I18nContext } from '../contexts/I18nContext';

/**
 * Hook personalizado para usar traduções
 * @returns {Object} Objeto com função de tradução e informações do idioma
 */
export const useTranslation = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useTranslation deve ser usado dentro de um I18nProvider');
  }
  
  const { t, currentLanguage, changeLanguage, isLoading } = context;
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading
  };
};

export default useTranslation;