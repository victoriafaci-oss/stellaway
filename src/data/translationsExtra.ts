import type { SupportedLanguage } from '../lib/i18nHelpers';
import { TRANSLATIONS_EXTRA_ES, TRANSLATIONS_EXTRA_EN } from './translationsExtraEsEn';
import { TRANSLATIONS_EXTRA_FR, TRANSLATIONS_EXTRA_PT } from './translationsExtraFrPt';
import { TRANSLATIONS_EXTRA_IT, TRANSLATIONS_EXTRA_DE } from './translationsExtraItDe';

export const TRANSLATIONS_EXTRA: Record<SupportedLanguage, Record<string, string>> = {
  es: TRANSLATIONS_EXTRA_ES,
  en: TRANSLATIONS_EXTRA_EN,
  fr: TRANSLATIONS_EXTRA_FR,
  pt: TRANSLATIONS_EXTRA_PT,
  it: TRANSLATIONS_EXTRA_IT,
  de: TRANSLATIONS_EXTRA_DE,
};
