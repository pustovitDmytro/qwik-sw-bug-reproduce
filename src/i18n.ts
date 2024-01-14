import '@angular/localize/init';
import { loadTranslations } from '@angular/localize';
import { $, getLocale, useOnDocument, withLocale } from '@builder.io/qwik';
import type { RenderOptions } from '@builder.io/qwik/server';

// You must declare all your locales here
import EN from './locales/message.en.json';
import UA from './locales/message.ua.json';


export const languages = [
    { id: 'en', label: 'English', default: true },
    { id: 'ua', label: 'Українська' }
];
const defaultLang = languages.find(l => l.default) || languages[0];
const TRANSLATIONS = [ EN, UA ];

/**
 * This file is left for the developer to customize to get the behavior they want for localization.
 */

// / Declare location where extra types will be stored.
const $localizeFn = $localize as any as {
  TRANSLATIONS: Record<string, any>;
  TRANSLATION_BY_LOCALE: Map<string, Record<string, any>>;
};

/**
 * This solution uses the `@angular/localize` package for translations, however out of the box
 * `$localize` works with a single translation only. This code adds support for multiple locales
 * concurrently. It does this by intercepting the `TRANSLATIONS` property read and returning
 * appropriate translation based on the current locale which is store in the `usEnvDate('local')`.
 */

if (!$localizeFn.TRANSLATION_BY_LOCALE) {
    $localizeFn.TRANSLATION_BY_LOCALE = new Map([ [ '', {} ] ]);
    Object.defineProperty($localize, 'TRANSLATIONS', {
        get() {
            const locale = getLocale(defaultLang.id);

            let translations = $localizeFn.TRANSLATION_BY_LOCALE.get(locale);

            if (!translations) {
                $localizeFn.TRANSLATION_BY_LOCALE.set(locale, (translations = {}));
            }

            return translations;
        }
    });
}

/**
 * Function used to load all translations variants.
 */
export function initTranslations() {
    TRANSLATIONS.forEach(({ translations, locale }) => {
        withLocale(locale, () => loadTranslations(translations));
    });
}

/**
 * Function used to examine the request and determine the locale to use.
 *
 * This function is meant to be used with `RenderOptions.locale` property
 *
 * @returns The locale to use which will be stored in the `useEnvData('locale')`.
 */
export function extractLang(locale: string): string {
    return locale && $localizeFn.TRANSLATION_BY_LOCALE.has(locale)
        ? locale
        : defaultLang.id;
}

/**
 * Function used to determine the base URL to use for loading the chunks in the browser.
 *
 * The function returns `/build` in dev mode or `/build/<locale>` in prod mode.
 *
 * This function is meant to be used with `RenderOptions.base` property
 *
 * @returns The base URL to use for loading the chunks in the browser.
 */
export function extractBase({ serverData }: RenderOptions): string {
    if (import.meta.env.DEV) {
        return '/build';
    }

    return `/build/${serverData!.locale}`;
}

export function useI18n() {
    if (import.meta.env.DEV) {
    // During development only, load all translations in memory when the app starts on the client.
        // eslint-disable-next-line qwik/use-method-usage
        useOnDocument('qinit', $(initTranslations));
    }
}

// We always need the translations on the server
if (import.meta.env.SSR) {
    initTranslations();
}
