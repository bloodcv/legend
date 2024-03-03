import { createI18n } from 'vue-i18n'
import enLocale from './en'
import zhCNLocale from './zh-cn'

const messages = {
    en: {
        ...enLocale,
    },
    'zh-cn': {
        ...zhCNLocale,
    }
}

export const i18n = createI18n({
    locale: localStorage.getItem("locale") || 'zh-cn',
    messages,
    fallbackLocale: 'zh-cn',
    globalInjection: true,
    legacy: false,

})