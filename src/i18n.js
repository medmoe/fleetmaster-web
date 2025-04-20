import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from "../public/locals/en/translation"
import arTranslation from "../public/locals/ar/translation"

const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {translation: enTranslation},
            ar: {translation: arTranslation}
        },
        fallbackLng: 'en',
        debug: env === 'development',
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        }
    })

export default i18n;