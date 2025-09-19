import 'server-only'
 
const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    ko: () => import('../locales/ko.json').then((module) => module.default),
}
 
const getDictionary = async (locale: 'en' | 'ko') =>
    dictionaries[locale]();

export default getDictionary;