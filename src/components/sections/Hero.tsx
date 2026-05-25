import { motion } from 'framer-motion';
import { useI18n } from '../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import NeonButton from '../ui/NeonButton';
import GlassCard from '../ui/GlassCard';
import { stats } from '../../config/data';
import { MapPin, Briefcase, Award } from 'lucide-react';

export default function Hero() {
  const { t, locale } = useI18n();

  const currentStats = stats[locale];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-24 pb-16 relative z-10"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 order-2 md:order-1">
            <ScrollReveal direction="up" delay={0.1}>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                {t('hero.greeting')}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-150 mb-3 leading-tight">
                {t('hero.name')}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-lg md:text-xl text-steel-400 font-light mb-2">
                {t('hero.title')}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mb-8">
                {t('hero.subtitle')}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <div className="flex flex-wrap gap-4">
                <a href="#projects">
                  <NeonButton variant="primary">{t('hero.cta.projects')}</NeonButton>
                </a>
                <a href="#contact">
                  <NeonButton variant="secondary">{t('hero.cta.contact')}</NeonButton>
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-2 order-1 md:order-2 flex justify-center">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden glass animate-float">
                  <img
                    src="/avatar.png"
                    alt="Gabriél Vazquez"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
                </div>

                <div className="absolute -bottom-4 -left-4 glass rounded-xl p-3 md:p-4 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ice-300 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs text-slate-400">Caracas, VE</span>
                  </div>
                  <div className="flex items-center gap-2 text-steel-400 mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-xs text-slate-400">Webmaster</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-accent">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-xs text-slate-400">Coach</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-lg mx-auto md:mx-0">
          {currentStats.map((stat, i) => (
            <ScrollReveal key={stat.labelKey} direction="up" delay={0.6 + i * 0.1}>
              <GlassCard className="text-center py-4">
                <motion.p
                  className="text-xl md:text-2xl font-light text-ice-300"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wider">
                  {t(stat.labelKey)}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
