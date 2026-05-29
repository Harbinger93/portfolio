import { useI18n } from '../../i18n/context';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-glass-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <p>
          &copy; {new Date().getFullYear()} Gabriel Vazquez. {t('footer.rights')}
        </p>
        <p className="flex items-center gap-1">
          {t('footer.built')} <Heart className="w-3 h-3 text-ice-300" /> Astro & React
        </p>
      </div>
    </footer>
  );
}
