import { defineI18n } from 'fumadocs-core/i18n';


export const i18n = defineI18n({
  defaultLanguage: 'cn',
  fallbackLanguage: 'cn',
  // languages: [{'locale':'en','displayName':'English'}, {'locale':'cn','displayName':'Chinese'}],
  languages: ['cn', 'tw', 'en'],
  hideLocale: 'default-locale',
});

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

// export const lang2display = [
//   { locale: "en", name: "English" },
//   { locale: "cn", name: "Simplified Chinese" },
//   { locale: "tw", name: "Traditional Chinese" },
// ];

export const translations = {
  en: {
    displayName: "English",
  },
  tw: {
    displayName: "Traditional English",
    toc: "目錄",
    search: "搜尋文檔",
    lastUpdate: "最後更新於",
    searchNoResult: "沒有結果",
    previousPage: "上一頁",
    nextPage: "下一頁",
    chooseLanguage: "選擇語言",
  },
  cn: {
    displayName: "Simplified Chinese",
    toc: "目录",
    search: "查找文档",
    lastUpdate: "最后更新于",
    searchNoResult: "没有结果",
    previousPage: "上一页",
    nextPage: "下一页",
    chooseLanguage: "选择语言",
  },
}
