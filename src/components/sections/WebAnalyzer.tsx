import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Gauge, Search, AlertTriangle, ShieldAlert, Cpu, Sparkles, Clock, LayoutGrid, Zap, Clipboard, Mail, Share2, MessageCircle, Info, HelpCircle } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface AuditResult {
  score: number;
  metrics: {
    fcp: { val: string; score: number; title: string };
    lcp: { val: string; score: number; title: string };
    tbt: { val: string; score: number; title: string };
    cls: { val: string; score: number; title: string };
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    displayValue?: string;
    score: number;
    savingsMs?: number;
    savingsBytes?: number;
  }>;
}

export default function WebAnalyzer() {
  const { t, locale } = useI18n();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalBlocked, setIsLocalBlocked] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [showTechInfo, setShowTechInfo] = useState(false);

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      nextBtnText: locale === 'es' ? 'Siguiente' : 'Next',
      prevBtnText: locale === 'es' ? 'Anterior' : 'Prev',
      doneBtnText: locale === 'es' ? 'Finalizar' : 'Done',
      steps: [
        {
          element: '#analyzer-title-section',
          popover: {
            title: locale === 'es' ? '¡Bienvenido al Analizador Web!' : 'Welcome to Web Speed Analyzer!',
            description: locale === 'es' ? 'Esta herramienta realiza auditorías completas de velocidad y Core Web Vitals en tiempo real usando datos oficiales de Google Lighthouse.' : 'This tool performs real-time speed and Core Web Vitals audits using official Google Lighthouse data.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#analyzer-input',
          popover: {
            title: locale === 'es' ? 'Ingresa la URL' : 'Enter the URL',
            description: locale === 'es' ? 'Escribe o pega la dirección de cualquier sitio web público que desees auditar (ej: google.com).' : 'Type or paste the URL of any public website you wish to audit (e.g. google.com).',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#analyzer-btn',
          popover: {
            title: locale === 'es' ? 'Iniciar Análisis' : 'Start Analysis',
            description: locale === 'es' ? 'Haz clic aquí para iniciar la auditoría. Puede tardar unos segundos mientras recopilamos las métricas en vivo.' : 'Click here to start the audit. It may take a few seconds as we collect live metrics.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: result ? '#analyzer-score' : '#analyzer-input',
          popover: {
            title: locale === 'es' ? 'Puntuación de Rendimiento' : 'Performance Score',
            description: locale === 'es' ? 'Muestra la calificación general de rendimiento sobre 100 y ofrece un diagnóstico automatizado.' : 'Displays the overall performance rating out of 100 along with an automated diagnostics report.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: result ? '#analyzer-metrics' : '#analyzer-input',
          popover: {
            title: locale === 'es' ? 'Core Web Vitals' : 'Core Web Vitals Metrics',
            description: locale === 'es' ? 'Visualiza las métricas clave de velocidad y estabilidad visual: FCP, LCP, TBT y CLS.' : 'View key metrics for speed and visual stability: FCP, LCP, TBT, and CLS.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: result ? '#analyzer-opportunities' : '#analyzer-input',
          popover: {
            title: locale === 'es' ? 'Recomendaciones de Optimización' : 'Optimization Recommendations',
            description: locale === 'es' ? 'Lista los cuellos de botella detectados en el sitio auditado y estima cuánto tiempo puedes ahorrar al resolverlos.' : 'Lists detected bottlenecks on the audited site and estimates how much load time you can save by solving them.',
            side: 'top',
            align: 'center'
          }
        }
      ]
    });
    driverObj.drive();
  };

  const validateAndFormatUrl = (input: string) => {
    let formatted = input.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  };

  const isValidUrl = (input: string): boolean => {
    try {
      const formatted = input.trim();
      
      // Prevent basic XSS / HTML / Script injection
      if (/[<>"'`$()[\]{}]/g.test(formatted)) {
        return false;
      }
      
      // Block common protocol handlers that can execute code
      const lower = formatted.toLowerCase();
      if (
        lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('file:') ||
        lower.startsWith('vbscript:')
      ) {
        return false;
      }

      // Check if it's a parseable URL after formatting
      let targetUrl = formatted;
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      
      const parsed = new URL(targetUrl);
      // Ensure the protocol is http or https
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      // Ensure the hostname is valid and not empty, and doesn't contain weird characters
      if (!parsed.hostname || parsed.hostname.trim() === '') {
        return false;
      }
      
      // Avoid hostname containing script-like elements or invalid domains
      if (/[^a-zA-Z0-9.-]/g.test(parsed.hostname)) {
        return false;
      }

      return true;
    } catch (_) {
      return false;
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
        }
      } else {
        alert(
          locale === 'es'
            ? 'Tu navegador no permite acceder al portapapeles automáticamente. Por favor, pega la URL manualmente.'
            : 'Your browser does not allow clipboard access. Please paste the URL manually.'
        );
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const generateShareText = () => {
    if (!result) return '';
    const targetUrl = validateAndFormatUrl(url);
    return locale === 'es'
      ? `📊 *Reporte de Rendimiento Web* 📊\n\n` +
        `🌐 *Sitio:* ${targetUrl}\n` +
        `⚡ *Puntuación:* ${result.score}/100\n\n` +
        `🔑 *Métricas Core Web Vitals:*\n` +
        `• FCP: ${result.metrics.fcp.val}\n` +
        `• LCP: ${result.metrics.lcp.val}\n` +
        `• TBT: ${result.metrics.tbt.val}\n` +
        `• CLS: ${result.metrics.cls.val}\n\n` +
        `Generado con el Analizador de Velocidad Web de Gabriel Vazquez.`
      : `📊 *Web Performance Report* 📊\n\n` +
        `🌐 *Site:* ${targetUrl}\n` +
        `⚡ *Score:* ${result.score}/100\n\n` +
        `🔑 *Core Web Vitals Metrics:*\n` +
        `• FCP: ${result.metrics.fcp.val}\n` +
        `• LCP: ${result.metrics.lcp.val}\n` +
        `• TBT: ${result.metrics.tbt.val}\n` +
        `• CLS: ${result.metrics.cls.val}\n\n` +
        `Generated with Gabriel Vazquez's Web Speed Analyzer.`;
  };

  const getWhatsAppShareUrl = () => {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`;
  };

  const getEmailShareUrl = () => {
    const subject = locale === 'es' 
      ? `Reporte de Rendimiento Web - ${url}` 
      : `Web Performance Report - ${url}`;
    const body = generateShareText().replace(/\*/g, '');
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: locale === 'es' ? 'Reporte de Rendimiento Web' : 'Web Performance Report',
          text: generateShareText().replace(/\*/g, ''),
        });
      } catch (err) {
        console.error('Failed to share natively:', err);
      }
    }
  };

  const isLocalUrl = (urlStr: string): boolean => {
    try {
      const parsed = new URL(urlStr);
      const hostname = parsed.hostname.toLowerCase();

      // Nombres de host locales comunes
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.local') ||
        hostname.endsWith('.localhost') ||
        hostname.endsWith('.test') ||
        hostname.endsWith('.example') ||
        hostname.endsWith('.invalid') ||
        !hostname.includes('.') // Nombres sin TLD (ej: my-server)
      ) {
        return true;
      }

      // Rangos de IP privadas
      const parts = hostname.split('.');
      if (parts.length === 4) {
        const p1 = parseInt(parts[0], 10);
        const p2 = parseInt(parts[1], 10);
        if (p1 === 10) return true;
        if (p1 === 192 && p2 === 168) return true;
        if (p1 === 172 && p2 >= 16 && p2 <= 31) return true;
      }

      return false;
    } catch (e) {
      return true; // Si no es parseable, asumimos que no es auditable
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLocalBlocked(false);
    setResult(null);

    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setError(
        locale === 'es'
          ? 'URL no válida o sospechosa. Por favor ingresa una dirección web estándar (ej: google.com) y evita caracteres especiales o scripts.'
          : 'Invalid or suspicious URL. Please enter a standard web address (e.g. google.com) and avoid special characters or scripts.'
      );
      return;
    }

    const targetUrl = validateAndFormatUrl(url);

    // Validar si es una URL local/privada
    if (isLocalUrl(targetUrl)) {
      setIsLocalBlocked(true);
      return;
    }

    setLoading(true);

    try {
      const apiLocale = locale === 'es' ? 'es' : 'en';
      // Leer API Key opcional de variables de entorno de Astro
      const apiKey = import.meta.env.PUBLIC_PAGESPEED_API_KEY || '';
      const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';

      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        targetUrl
      )}&category=performance&locale=${apiLocale}${keyParam}`;

      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error?.message || '';
        
        if (errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('limit')) {
          throw new Error(
            locale === 'es'
              ? 'Has excedido el límite de consultas diarias gratuitas de Google PageSpeed (Quota Exceeded). Para solucionar esto de forma ilimitada, crea una clave de API gratuita en Google Cloud Console e ingrésala en tu archivo de variables de entorno (.env) como PUBLIC_PAGESPEED_API_KEY.'
              : 'You have exceeded Google PageSpeed\'s daily anonymous query quota limit (Quota Exceeded). To fix this permanently, create a free API Key on Google Cloud Console and set it as PUBLIC_PAGESPEED_API_KEY in your .env file.'
          );
        }
        
        throw new Error(errMsg || (locale === 'es' ? 'Error al auditar la web. Verifica que sea una URL pública y esté activa.' : 'Failed to audit the website. Ensure it is a public URL and currently active.'));
      }

      const data = await res.json();
      
      const lighthouseResult = data.lighthouseResult;
      const performanceScore = Math.round((lighthouseResult.categories.performance.score || 0) * 100);

      const audits = lighthouseResult.audits;

      // Extraer métricas clave
      const metrics = {
        fcp: {
          val: audits['first-contentful-paint']?.displayValue || 'N/A',
          score: audits['first-contentful-paint']?.score ?? 0,
          title: audits['first-contentful-paint']?.title || 'First Contentful Paint'
        },
        lcp: {
          val: audits['largest-contentful-paint']?.displayValue || 'N/A',
          score: audits['largest-contentful-paint']?.score ?? 0,
          title: audits['largest-contentful-paint']?.title || 'Largest Contentful Paint'
        },
        tbt: {
          val: audits['total-blocking-time']?.displayValue || 'N/A',
          score: audits['total-blocking-time']?.score ?? 0,
          title: audits['total-blocking-time']?.title || 'Total Blocking Time'
        },
        cls: {
          val: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          score: audits['cumulative-layout-shift']?.score ?? 0,
          title: audits['cumulative-layout-shift']?.title || 'Cumulative Layout Shift'
        }
      };

      // Extraer oportunidades de optimización reales
      const opportunities = Object.entries(audits)
        .map(([id, audit]: [string, any]) => ({
          id,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
          score: audit.score ?? 0,
          savingsMs: audit.details?.overallSavingsMs,
          savingsBytes: audit.details?.overallSavingsBytes
        }))
        .filter(
          (audit) =>
            audit.score < 0.9 &&
            (audit.savingsMs !== undefined || audit.savingsBytes !== undefined || audit.displayValue)
        )
        .sort((a, b) => {
          if (a.savingsMs !== undefined && b.savingsMs !== undefined) {
            return b.savingsMs - a.savingsMs;
          }
          return a.score - b.score;
        })
        .slice(0, 5); // Limitar a las 5 oportunidades principales

      setResult({
        score: performanceScore,
        metrics,
        opportunities
      });
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getScoreColorText = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStrokeDash = (score: number) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight flex items-center justify-center gap-2 relative" id="analyzer-title-section">
          <span>{locale === 'es' ? 'Analizador de Velocidad Web' : 'Web Speed Analyzer'}</span>
          <div className="relative inline-block">
            <button
              type="button"
              onMouseEnter={() => setShowTechInfo(true)}
              onMouseLeave={() => setShowTechInfo(false)}
              onClick={() => setShowTechInfo(!showTechInfo)}
              className="text-[var(--text-secondary)]/50 hover:text-[var(--accent-primary)] transition-colors cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-white/5"
              aria-label="Info"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {showTechInfo && (
              <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 w-72 md:w-80 p-5 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-glass-border rounded-2xl shadow-2xl text-left text-xs leading-relaxed animate-[fadeIn_0.2s_ease-out_forwards] font-normal">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-3 border-b border-glass-border pb-2">
                  {locale === 'es' ? 'Detalles de la Herramienta' : 'Tool Architecture'}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'El Qué:' : 'The What:'}</span>
                    <p className="text-[var(--text-secondary)] mt-0.5">
                      {locale === 'es' 
                        ? 'Auditorías de rendimiento y Core Web Vitals en tiempo real utilizando datos de Google Lighthouse.' 
                        : 'Real-time performance and Core Web Vitals audits using Google Lighthouse data.'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'El Cómo:' : 'The How:'}</span>
                    <p className="text-[var(--text-secondary)] mt-0.5">
                      {locale === 'es' 
                        ? 'Consume la API oficial de Google PageSpeed de forma asíncrona mediante peticiones HTTPS seguras.' 
                        : 'Asynchronously queries Google PageSpeed\'s official API via secure HTTPS requests.'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'Seguridad:' : 'Security:'}</span>
                    <p className="text-[var(--text-secondary)] mt-0.5">
                      {locale === 'es' 
                        ? 'Input sanitizado que filtra y bloquea caracteres especiales, scripts (XSS) y protocolos maliciosos.' 
                        : 'Sanitized input filtering out special characters, scripts (XSS), and unsafe protocols.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </h1>

        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={startTutorial}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[var(--accent-primary)] to-teal-400 hover:from-[var(--accent-primary)]/90 hover:to-teal-400/90 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] shrink-0 border-0"
            title={locale === 'es' ? '¿Cómo usar esta herramienta? - Tutorial interactivo' : 'How to use this tool? - Interactive tour'}
          >
            <HelpCircle className="w-4 h-4 text-black" />
            <span>{locale === 'es' ? '¿Cómo usar?' : 'How to use?'}</span>
          </button>
        </div>

        <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          {locale === 'es'
            ? 'Inspecciona los Core Web Vitals y el rendimiento general de tu web con datos en tiempo real de Google Lighthouse.'
            : 'Audit Core Web Vitals and overall performance of your website with real-time data from Google Lighthouse.'}
        </p>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleAnalyze} className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              id="analyzer-input"
              type="text"
              placeholder={locale === 'es' ? 'Ingresa una URL (ej: google.com)' : 'Enter a URL (e.g. google.com)'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full h-14 pl-12 pr-12 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-primary)] transition-all duration-300 shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]/70" />
            <button
              type="button"
              onClick={handlePaste}
              title={locale === 'es' ? 'Pegar desde portapapeles' : 'Paste from clipboard'}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)]/70 hover:text-[var(--accent-primary)] hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
            >
              <Clipboard className="w-5 h-5" />
            </button>
          </div>
          <button
            id="analyzer-btn"
            type="submit"
            disabled={loading || !url.trim()}
            className="h-14 px-8 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{locale === 'es' ? 'Analizando...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>{locale === 'es' ? 'Analizar' : 'Analyze'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Blocked Local/Private IP Alert */}
      {isLocalBlocked && (
        <div className="max-w-2xl mx-auto mb-12 animate-[fadeIn_0.3s_ease-out_forwards]">
          <GlowCard className="border-amber-500/20 bg-amber-500/5">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                  {locale === 'es' ? 'Auditorías de Red Local Deshabilitadas' : 'Local Network Audits Disabled'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {locale === 'es'
                    ? 'Esta herramienta realiza el análisis a través del servicio en la nube de Google PageSpeed. Como el servicio se ejecuta en servidores externos, no es posible acceder a hosts locales de tu dispositivo (como localhost o IPs del tipo 192.168.*). Por favor, introduce una URL pública y accesible desde internet.'
                    : 'This tool performs the audit via Google PageSpeed cloud services. Since the service executes on external servers, it cannot access local hosts on your device (such as localhost or private IPs like 192.168.*). Please enter a public, internet-facing URL.'}
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="max-w-2xl mx-auto mb-12 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className="flex gap-3 p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="leading-relaxed">
              <p className="font-bold mb-1">{locale === 'es' ? 'Ocurrió un error en el análisis' : 'An error occurred during analysis'}</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State Skeleton */}
      {loading && (
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
          <div className="flex flex-col items-center justify-center p-8 bg-[var(--bg-secondary)] border border-glass-border rounded-3xl">
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/10" />
            </div>
            <div className="h-6 w-48 bg-white/10 rounded-full mb-2" />
            <div className="h-4 w-32 bg-white/5 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results Dashboard */}
      {result && (
        <div className="space-y-8 animate-[fadeIn_0.4s_ease-out_forwards]">
          
          {/* Main Score & Summary Card */}
          <div id="analyzer-score" className="p-8 bg-[var(--bg-secondary)] border border-glass-border rounded-3xl flex flex-col md:flex-row items-center justify-center gap-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            {/* Radial Performance Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="72"
                  cy="72"
                  r="50"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="8"
                />
                {/* Colored Score Arc */}
                <circle
                  cx="72"
                  cy="72"
                  r="50"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={getStrokeDash(result.score)}
                  className={`transition-all duration-1000 ease-out ${getScoreColorText(result.score)}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold tracking-tight ${getScoreColorText(result.score)}`}>
                  {result.score}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mt-0.5">
                  {locale === 'es' ? 'Rendimiento' : 'Performance'}
                </span>
              </div>
            </div>

            {/* Score interpretation */}
            <div className="text-center md:text-left max-w-sm">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center justify-center md:justify-start gap-2">
                <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
                {locale === 'es' ? 'Diagnóstico de Carga' : 'Load Diagnostics'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {result.score >= 90
                  ? (locale === 'es' ? '¡Excelente! El sitio web está optimizado correctamente y ofrece una velocidad excepcional que maximiza la experiencia del usuario.' : 'Excellent! The site is properly optimized, offering outstanding load speeds that maximize user experience.')
                  : result.score >= 50
                  ? (locale === 'es' ? 'El sitio tiene un rendimiento aceptable pero existen oportunidades de mejora clave para reducir los tiempos de bloqueo e interactividad.' : 'Performance is acceptable, but key opportunities exist to lower blocking and interactive times.')
                  : (locale === 'es' ? 'El rendimiento es crítico. Hay retrasos graves en el pintado de pantalla e interactividad que podrían perjudicar el SEO y la retención.' : 'Critical performance issues. Heavy delay in rendering and interactivity may hurt SEO and conversion.')}
              </p>
            </div>
          </div>

          {/* Share Report Section */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-glass-border rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 flex items-center justify-center sm:justify-start gap-2">
                <Share2 className="w-4 h-4 text-[var(--accent-primary)]" />
                {locale === 'es' ? '¿Te gusta el resultado? Comparte este informe' : 'Like the result? Share this report'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {locale === 'es' 
                  ? 'Envía las métricas de rendimiento por WhatsApp o correo electrónico.' 
                  : 'Send the performance metrics via WhatsApp or email.'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center">
              {/* WhatsApp Button */}
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* Email Button */}
              <a
                href={getEmailShareUrl()}
                className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" />
                <span>{locale === 'es' ? 'Correo' : 'Email'}</span>
              </a>

              {/* Native Share Button (if supported) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{locale === 'es' ? 'Compartir' : 'Share'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Core Web Vitals Grid */}
          <div id="analyzer-metrics">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[var(--accent-primary)]" />
              {locale === 'es' ? 'Métricas Core Web Vitals' : 'Core Web Vitals Metrics'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.metrics).map(([key, metric]) => {
                const metricScore = metric.score;
                const scoreColorClass =
                  metricScore >= 0.9
                    ? 'text-emerald-400 border-emerald-500/20'
                    : metricScore >= 0.5
                    ? 'text-amber-400 border-amber-500/20'
                    : 'text-rose-400 border-rose-500/20';

                return (
                  <div
                    key={key}
                    className="p-5 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl flex flex-col justify-between h-32 hover:border-white/10 transition-colors duration-300"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] line-clamp-1">
                        {metric.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
                        {key.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                      <span className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
                        {metric.val}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${metricScore >= 0.9 ? 'bg-emerald-400' : metricScore >= 0.5 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optimization Opportunities */}
          {result.opportunities.length > 0 && (
            <div id="analyzer-opportunities">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                {locale === 'es' ? 'Oportunidades de Optimización Clave' : 'Key Optimization Opportunities'}
              </h3>

              <div className="space-y-4">
                {result.opportunities.map((opt) => {
                  const savingsText = opt.savingsMs
                    ? `${locale === 'es' ? 'Ahorro:' : 'Savings:'} ${Math.round(opt.savingsMs)}ms`
                    : opt.savingsBytes
                    ? `${locale === 'es' ? 'Ahorro:' : 'Savings:'} ${Math.round(opt.savingsBytes / 1024)}KB`
                    : opt.displayValue;

                  return (
                    <div
                      key={opt.id}
                      className="p-5 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                          {opt.title}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {opt.description.replace(/\[Learn more\]\((.*?)\)\./g, '')}
                        </p>
                      </div>
                      
                      {savingsText && (
                        <div className="shrink-0 flex items-center gap-1.5 self-start md:self-center bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{savingsText}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
