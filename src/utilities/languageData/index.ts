import i18n, { TFunction } from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "../constants";
import { appLanguages } from "./data";
import { languageData } from "..";
import { getItem, setItem } from "../../services/assynsStorage";

// CHANGE LANGUAGE
const setLanguageAsync = async (lang: string): Promise<void> => {
  await setItem("languagecode", lang);
};

export const onLanguageSelect = async (
  langId: string,
  setFlag: (flag: boolean) => void,
  flag: boolean
): Promise<void> => {
  const lang = appLanguages.find((item) => item.code === langId);
  if (lang) {
    await i18n.changeLanguage(lang.code);
    await setLanguageAsync(lang.code);
    setFlag(!flag);
  }
};

// CHANGE LANGUAGE

export const fetchTranslations = async (): Promise<boolean> => {
  const translations = languageData;
  let selectedLocale: string | null = null;

  if (translations.length) {
    translations.forEach((translation) => {
      i18n.addResourceBundle(
        translation.locale,
        "translation",
        translation.translation,
        true,
        true
      );
    });

    const locales = translations.map((translation) => translation.locale);

    let lang: string | null = null;

    try {
      lang = await getItem("languagecode", DEFAULT_LANGUAGE);
    } catch (error) {}

    selectedLocale = locales.find((locale) => locale === lang) || null;
  }

  if (selectedLocale) {
    await setItem("languagecode", selectedLocale);
    i18n.changeLanguage(selectedLocale);
  } else {
    await setItem("languagecode", DEFAULT_LANGUAGE);
  }

  return true;
};

export const translate = (value: string): string => i18n.t(value);

i18n.use(initReactI18next).init({
  debug: true,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  resources: {},
});

export default i18n;
