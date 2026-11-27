import type { SupportedLanguage } from '../lib/i18nHelpers';
import { TRANSLATIONS_EXTRA_ES, TRANSLATIONS_EXTRA_EN } from './translationsExtraEsEn';
import { TRANSLATIONS_EXTRA_FR, TRANSLATIONS_EXTRA_PT } from './translationsExtraFrPt';
import { TRANSLATIONS_EXTRA_IT, TRANSLATIONS_EXTRA_DE } from './translationsExtraItDe';
import { TRANSLATIONS_ECLIPSE_2027 } from './translationsEclipse2027';

export const TRANSLATIONS_EXTRA: Record<SupportedLanguage, Record<string, string>> = {
  es: { ...TRANSLATIONS_EXTRA_ES, ...TRANSLATIONS_ECLIPSE_2027.es },
  en: { ...TRANSLATIONS_EXTRA_EN, ...TRANSLATIONS_ECLIPSE_2027.en },
  fr: { ...TRANSLATIONS_EXTRA_FR, ...TRANSLATIONS_ECLIPSE_2027.fr },
  pt: { ...TRANSLATIONS_EXTRA_PT, ...TRANSLATIONS_ECLIPSE_2027.pt },
  it: { ...TRANSLATIONS_EXTRA_IT, ...TRANSLATIONS_ECLIPSE_2027.it },
  de: { ...TRANSLATIONS_EXTRA_DE, ...TRANSLATIONS_ECLIPSE_2027.de },
};
