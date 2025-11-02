import 'server-only'
 
const policies = {
    en: () => import('../locales/policy_en.json').then((module) => module.default),
    ko: () => import('../locales/policy_ko.json').then((module) => module.default),
}
 
const getPolicies = async (locale: 'en' | 'ko') =>
    policies[locale]();

export default getPolicies;