import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../../localization/en.json';
import ru from '../../../localization/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    // Язык по умолчанию — русский, а не язык браузера. Бизнес русский, и
    // часть строк в интерфейсе захардкожена по-русски: при английском
    // браузере админка открывалась наполовину английской.
    // Переключатель в шапке по-прежнему работает
    lng: 'ru',
    fallbackLng: 'ru',
    supportedLngs: ['en', 'ru'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Функция для принудительной перезагрузки переводов
export const reloadTranslations = () => {
  i18n.reloadResources();
};

export default i18n; 