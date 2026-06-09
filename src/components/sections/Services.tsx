import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { Terminal, AnimatedSpan, TypingAnimation } from '../ui/terminal';
import { AuroraText } from '../ui/aurora-text';
import { RainbowButton } from '../ui/rainbow-button';
import { ArrowRight } from 'lucide-react';

const processSteps = {
  es: [
    {
      id: "01",
      title: "Diagnóstico y Estrategia",
      description: "Todo comienza entendiendo tu visión y tus cuellos de botella actuales. Diseñamos la estrategia tecnológica y definimos el alcance ideal para tu negocio antes de tocar la primera línea de código.",
      time: "DÍA 1-3"
    },
    {
      id: "02",
      title: "Diseño y Prototipado",
      description: "Creamos la arquitectura visual y técnica de la solución. Validamos contigo la estructura, los flujos de usuario y el rendimiento proyectado para asegurarnos de que el resultado final sea exactamente lo que esperas.",
      time: "DÍA 4-8"
    },
    {
      id: "03",
      title: "Desarrollo y Optimización",
      description: "Traducimos la estrategia en código sólido, seguro y altamente optimizado. Desarrollamos soluciones a medida, libres de plantillas genéricas, enfocadas al 100% en la velocidad y escalabilidad de tu plataforma.",
      time: "DÍA 9-25"
    },
    {
      id: "04",
      title: "Despliegue y Acompañamiento",
      description: "Lanzamos tu plataforma bajo los más altos estándares de producción. Pero no te dejamos solo: monitoreamos el impacto inicial y te acompañamos con soporte continuo para asegurar que tu inversión sea rentable a largo plazo.",
      time: "DÍA 26-30"
    },
    {
      id: "05",
      title: "Soporte & capacitación",
      description: "Sesión 1:1 contigo para que puedas editar lo básico y te acompañamos con 30 días de soporte continuo sin costo extra para asegurar tu retorno.",
      time: "+30 DÍAS"
    }
  ],
  en: [
    {
      id: "01",
      title: "Diagnosis & Strategy",
      description: "It all starts by understanding your vision and current bottlenecks. We design the technological strategy and define the ideal scope for your business before writing the first line of code.",
      time: "DAY 1-3"
    },
    {
      id: "02",
      title: "Design & Prototyping",
      description: "We create the visual and technical architecture of the solution. We validate the structure, user flows, and projected performance with you to ensure that the final result is exactly what you expect.",
      time: "DAY 4-8"
    },
    {
      id: "03",
      title: "Development & Optimization",
      description: "We translate the strategy into solid, secure, and highly optimized code. We develop custom solutions, free of generic templates, focused 100% on the speed and scalability of your platform.",
      time: "DAY 9-25"
    },
    {
      id: "04",
      title: "Deployment & Support",
      description: "We launch your platform under the highest production standards. But we do not leave you alone: we monitor the initial impact and accompany you with continuous support to ensure your investment is profitable in the long term.",
      time: "DAY 26-30"
    },
    {
      id: "05",
      title: "Support & Training",
      description: "A 1:1 training session with you so you can edit the basics, plus 30 days of continuous support at no extra cost to ensure your returns.",
      time: "+30 DAYS"
    }
  ]
};

export default function Services() {
  const { locale } = useI18n();
  const [terminalKey, setTerminalKey] = useState(0);

  const currentSteps = processSteps[locale as keyof typeof processSteps] || processSteps['en'];

  const handleTerminalComplete = () => {
    setTimeout(() => {
      setTerminalKey((prev) => prev + 1);
    }, 12000);
  };

  return (
    <section id="services" className="py-24 relative z-10 overflow-clip">
      {/* Decorative background elements */}
      <div className="absolute top-1/3 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-2/3 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* FIRST SUB-SECTION: Value Proposition (Intro + Terminal) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7 text-left">
            <ScrollReveal direction="up">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3">
                <AuroraText>{locale === 'es' ? 'Mi Propuesta de Valor' : 'My Value Proposition'}</AuroraText>
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 leading-tight">
                {locale === 'es' ? (
                  <>
                    Transformo tus problemas complejos en <AuroraText>soluciones digitales</AuroraText> rentables.
                  </>
                ) : (
                  <>
                    I transform your complex problems into profitable <AuroraText>digital solutions</AuroraText>.
                  </>
                )}
              </h2>
              <p className="text-[var(--text-secondary)] md:text-lg leading-relaxed mb-6">
                {locale === 'es' 
                  ? 'Mi objetivo no es solo escribir código, sino conectar contigo para entender el desafío real de tu negocio. Si buscas a alguien que diseñe e implemente una estrategia tecnológica profesional que optimice tus procesos y potencie tus resultados, estás en el lugar correcto.' 
                  : 'My goal is not just to write code, but to connect with you to understand the real challenge of your business. If you are looking for someone to design and implement a professional technology strategy that optimizes your processes and boosts your results, you are in the right place.'}
              </p>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                {locale === 'es' 
                  ? 'A través de una metodología clara y estructurada, mitigo los riesgos técnicos y garantizo que cada línea de código contribuya directamente al crecimiento y la rentabilidad de tu empresa. Así es como trabajaremos juntos:' 
                  : 'Through a clear and structured methodology, I mitigate technical risks and guarantee that every line of code contributes directly to the growth and profitability of your company. This is how we will work together:'}
              </p>
            </ScrollReveal>
          </div>
          
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <ScrollReveal direction="up" delay={0.2} className="w-full max-w-md">
              <Terminal 
                key={terminalKey}
                onComplete={handleTerminalComplete} 
                className="text-left font-mono"
                startOnView={false}
              >
                <TypingAnimation delay={0}>{"$ gabrielvazquez init"}</TypingAnimation>
                
                <AnimatedSpan delay={500} className="text-cyan-400 flex items-center gap-2">
                  <span className="animate-spin inline-block">⟲</span> {locale === 'es' ? 'Analizando tu necesidad real...' : 'Analyzing your real needs...'}
                </AnimatedSpan>
                
                <AnimatedSpan delay={1000} className="text-cyan-400">
                  ✓ {locale === 'es' ? 'Propuesta lista (técnica + visual)' : 'Proposal ready (technical + visual)'}
                </AnimatedSpan>
                
                <AnimatedSpan delay={800} className="text-cyan-400">
                  ✓ {locale === 'es' ? 'Sprint 1 · diseño aprobado' : 'Sprint 1 · design approved'}
                </AnimatedSpan>
                
                <AnimatedSpan delay={800} className="text-cyan-400">
                  ✓ {locale === 'es' ? 'Sprint 2 · build optimizado' : 'Sprint 2 · build optimized'}
                </AnimatedSpan>
                
                <AnimatedSpan delay={800} className="text-cyan-400">
                  ✓ {locale === 'es' ? 'Deploy en Vercel · 1.2s' : 'Deployment to Vercel · 1.2s'}
                </AnimatedSpan>
                
                <AnimatedSpan delay={600} className="text-yellow-300 underline">
                  ↗ https://tucliente.com
                </AnimatedSpan>
                
                <AnimatedSpan delay={400} className="text-[var(--text-secondary)]">
                  {locale === 'es' ? 'listo en 6m 12s · 0 errores' : 'ready in 6m 12s · 0 errors'}
                </AnimatedSpan>
                
                <TypingAnimation delay={1000} className="text-[var(--text-primary)]">
                  {`$ ${locale === 'es' ? 'gabrielvazquez cotizar' : 'gabrielvazquez quote'}`}
                </TypingAnimation>
              </Terminal>
            </ScrollReveal>
          </div>
        </div>

        {/* SECOND SUB-SECTION: Timeline Proceso (Sticky Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12">
          
          {/* Left Column: Title and details (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start h-fit flex flex-col items-start text-left z-20">
            <ScrollReveal direction="right">
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-[1.1] mb-6 uppercase tracking-tight">
                {locale === 'es' ? (
                  <>
                    Proceso<br/>ágil.<br/>
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Resultados<br/>reales.</span>
                  </>
                ) : (
                  <>
                    Agile<br/>process.<br/>
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Real<br/>results.</span>
                  </>
                )}
              </h2>
              
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                {locale === 'es' 
                  ? 'Desde una landing page hasta un sistema a medida, te acompaño en cada paso del proceso. Divido el desarrollo en bloques claros con entregas constantes, garantizando transparencia y control total sobre el avance del proyecto.' 
                  : 'From a landing page to a custom system, I walk with you through every step of the process. I break down development into clear blocks with constant deliveries, ensuring transparency and total control over the project\'s progress.'}
              </p>
              
              {/* Brand gradient line separator */}
              <div className="h-[2px] w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] mb-6"></div>
              
              <p className="text-[10px] md:text-xs font-mono font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                {locale === 'es' 
                  ? 'DURACIÓN TÍPICA · 15 - 30 DÍAS' 
                  : 'TYPICAL DURATION · 15 - 30 DAYS'}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Steps cards stack */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            {currentSteps.map((step, idx) => {
              const isLast = idx === currentSteps.length - 1;
              return (
                <ScrollReveal 
                  key={step.id} 
                  direction="up" 
                  delay={idx * 0.08}
                  className="w-full"
                >
                  <div 
                    className={`relative overflow-hidden p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass transition-all duration-500 bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)]/50 ${
                      isLast 
                        ? 'border border-[var(--accent-primary)]/40 shadow-[0_0_20px_rgba(0,242,254,0.15)] bg-[var(--accent-primary)]/3' 
                        : 'border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/30'
                    }`}
                  >
                    <div className="flex items-start gap-4 md:gap-6 flex-1">
                      {/* Step Number */}
                      <span className={`text-3xl md:text-4xl font-mono font-black select-none shrink-0 ${
                        isLast ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]/40'
                      }`}>
                        {step.id}
                      </span>
                      
                      <div className="flex flex-col gap-1 text-left">
                        <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)]">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Step duration tag */}
                    <span className={`shrink-0 text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border ${
                      isLast 
                        ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]' 
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)]'
                    }`}>
                      {step.time}
                    </span>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>

        {/* Action Button at the bottom */}
        <div className="flex justify-center mt-20">
          <ScrollReveal direction="up" delay={0.2}>
            <RainbowButton 
              variant="outline" 
              asChild 
              className="rounded-full px-8 py-6 text-sm md:text-base hover:scale-105 active:scale-95 transition-transform duration-300 font-semibold cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
            >
              <a href="#contact" className="flex items-center gap-2.5">
                {locale === 'es' ? 'Quiero agendar' : 'Schedule call'}
                <ArrowRight className="w-4 h-4 text-[var(--accent-primary)] animate-pulse" />
              </a>
            </RainbowButton>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
