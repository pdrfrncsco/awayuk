import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, t } = useTranslation();

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="group">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <GlobeAltIcon className="h-5 w-5" />
        </button>

        <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`${
                  currentLanguage === language.code
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700'
                } group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                <span className="mr-3 text-lg">{language.flag}</span>
                {language.name}
                {currentLanguage === language.code && (
                  <svg
                    className="ml-auto h-4 w-4 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;