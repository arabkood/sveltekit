import { writable, get } from 'svelte/store';
import ar from '$i18n/locales/ar';
import type { Dictionary, ErrorKey, I18nStore, Language, TranslationKey } from '$types/i18n';

// Dev only store for missing translations
const missingTranslations = new Set<string>();

function getValue<T, D = undefined>(obj: any, path: string, defaultValue?: D): T | D {
  const result = path
    .replace(/\[(\w+)\]/g, '.$1') // convert [0] to .0
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  return result === undefined ? defaultValue as D : result as T;
}

function createI18nStore(): I18nStore {
  const store = writable<{
    currentLocale: Language;
    dictionary: Dictionary;
  }>({
    currentLocale: 'ar',
    dictionary: ar
  });

  function interpolate(text: string, params: Record<string, string>): string {
    return text.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`);
  }

  function t(key: TranslationKey, params?: Record<string, string>): string {
    const state = get(store);
    const translatedValue = getValue(state.dictionary, key);

    if (typeof translatedValue !== 'string') {
      console.error(`Translation missing for key: ${key}`);
      if (import.meta.env.DEV) {
        missingTranslations.add(key);
      }
      return key;
    }

    if (!params) {
      return translatedValue;
    }
    return interpolate(translatedValue, params);
  }

  function error(key: ErrorKey | string): string {
    const state = get(store);
    const errorTranslation = getValue(state.dictionary, `errors.${key}`);

    if (typeof errorTranslation !== 'string') {
      console.error(`Error translation missing for key: ${key}`);
      if (import.meta.env.DEV) {
        missingTranslations.add(`errors.${key}`);
      }
      // Return a user-friendly fallback in production
      return getValue(state.dictionary, 'errors.SOMETHING_WENT_WRONG') || 'Something went wrong';
    }

    return errorTranslation;
  }

  function setLocale(locale: Language): void {
    const dictionaries: Record<Language, Dictionary> = {
      ar
    };
    const dictionary = dictionaries[locale];
    if (typeof window !== 'undefined') {
      document.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
    store.update((state) => ({
      ...state,
      currentLocale: locale,
      dictionary
    }));
  }

  return {
    subscribe: store.subscribe,
    t,
    error,
    setLocale
  };
}
export const i18n = createI18nStore();

// Add dev-only function
declare global {
  interface Window {
    getMissingTranslations?: () => Record<string, unknown>;
  }
}
if (import.meta.env.DEV && typeof window !== 'undefined') {
  function createNestedObject(flatKeys: Set<string>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const path of flatKeys) {
      const parts = path.split('.');
      let current = result;

      for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        if (i === parts.length - 1) {
          current[key] = null;
        } else {
          current[key] = current[key] || {};
          current = current[key] as Record<string, unknown>;
        }
      }
    }

    return result;
  }

  window.getMissingTranslations = () => {
    const missing = createNestedObject(missingTranslations);
    console.log('Missing translations:', missing);
    return missing;
  };
}
