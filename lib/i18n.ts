import type { I18nConfig } from 'fumadocs-core/i18n';

export const lang2iso: { [key: string]: string } = {
  'en': 'en',
  'cn': 'zh-CN',
  'tw': 'zh-tw',
};

export const iso2lang: { [key: string]: string } = {
  'en': 'en',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
};

export const lang2display = [
  { locale: "en", name: "English" },
  { locale: "cn", name: "Simplified Chinese" },
  { locale: "tw", name: "Traditional Chinese" },
];

export const i18n: I18nConfig = {
  defaultLanguage: 'cn',
  languages: ['en', 'cn', 'tw'],
  hideLocale: 'default-locale',
};
