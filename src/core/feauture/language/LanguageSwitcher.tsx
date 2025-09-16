import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'EN', dir: 'ltr', flag: '🇺🇸' },
    { code: 'ru', name: 'RU', dir: 'ltr', flag: '🇷🇺' },
  ];

  if (true) {
    return null;
  }
  return (
    <div className="flex gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            i18n.language === lang.code 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
          dir={lang.dir}
          title={`${lang.name} - ${lang.code.toUpperCase()}`}
        >
          <span className="text-base">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}; 