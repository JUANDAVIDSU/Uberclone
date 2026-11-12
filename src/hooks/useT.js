import { useRegistro } from '../context/RegistroContext';
import { translate } from '../data/translations';

export default function useT() {
  const { tab1 } = useRegistro();
  const lang = tab1.language || 'es';
  return {
    lang,
    locale: lang === 'en' ? 'en-US' : 'es-CO',
    t: (k) => translate(lang, k),
  };
}
