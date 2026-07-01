import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/context';
import { 
  Radar, 
  ArrowLeftRight, 
  RefreshCw, 
  DollarSign, 
  Coins, 
  Info, 
  Calendar, 
  Building2, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity,
  Check,
  HelpCircle,
  X,
  Clipboard,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  Home
} from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import 'driver.js/dist/driver.css';
import { RainbowButton } from '../ui/rainbow-button';

interface Rate {
  market: string;
  type: string;
  mid: number;
  ask?: number;
  bid?: number;
  updated_at: string;
}

interface ApiResponse {
  rates: Rate[];
  index?: {
    value: number;
    as_of: string;
  };
  fetched_at: string;
}

const CACHE_KEY = 'cotizave_rates_cache';
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const COOLDOWN_TIME = 15; // Cooldown in seconds for manual refresh

export default function RadarCalculator({ standalone = false, pwaMode = false }: { standalone?: boolean; pwaMode?: boolean }) {
  const { locale } = useI18n();
  const [ratesData, setRatesData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedStatus, setCachedStatus] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState(0);
  const [previousRates, setPreviousRates] = useState<Record<string, number>>({});

  // Calculator State
  const [amount, setAmount] = useState<string>('100');
  const [isUsdToVes, setIsUsdToVes] = useState<boolean>(true);
  const [selectedMarket, setSelectedMarket] = useState<string>('reference');
  const [customRate, setCustomRate] = useState<string>('');
  const [showTechInfo, setShowTechInfo] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [viewport, setViewport] = useState({ offsetLeft: 0, offsetTop: 0, width: 0 });
  const [copiedResult, setCopiedResult] = useState(false);
  const isFirstRender = useRef(true);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone || document.referrer.includes('android-app://');
    if (!isStandalone) {
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    try {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } else {
        setShowInstallGuide(true);
      }
    } catch (error) {
      console.error('Error with native install prompt:', error);
      setShowInstallGuide(true);
    }
  };

  const startTutorial = async () => {
    const { driver } = await import('driver.js');
    const driverObj = driver({
      showProgress: true,
      nextBtnText: locale === 'es' ? 'Siguiente' : 'Next',
      prevBtnText: locale === 'es' ? 'Anterior' : 'Prev',
      doneBtnText: locale === 'es' ? 'Finalizar' : 'Done',
      steps: [
        {
          element: '#radar-title-section',
          popover: {
            title: locale === 'es' ? '¡Bienvenido al Radar!' : 'Welcome to Radar!',
            description: locale === 'es' ? 'Esta herramienta te permite comparar y calcular conversiones de divisas en Venezuela usando múltiples tasas en tiempo real.' : 'This tool allows you to compare and calculate currency conversions in Venezuela using multiple rates in real-time.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: window.innerWidth < 1024 ? '#radar-mobile-pill' : '#radar-desktop-list',
          popover: {
            title: locale === 'es' ? 'Tasas de Referencia' : 'Reference Rates',
            description: locale === 'es' ? 'Aquí ves los valores actualizados del BCV (Dólar y Euro), el dólar paralelo y Binance P2P.' : 'Here you can see the updated rates for BCV (USD & EUR), Parallel dollar, and Binance P2P.',
            side: window.innerWidth < 1024 ? 'bottom' : 'left',
            align: 'center'
          }
        },
        {
          element: '#radar-direction-selector',
          popover: {
            title: locale === 'es' ? 'Dirección de Conversión' : 'Conversion Direction',
            description: locale === 'es' ? 'Presiona este botón para alternar entre convertir de Dólares a Bolívares o de Bolívares a Dólares.' : 'Press this button to toggle between converting from Dollars to Bolivars or from Bolivars to Dollars.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#radar-input-amount',
          popover: {
            title: locale === 'es' ? 'Ingresa el Monto' : 'Enter the Amount',
            description: locale === 'es' ? 'Ingresa aquí el monto que deseas convertir. Este campo tiene un borde verde resaltado para que lo ubiques fácilmente.' : 'Enter the amount you want to convert here. This field has a highlighted green border for easy spotting.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#radar-rate-selector',
          popover: {
            title: locale === 'es' ? 'Selecciona la Tasa' : 'Select the Rate',
            description: locale === 'es' ? 'Elige cuál tasa deseas usar para el cálculo. También puedes seleccionar "Tasa Personalizada" y escribir tu propio valor.' : 'Choose which rate to use for calculation. You can also select "Custom Rate" and type your own value.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#radar-result',
          popover: {
            title: locale === 'es' ? 'Resultado de Conversión' : 'Conversion Result',
            description: locale === 'es' ? 'Aquí se muestra el resultado final el cual es calculado al instante con la tasa seleccionada.' : 'Here is the final result calculated instantly using the selected rate.',
            side: 'top',
            align: 'center'
          }
        }
      ]
    });
    driverObj.drive();
  };

  // Load rates on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prevCached = localStorage.getItem(CACHE_KEY + '_prev');
      if (prevCached) {
        try {
          setPreviousRates(JSON.parse(prevCached));
        } catch (e) {}
      }
    }
    fetchRates();
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Track visualViewport dimensions and offset for mobile floating result bubble
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportChange = () => {
      setViewport({
        offsetLeft: vv.offsetLeft,
        offsetTop: vv.offsetTop,
        width: vv.width
      });
    };

    vv.addEventListener('resize', handleViewportChange);
    vv.addEventListener('scroll', handleViewportChange);
    
    // Set initial
    handleViewportChange();

    return () => {
      vv.removeEventListener('resize', handleViewportChange);
      vv.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  // Interactive bubble auto-fade trigger on mobile
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsBubbleVisible(true);
      
      if (!isInputFocused) {
        const timer = setTimeout(() => {
          setIsBubbleVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [amount, selectedMarket, isUsdToVes, isInputFocused]);

  const fetchRates = async (force = false) => {
    setLoading(true);
    setError(null);

    // Try reading cache if not forced
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < CACHE_TIME && data && data.rates && data.rates.length > 0) {
            setRatesData(data);
            setCachedStatus(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse cached rates', e);
        }
      }
    }

    try {
      const res = await fetch('/api/rates');

      if (!res.ok) {
        throw new Error(
          locale === 'es'
            ? 'Error al conectar con la API de Cotizave. Límite de cuota excedido o servicio temporalmente caído.'
            : 'Failed to connect to Cotizave API. Quota limit reached or service is down.'
        );
      }

      const data: ApiResponse = await res.json();
      if (!data || !data.rates || data.rates.length === 0) {
        throw new Error(
          locale === 'es' ? 'Datos de tasas vacíos o inválidos.' : 'Empty or invalid rates data.'
        );
      }

      const currentCache = localStorage.getItem(CACHE_KEY);
      if (currentCache) {
        try {
          const { data: oldData } = JSON.parse(currentCache);
          if (oldData && oldData.rates) {
            const prev: Record<string, number> = {};
            oldData.rates.forEach((r: Rate) => {
              prev[r.market] = r.mid;
            });
            setPreviousRates(prev);
            localStorage.setItem(CACHE_KEY + '_prev', JSON.stringify(prev));
          }
        } catch (e) {}
      }

      setRatesData(data);
      setCachedStatus(false);
      
      // Store in Cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      // Trigger cooldown for manual refreshes
      if (force) {
        setCooldown(COOLDOWN_TIME);
      }
    } catch (err: any) {
      setError(err.message || 'Error');
      // If error occurs, fallback to expired cache if available
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          setRatesData(data);
          setCachedStatus(true);
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    if (cooldown > 0 || loading) return;
    fetchRates(true);
  };

  // Safe Input Validation & Sanitization
  const handleAmountChange = (val: string) => {
    // Sanitize input: allow only digits and at most one decimal separator (dot or comma, normalized to dot)
    let sanitized = val.replace(/,/g, '.');
    
    // Prevent typing anything that is not a number or decimal point
    sanitized = sanitized.replace(/[^0-9.]/g, '');

    // Allow only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit maximum length to 12 digits (prevent ridiculous numbers and layout breaking)
    if (sanitized.replace('.', '').length > 12) {
      return;
    }

    setAmount(sanitized);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleAmountChange(text);
        }
      } else {
        alert(
          locale === 'es'
            ? 'Tu navegador no permite acceder al portapapeles automáticamente. Por favor, pega el monto manualmente.'
            : 'Your browser does not allow clipboard access. Please paste the amount manually.'
        );
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleCopyResult = async () => {
    const valueToCopy = calculateConversion();
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch (err) {
      console.error('Failed to copy result:', err);
    }
  };

  const handleCustomRateChange = (val: string) => {
    let sanitized = val.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    if (sanitized.replace('.', '').length > 8) {
      return;
    }
    setCustomRate(sanitized);
  };

  const getMarketRateValue = (marketKey: string): number => {
    if (marketKey === 'custom') {
      return parseFloat(customRate) || 0;
    }
    if (!ratesData) return 0;
    
    if (marketKey === 'index' && ratesData.index) {
      return ratesData.index.value;
    }

    const rateObj = ratesData.rates.find(r => r.market === marketKey);
    return rateObj ? rateObj.mid : 0;
  };

  const getActiveRate = (): number => {
    return getMarketRateValue(selectedMarket);
  };

  const calculateConversion = (overrideRate?: number): string => {
    const numericAmount = parseFloat(amount) || 0;
    const rate = overrideRate !== undefined ? overrideRate : getActiveRate();
    if (rate === 0) return '0.00';

    if (isUsdToVes) {
      return (numericAmount * rate).toLocaleString(locale === 'es' ? 'es-VE' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      return (numericAmount / rate).toLocaleString(locale === 'es' ? 'es-VE' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  };

  const formatMarketName = (market: string): string => {
    switch (market) {
      case 'reference': return locale === 'es' ? 'BCV (Dólar)' : 'BCV (USD)';
      case 'eur_reference': return locale === 'es' ? 'BCV (Euro)' : 'BCV (EUR)';
      case 'parallel': return locale === 'es' ? 'Dólar Paralelo' : 'Parallel Dollar';
      case 'binance': return 'Binance P2P';
      case 'bybit': return 'Bybit P2P';
      case 'okx': return 'OKX P2P';
      case 'bitget': return 'Bitget P2P';
      case 'mexc': return 'MEXC P2P';
      case 'bingx': return 'BingX P2P';
      case 'saldo': return 'Saldo.com.ar';
      case 'index': return locale === 'es' ? 'Índice Cotizave' : 'Cotizave Index';
      default: return market.toUpperCase();
    }
  };

  const getRateUpdatedAt = (marketKey: string): string => {
    if (!ratesData) return '';
    if (marketKey === 'index' && ratesData.index) {
      return new Date(ratesData.index.as_of).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const rateObj = ratesData.rates.find(r => r.market === marketKey);
    if (!rateObj) return '';
    return new Date(rateObj.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getShortMarketName = (market: string): string => {
    switch (market) {
      case 'reference': return 'BCV Dólar';
      case 'eur_reference': return 'BCV Euro';
      case 'parallel': return 'Paralelo';
      case 'binance': return 'Binance';
      case 'custom': return locale === 'es' ? 'Pers.' : 'Cust.';
      default: return market.toUpperCase();
    }
  };

  const toggleDirection = () => {
    setIsUsdToVes(!isUsdToVes);
  };

  const renderTrendIndicator = (market: string) => {
    if (!ratesData || !previousRates[market]) return null;
    const currentRate = ratesData.rates.find(r => r.market === market)?.mid;
    if (!currentRate) return null;
    
    const prevRate = previousRates[market];
    if (currentRate - prevRate > 0.0001) {
      return <ArrowUp className="w-3.5 h-3.5 text-emerald-500 inline-block ml-1 animate-[fadeIn_0.5s_ease-out]" title={locale === 'es' ? 'Subió respecto a la actualización anterior' : 'Increased since last update'} />;
    } else if (prevRate - currentRate > 0.0001) {
      return <ArrowDown className="w-3.5 h-3.5 text-rose-500 inline-block ml-1 animate-[fadeIn_0.5s_ease-out]" title={locale === 'es' ? 'Bajó respecto a la actualización anterior' : 'Decreased since last update'} />;
    }
    return null;
  const resultBlock = (
    <div id="radar-result" className={`p-4 md:p-6 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-teal-500/5 border border-[#10B981]/25 ${pwaMode ? 'mb-4 w-full animate-[fadeIn_0.3s_ease-out]' : 'mt-4'}`}>
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          {locale === 'es' ? 'Resultado de Conversión' : 'Conversion Result'}
        </span>
        
        {/* Grand Conversion Value */}
        <div className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mt-2 tracking-tight flex items-center justify-center gap-2">
          <span>{isUsdToVes ? 'Bs.' : '$'}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-teal-400">
            {calculateConversion()}
          </span>
          <button
            type="button"
            onClick={handleCopyResult}
            className="p-1.5 rounded-lg text-[var(--text-secondary)]/50 hover:text-[#10B981] hover:bg-white/5 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
            title={locale === 'es' ? 'Copiar al portapapeles' : 'Copy to clipboard'}
            aria-label="Copy conversion result"
          >
            {copiedResult ? (
              <Check className="w-5 h-5 text-[#10B981] animate-[zoomIn_0.2s_ease-out]" />
            ) : (
              <Copy className="w-5 h-5 hover:scale-105 transition-transform" />
            )}
          </button>
        </div>

        <div className="text-[10px] font-mono text-[var(--text-secondary)]/80 mt-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>
            {locale === 'es' 
              ? `Calculado a tasa: ${formatMarketName(selectedMarket)} (${getActiveRate().toFixed(2)} Bs.)`
              : `Calculated at rate: ${formatMarketName(selectedMarket)} (${getActiveRate().toFixed(2)} Bs.)`}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Interactive Mobile Result Bubble */}
      {isBubbleVisible && !pwaMode && (
        <div 
          className={`lg:hidden fixed z-40 bg-[var(--glass-bg)] backdrop-blur-xl border border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.25)] px-5 py-2.5 rounded-full flex items-center gap-2.5 whitespace-nowrap select-none transition-all duration-300 ${!pwaMode ? 'animate-bounce-in' : ''}`}
          style={{ 
            top: typeof window !== 'undefined' && window.visualViewport 
              ? `${viewport.offsetTop + (viewport.offsetTop > 10 ? 12 : 96)}px` 
              : '96px',
            left: typeof window !== 'undefined' && window.visualViewport && viewport.width > 0
              ? `${viewport.width / 2 + viewport.offsetLeft}px` 
              : '50%',
            transform: 'translate(-50%, 0)'
          }}
        >
          <span className="text-[10px] font-bold text-[var(--text-secondary)]/90 uppercase tracking-wider">
            {getShortMarketName(selectedMarket)}:
          </span>
          <span className="text-sm font-black text-[var(--text-primary)]">
            {isUsdToVes ? 'Bs.' : '$'}
          </span>
          <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {calculateConversion()}
          </span>
          <div className="w-px h-4 bg-glass-border mx-1"></div>
          <button
            type="button"
            onClick={handleCopyResult}
            className="text-[var(--text-secondary)] hover:text-[#10B981] active:scale-95 transition-all p-1"
            aria-label="Copy result"
          >
            {copiedResult ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
      {/* Header */}
      <div className={`text-center flex flex-col items-center justify-center relative pt-8 ${pwaMode ? 'mb-4' : 'mb-12'}`}>
        {/* Top Navigation / App Actions */}
        {!standalone && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[#10B981] transition-colors p-2 bg-[var(--bg-secondary)] border border-glass-border rounded-xl"
              title={locale === 'es' ? 'Volver al Inicio' : 'Back to Home'}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === 'es' ? 'Inicio' : 'Home'}</span>
            </a>

            {isInstallable && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer relative z-50"
              >
                <Download className="w-4 h-4" />
                <span>{locale === 'es' ? 'Instalar App' : 'Install App'}</span>
              </button>
            )}
          </div>
        )}

        <h1 className={`text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight flex items-center justify-center gap-2 relative ${standalone ? 'mt-2' : 'mt-8 md:mt-4'}`} id="radar-title-section">
          <span>{locale === 'es' ? 'Radar de Cotizaciones' : 'Rates Radar'}</span>
          <div className="inline-block">
            <button
              type="button"
              onClick={() => setShowTechInfo(true)}
              className="text-[var(--text-secondary)]/50 hover:text-[var(--accent-primary)] transition-colors cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-white/5"
              aria-label="Info"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {showTechInfo && (
              <div 
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
                onClick={() => setShowTechInfo(false)}
              >
                <div 
                  className="bg-[var(--bg-secondary)] border border-glass-border rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-left text-xs leading-relaxed font-normal animate-[zoomIn_0.2s_ease-out]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    type="button"
                    onClick={() => setShowTechInfo(false)}
                    className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-purple-400 mb-4 border-b border-glass-border pb-2">
                    {locale === 'es' ? 'Arquitectura de Radar' : 'Radar Architecture'}
                  </h4>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'Tecnología:' : 'Technology:'}</span>
                      <p className="text-[var(--text-secondary)] mt-1">
                        {locale === 'es' 
                          ? 'Integración directa con Cotizave API mediante llamadas HTTPS seguras.' 
                          : 'Direct secure integration with Cotizave API using HTTPS requests.'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'Optimización:' : 'Optimization:'}</span>
                      <p className="text-[var(--text-secondary)] mt-1">
                        {locale === 'es' 
                          ? 'Caché local (localStorage) de 10 minutos para ahorrar cuota y acelerar la carga de la página.' 
                          : '10-minute local cache (localStorage) to save API quota and accelerate page speed.'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{locale === 'es' ? 'Seguridad:' : 'Security:'}</span>
                      <p className="text-[var(--text-secondary)] mt-1">
                        {locale === 'es' 
                          ? 'Sanitización estricta de inputs numéricos en cliente, previniendo inyección de scripts.' 
                          : 'Strict client-side numerical input sanitization preventing script injection.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </h1>

        <div className="mb-6 flex justify-center">
          <RainbowButton
            variant="default"
            onClick={startTutorial}
            className="rounded-full px-6 py-4 text-xs md:text-sm hover:scale-105 active:scale-95 transition-transform duration-300 font-semibold cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center gap-1.5 shrink-0"
            title={locale === 'es' ? '¿Cómo usar esta herramienta? - Tutorial interactivo' : 'How to use this tool? - Interactive tour'}
          >
            <HelpCircle className="w-4 h-4 text-[var(--accent-primary)] animate-pulse" />
            <span>{locale === 'es' ? '¿Cómo usar?' : 'How to use?'}</span>
          </RainbowButton>
        </div>

        {!pwaMode && (
          <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            {locale === 'es' 
              ? 'Calculadora de Dólar y Bolívar en tiempo real. Obtén valores exactos comparando el BCV oficial, el paralelo y el promedio P2P al instante.'
              : 'Real-time Dollar & Bolivar calculator. Get instant conversion results across official BCV, Parallel average, and P2P exchange rates.'}
          </p>
        )}
      </div>

      {/* Main Grid: Calculator & Rates Ticker */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${pwaMode ? 'mb-0 lg:mb-12' : 'mb-12'}`}>
        
        {/* Left Panel: Calculator Card */}
        <div className="lg:col-span-7">
          {ratesData && !pwaMode && (
            <div className="lg:hidden flex justify-center mb-3 w-full animate-[fadeIn_0.3s_ease-out]" id="radar-mobile-pill">
              <div className="bg-[var(--glass-bg)] border border-glass-border backdrop-blur-xl p-2.5 rounded-2xl w-full max-w-sm shadow-xl grid grid-cols-2 gap-2 text-xs font-bold text-[var(--text-secondary)]">
                {/* BCV Dólar */}
                <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 shadow-[0_0_10px_rgba(0,242,254,0.05)]">
                  <span className="text-[8px] text-[var(--accent-primary)] uppercase tracking-wider mb-0.5">BCV Dólar</span>
                  <span className="text-[var(--accent-primary)] text-sm sm:text-base font-black tracking-tight flex items-center justify-center gap-1">{getMarketRateValue('reference').toFixed(2)} Bs.{renderTrendIndicator('reference')}</span>
                </div>
                {/* BCV Euro */}
                <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-purple-500/5 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.05)]">
                  <span className="text-[8px] text-purple-400 uppercase tracking-wider mb-0.5">BCV Euro</span>
                  <span className="text-purple-400 text-sm sm:text-base font-black tracking-tight flex items-center justify-center gap-1">{getMarketRateValue('eur_reference').toFixed(2)} Bs.{renderTrendIndicator('eur_reference')}</span>
                </div>
                {/* Binance P2P */}
                <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                  <span className="text-[8px] text-emerald-400 uppercase tracking-wider mb-0.5">Binance P2P</span>
                  <span className="text-emerald-400 text-sm sm:text-base font-black tracking-tight flex items-center justify-center gap-1">{getMarketRateValue('binance').toFixed(2)} Bs.{renderTrendIndicator('binance')}</span>
                </div>
                {/* Paralelo */}
                <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/[0.02] border border-glass-border">
                  <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Paralelo</span>
                  <span className="text-[var(--text-primary)] text-sm sm:text-base font-black tracking-tight flex items-center justify-center gap-1">{getMarketRateValue('parallel').toFixed(2)} Bs.{renderTrendIndicator('parallel')}</span>
                </div>
              </div>
            </div>
          )}
          {pwaMode && resultBlock}
          
          <GlowCard className="border border-glass-border h-auto lg:h-full flex flex-col justify-between">
            <div>
              {/* Card Title Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#10B981]" />
                  <span className="font-bold text-[var(--text-primary)]">
                    {locale === 'es' ? 'Conversor Inteligente' : 'Smart Converter'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#10B981]/15 text-[#10B981] px-2.5 py-0.5 rounded-full border border-[#10B981]/20 font-mono text-[9px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  {locale === 'es' ? 'En Vivo' : 'Live'}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="flex items-center justify-between text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase mb-2">
                  <span>{locale === 'es' ? 'Monto a Convertir' : 'Amount to Convert'}</span>
                  <span className="text-[8px] sm:text-[10px] whitespace-nowrap font-extrabold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/25 animate-pulse">
                    {locale === 'es' ? 'Ingresa el monto aquí' : 'Enter amount here'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="radar-input-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                    placeholder="100"
                    className="w-full h-14 pl-12 pr-24 bg-[var(--bg-secondary)]/85 border-2 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-xl text-lg font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all duration-300"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-[var(--text-secondary)]/80 font-bold text-sm">
                    {isUsdToVes ? <DollarSign className="w-5 h-5" /> : <span className="text-xs">Bs.</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handlePaste}
                    title={locale === 'es' ? 'Pegar desde portapapeles' : 'Paste from clipboard'}
                    className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)]/70 hover:text-[#10B981] hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/50 text-xs font-bold font-mono">
                    {isUsdToVes ? 'USD' : 'VES'}
                  </div>
                </div>
              </div>

              {/* Shortcut buttons */}
              <div className="grid grid-cols-5 gap-1.5 mb-6 w-full">
                {['1', '10', '50', '100', '500'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 px-1 rounded-lg border text-[10px] sm:text-xs font-bold transition-all text-center truncate hover:-translate-y-0.5 cursor-pointer w-full min-w-0 ${
                      amount === val
                        ? 'bg-[#10B981] text-black border-[#10B981] shadow-md shadow-[#10B981]/20'
                        : 'bg-white/5 text-[var(--text-primary)] border-glass-border hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    {isUsdToVes ? `$${val}` : `${val} Bs.`}
                  </button>
                ))}
              </div>

              {/* Conversion Direction Selector */}
              <div id="radar-direction-selector" className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-white/[0.02] border border-glass-border">
                <div className="flex-1 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                    {locale === 'es' ? 'Tengo' : 'From'}
                  </span>
                  <span className="text-xl font-extrabold text-[var(--text-primary)]">
                    {isUsdToVes ? 'USD ($)' : 'VES (Bs.)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleDirection}
                  className="w-10 h-10 rounded-full border border-glass-border hover:border-[#10B981]/50 hover:bg-[#10B981]/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[#10B981] active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
                  aria-label="Switch conversion direction"
                >
                  <ArrowLeftRight className={`w-4 h-4 transition-transform duration-500 ${isUsdToVes ? '' : 'rotate-180'}`} />
                </button>

                <div className="flex-1 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                    {locale === 'es' ? 'Quiero' : 'To'}
                  </span>
                  <span className="text-xl font-extrabold text-[var(--text-primary)]">
                    {isUsdToVes ? 'VES (Bs.)' : 'USD ($)'}
                  </span>
                </div>
              </div>

              {/* Active Rate Selector */}
              <div id="radar-rate-selector" className="mb-6">
                <label className="block text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase mb-2">
                  {locale === 'es' ? 'Tasa de Referencia Activa' : 'Active Exchange Rate'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMarket('reference')}
                    className={`relative p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-200 ${
                      selectedMarket === 'reference'
                        ? 'bg-[#10B981]/25 border-[#10B981] text-[var(--text-primary)] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-white/[0.02] border-glass-border text-[var(--text-secondary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pr-6">BCV (Dólar)</span>
                    <span className="text-sm font-extrabold mt-1 text-[var(--text-primary)] flex items-center">
                      {getMarketRateValue('reference') > 0 ? (
                        <>{getMarketRateValue('reference').toFixed(2)} Bs.{renderTrendIndicator('reference')}</>
                      ) : '---'}
                    </span>
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      selectedMarket === 'reference'
                        ? 'border-[#10B981] bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'border-glass-border bg-white/[0.03]'
                    }`}>
                      {selectedMarket === 'reference' && <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMarket('eur_reference')}
                    className={`relative p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-200 ${
                      selectedMarket === 'eur_reference'
                        ? 'bg-purple-500/25 border-purple-500 text-[var(--text-primary)] shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                        : 'bg-white/[0.02] border-glass-border text-[var(--text-secondary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pr-6">BCV (Euro)</span>
                    <span className="text-sm font-extrabold mt-1 text-purple-400 flex items-center">
                      {getMarketRateValue('eur_reference') > 0 ? (
                        <>{getMarketRateValue('eur_reference').toFixed(2)} Bs.{renderTrendIndicator('eur_reference')}</>
                      ) : '---'}
                    </span>
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      selectedMarket === 'eur_reference'
                        ? 'border-purple-500 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                        : 'border-glass-border bg-white/[0.03]'
                    }`}>
                      {selectedMarket === 'eur_reference' && <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMarket('binance')}
                    className={`relative p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-200 ${
                      selectedMarket === 'binance'
                        ? 'bg-emerald-500/25 border-emerald-500 text-[var(--text-primary)] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-white/[0.02] border-glass-border text-[var(--text-secondary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pr-6">Binance P2P</span>
                    <span className="text-sm font-extrabold mt-1 text-emerald-400 flex items-center">
                      {getMarketRateValue('binance') > 0 ? (
                        <>{getMarketRateValue('binance').toFixed(2)} Bs.{renderTrendIndicator('binance')}</>
                      ) : '---'}
                    </span>
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      selectedMarket === 'binance'
                        ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'border-glass-border bg-white/[0.03]'
                    }`}>
                      {selectedMarket === 'binance' && <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMarket('parallel')}
                    className={`relative p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-200 ${
                      selectedMarket === 'parallel'
                        ? 'bg-[var(--accent-primary)]/25 border-[var(--accent-primary)] text-[var(--text-primary)] shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                        : 'bg-white/[0.02] border-glass-border text-[var(--text-secondary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pr-6">Paralelo</span>
                    <span className="text-sm font-extrabold mt-1 text-[var(--accent-primary)] flex items-center">
                      {getMarketRateValue('parallel') > 0 ? (
                        <>{getMarketRateValue('parallel').toFixed(2)} Bs.{renderTrendIndicator('parallel')}</>
                      ) : '---'}
                    </span>
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      selectedMarket === 'parallel'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] shadow-[0_0_8px_rgba(0,242,254,0.3)]'
                        : 'border-glass-border bg-white/[0.03]'
                    }`}>
                      {selectedMarket === 'parallel' && <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMarket('custom')}
                    className={`relative p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer col-span-2 sm:col-span-2 hover:scale-[1.02] active:scale-[0.98] duration-200 ${
                      selectedMarket === 'custom'
                        ? 'bg-[#10B981]/25 border-[#10B981] text-[var(--text-primary)] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-white/[0.02] border-glass-border text-[var(--text-secondary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pr-6">
                      {locale === 'es' ? 'Tasa Personalizada' : 'Custom Rate'}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={customRate}
                        placeholder="0.00"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMarket('custom');
                        }}
                        onChange={(e) => handleCustomRateChange(e.target.value)}
                        className="bg-transparent border-b border-white/20 text-sm font-extrabold w-16 text-[var(--text-primary)] focus:outline-none focus:border-[#10B981]"
                      />
                      <span className="text-xs">Bs.</span>
                    </div>
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      selectedMarket === 'custom'
                        ? 'border-[#10B981] bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'border-glass-border bg-white/[0.03]'
                    }`}>
                      {selectedMarket === 'custom' && <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Conversion Result Block */}
            {!pwaMode && resultBlock}
          </GlowCard>
        </div>

        {/* Right Panel: Ticker / Rates List */}
        <div className={`lg:col-span-5 flex-col gap-6 ${pwaMode ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Connection Status & Manual Refresh */}
          <div className="p-4 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center ${cachedStatus ? 'bg-amber-400/10' : 'bg-emerald-400/10'}`}>
                <span className={`w-2 h-2 rounded-full ${cachedStatus ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  {cachedStatus 
                    ? (locale === 'es' ? 'Cargado desde Caché Local' : 'Loaded from Local Cache')
                    : (locale === 'es' ? 'Conexión Segura Directa' : 'Direct Secure Connection')}
                </p>
                <p className="text-[9px] text-[var(--text-secondary)] truncate">
                  {locale === 'es' 
                    ? (cachedStatus ? 'La caché se actualiza cada 10 min' : 'Tasas en vivo sincronizadas') 
                    : (cachedStatus ? 'Cache refreshes every 10 min' : 'Live rates synchronized')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={loading || cooldown > 0}
              className={`h-9 px-3 rounded-lg border border-glass-border flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-primary)] bg-white/5 transition-all duration-300 shadow-sm shrink-0 ${
                cooldown > 0 || loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#10B981]/15 hover:border-[#10B981]/30 hover:text-[#10B981] active:scale-95 cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{cooldown > 0 ? `${cooldown}s` : (locale === 'es' ? 'Actualizar' : 'Refresh')}</span>
            </button>
          </div>

          {/* Rates Ticker List */}
          <div id="radar-desktop-list" className="p-5 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl lg:flex-1 flex flex-col shadow-lg">
            <h3 className="text-xs font-extrabold tracking-wider text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-2 pb-3 border-b border-glass-border">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span>{locale === 'es' ? 'Tasas de Cambio Oficiales y P2P' : 'Official & P2P Rates'}</span>
            </h3>

            {loading && !ratesData ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-50 py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#10B981]" />
                <span className="text-xs font-bold">{locale === 'es' ? 'Descargando tasas...' : 'Fetching rates...'}</span>
              </div>
            ) : error && !ratesData ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 border border-rose-500/10 bg-rose-500/5 rounded-xl text-center">
                <span className="text-xs text-rose-400 font-bold leading-relaxed">{error}</span>
                <button
                  onClick={() => fetchRates(true)}
                  className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-rose-500/30 cursor-pointer"
                >
                  {locale === 'es' ? 'Reintentar' : 'Retry'}
                </button>
              </div>
            ) : ratesData ? (
              <div className="space-y-3 flex-1">
                {/* BCV */}
                {(() => {
                  const orderedMarkets = ['reference', 'eur_reference', 'binance', 'parallel', 'bybit', 'okx', 'bitget', 'mexc'];
                  return ratesData.rates
                    .filter(r => orderedMarkets.includes(r.market))
                    .sort((a, b) => orderedMarkets.indexOf(a.market) - orderedMarkets.indexOf(b.market))
                    .map((rate) => {
                      const isSelected = selectedMarket === rate.market;
                      return (
                        <div
                          key={rate.market}
                          onClick={() => setSelectedMarket(rate.market)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-[#10B981]/50 bg-[#10B981]/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                              : 'border-glass-border bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              rate.market === 'reference' 
                                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20' 
                                : rate.market === 'parallel' 
                                ? 'bg-blue-500/10 text-blue-400' 
                                : 'bg-purple-500/10 text-purple-400'
                            }`}>
                              {rate.market === 'reference' ? (
                                <Building2 className="w-4 h-4" />
                              ) : (
                                <Coins className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                                  {formatMarketName(rate.market)}
                                </span>
                                {rate.market === 'parallel' && (
                                  <div className="relative group/tooltip inline-flex items-center">
                                    <Info className="w-3.5 h-3.5 text-[var(--text-secondary)]/50 hover:text-[#10B981] transition-colors cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-[var(--bg-secondary)]/95 backdrop-blur-md border border-glass-border rounded-xl shadow-2xl text-[10px] text-[var(--text-secondary)] leading-relaxed opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 whitespace-normal font-normal">
                                      {locale === 'es' 
                                        ? 'El dólar paralelo venezolano no es un orderbook. Es un promedio de fuentes públicas que se ajustan varias veces al día, no cada minuto. 25 min captura los movimientos reales sin añadir ruido.'
                                        : 'The Venezuelan parallel dollar is not an orderbook. It is an average of public sources adjusted a few times a day, not every minute. 25 min captures real movements without adding noise.'}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-[9px] text-[var(--text-secondary)] font-mono flex items-center gap-1 mt-0.5">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{getRateUpdatedAt(rate.market)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-2">
                            <div>
                              <p className="text-xs font-black text-[var(--text-primary)] flex items-center justify-end">
                                {rate.mid.toFixed(2)} Bs.{renderTrendIndicator(rate.market)}
                              </p>
                              {rate.ask && rate.bid && (
                                <p className="text-[8px] text-[var(--text-secondary)] font-mono">
                                  B: {rate.bid.toFixed(1)} / A: {rate.ask.toFixed(1)}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-black shadow-sm">
                                <Check className="w-2.5 h-2.5 stroke-[4px]" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            ) : null}

            {/* API Citation Link */}
            {ratesData && (
              <div className="mt-4 pt-3 border-t border-glass-border flex justify-end text-[9px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                <a
                  href="https://cotizave.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#10B981] flex items-center gap-1 transition-colors"
                >
                  <span>API: cotizave.com</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Market Equivalency Table */}
      {ratesData && !standalone && (
        <div className="animate-[fadeIn_0.5s_ease-out_forwards] mb-12">
          <h3 className="text-sm font-extrabold tracking-wider text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#10B981]" />
            <span>{locale === 'es' ? 'Comparativa de Equivalencia por Tasa' : 'Rate Equivalency Comparison'}</span>
          </h3>

          <div className="overflow-hidden border border-glass-border rounded-2xl bg-[var(--bg-secondary)] shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border bg-white/[0.02]">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {locale === 'es' ? 'Mercado/Tasa' : 'Market/Rate'}
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] text-right">
                      {locale === 'es' ? 'Valor Tasa' : 'Rate Value'}
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] text-right">
                      {locale === 'es' ? 'Monto Convertido' : 'Converted Amount'}
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] text-center">
                      {locale === 'es' ? 'Diferencia vs BCV' : 'Diff vs BCV'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {(() => {
                    const orderedMarkets = ['reference', 'eur_reference', 'binance', 'parallel', 'bybit'];
                    return ratesData.rates
                      .filter(r => orderedMarkets.includes(r.market))
                      .sort((a, b) => orderedMarkets.indexOf(a.market) - orderedMarkets.indexOf(b.market))
                      .map((rate) => {
                        const bcvRate = getMarketRateValue('reference');
                        const diffPct = bcvRate > 0 ? ((rate.mid - bcvRate) / bcvRate) * 100 : 0;
                        
                        return (
                          <tr
                            key={rate.market}
                            className="hover:bg-white/[0.01] transition-colors"
                          >
                            <td className="p-4 text-xs font-bold text-[var(--text-primary)]">
                              {formatMarketName(rate.market)}
                            </td>
                            <td className="p-4 text-xs font-mono text-[var(--text-primary)] text-right flex items-center justify-end">
                              {rate.mid.toFixed(4)} Bs.{renderTrendIndicator(rate.market)}
                            </td>
                            <td className="p-4 text-xs font-bold text-[var(--text-primary)] text-right font-mono">
                              {isUsdToVes ? 'Bs.' : '$'} {calculateConversion(rate.mid)}
                            </td>
                            <td className="p-4 text-xs font-semibold text-center font-mono">
                              {(rate.market === 'reference' || rate.market === 'eur_reference') ? (
                                <span className="text-[var(--text-secondary)]/40">-</span>
                              ) : diffPct >= 0 ? (
                                <span className="text-emerald-400">+{diffPct.toFixed(2)}%</span>
                              ) : (
                                <span className="text-rose-400">{diffPct.toFixed(2)}%</span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      {!standalone && (
        <div className="mt-12 p-5 rounded-2xl border border-glass-border bg-white/[0.01] text-[10px] md:text-xs text-[var(--text-secondary)] leading-relaxed text-center w-full backdrop-blur-sm animate-[fadeIn_0.5s_ease-out_forwards]">
        <p>
          {locale === 'es' ? (
            <strong>Aviso de Responsabilidad:</strong>
          ) : (
            <strong>Disclaimer:</strong>
          )}{' '}
          {locale === 'es' ? (
            'Esta calculadora es una herramienta referencial y educativa sin fines de lucro. Los montos reflejados son de carácter estrictamente informativo. La tasa del dólar promedio paralelo es calculada mediante promedios matemáticos de cotizaciones públicas e informales recopiladas por terceros, y el resto de las tasas oficiales son tomadas automáticamente de APIs públicas (como cotizave.com) y entes reguladores oficiales. No nos hacemos responsables bajo ninguna circunstancia por las decisiones financieras, comerciales o legales tomadas por terceros en base a los datos de este sitio.'
          ) : (
            'This calculator is a non-profit, educational reference utility. All displayed rates and values are strictly for informational purposes. The parallel dollar rate is calculated from mathematical averages of public and informal quotes sourced by third parties, while official rates are automatically retrieved from public APIs (such as cotizave.com) and regulatory agencies. Under no circumstances do we assume liability for financial, commercial, or legal decisions made by users based on this data.'
          )}
        </p>
      </div>
      )}

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setShowInstallGuide(false)}
        >
          <div 
            className="bg-[var(--bg-secondary)] border border-glass-border rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-left text-sm leading-relaxed font-normal animate-[zoomIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-extrabold text-base uppercase tracking-wider text-[#10B981] mb-4 border-b border-glass-border pb-3 flex items-center gap-2">
              <Download className="w-5 h-5" />
              {locale === 'es' ? 'Instalar App' : 'Install App'}
            </h4>
            
            <div className="space-y-4">
              <p className="text-[var(--text-primary)] font-bold">
                {locale === 'es' 
                  ? 'Para instalar esta herramienta y usarla sin conexión:' 
                  : 'To install this tool for offline use:'}
              </p>
              
              {isIOS ? (
                <ol className="list-decimal pl-5 text-[var(--text-secondary)] space-y-2">
                  <li>{locale === 'es' ? 'Toca' : 'Tap'} <strong className="text-[var(--text-primary)]">{locale === 'es' ? 'Compartir' : 'Share'}</strong> {locale === 'es' ? 'en la barra de navegación inferior.' : 'in the bottom navigation bar.'}</li>
                  <li>{locale === 'es' ? 'Selecciona' : 'Select'} <strong className="text-[var(--text-primary)]">{locale === 'es' ? 'Agregar a Inicio' : 'Add to Home Screen'}</strong>.</li>
                  <li>{locale === 'es' ? 'Confirma tocando' : 'Confirm by tapping'} <strong className="text-[var(--text-primary)]">{locale === 'es' ? 'Agregar' : 'Add'}</strong>.</li>
                </ol>
              ) : (
                <ol className="list-decimal pl-5 text-[var(--text-secondary)] space-y-2">
                  <li>{locale === 'es' ? 'Toca el menú de opciones (tres puntos) en tu navegador.' : 'Tap the browser menu (three dots).'}</li>
                  <li>{locale === 'es' ? 'Selecciona' : 'Select'} <strong className="text-[var(--text-primary)]">{locale === 'es' ? 'Instalar aplicación' : 'Install app'}</strong> {locale === 'es' ? 'o' : 'or'} <strong className="text-[var(--text-primary)]">{locale === 'es' ? 'Agregar a inicio' : 'Add to Home screen'}</strong>.</li>
                </ol>
              )}
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="mt-6 w-full py-3 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-xl font-bold uppercase tracking-widest hover:bg-[#10B981]/20 transition-colors cursor-pointer"
            >
              {locale === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
