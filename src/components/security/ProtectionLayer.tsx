import { useEffect, useCallback, useState } from 'react';
import { setupSecurity } from '../utils/security';
import { useI18n } from '../i18n/context';

export default function ProtectionLayer() {
  const { t } = useI18n();
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((msgKey: string) => {
    setToast({ show: true, message: msgKey });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  }, []);

  useEffect(() => {
    const cleanup = setupSecurity(showToast);

    const handleOpen = () => setDevToolsDetected(true);
    const handleClose = () => setDevToolsDetected(false);

    document.addEventListener('devtools:open', handleOpen);
    document.addEventListener('devtools:close', handleClose);

    return () => {
      cleanup();
      document.removeEventListener('devtools:open', handleOpen);
      document.removeEventListener('devtools:close', handleClose);
    };
  }, [showToast]);

  return (
    <>
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3 rounded-xl text-sm text-slate-150 border border-glass-border backdrop-blur-xl animate-[fadeIn_0.3s_ease]">
          {toast.message}
        </div>
      )}

      {devToolsDetected && (
        <div className="fixed inset-0 z-[9999] bg-deep-900 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-6 text-ice-300">⚠️</div>
            <h1 className="text-3xl font-light text-slate-150 mb-2 tracking-wider">
              {t('security.title')}
            </h1>
            <p className="text-sm uppercase tracking-[0.3em] text-steel-400 mb-6">
              {t('security.subtitle')}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {t('security.message')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDevToolsDetected(false)}
                className="px-6 py-2.5 text-sm rounded-lg border border-glass-border text-slate-150 glass-hover hover:border-ice-300/30 transition-all duration-300"
              >
                {t('security.retry')}
              </button>
              <a
                href="mailto:dev.gabo23@gmail.com"
                className="px-6 py-2.5 text-sm rounded-lg bg-ice-300/10 border border-ice-300/20 text-ice-300 hover:bg-ice-300/20 transition-all duration-300"
              >
                {t('security.contact')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
