import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import { Lightbulb, Code2, Rocket } from 'lucide-react';

const processSteps = [
  {
    id: 1,
    title: "Análisis del Problema",
    description: "Todo comienza entendiendo tu visión. ¿Qué te frena? Analizamos tus procesos actuales y descubrimos el cuello de botella que impide tu crecimiento.",
    icon: Lightbulb,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: 2,
    title: "Solución a Medida",
    description: "No uso plantillas genéricas. Arquitecto y desarrollo una solución tecnológica profesional, escalable y enfocada 100% en optimizar tu negocio.",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: 3,
    title: "Despliegue y Resultados",
    description: "Lanzamos tu plataforma con los más altos estándares de rendimiento y seguridad. Tu problema inicial se convierte en tu mayor ventaja competitiva.",
    icon: Rocket,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative z-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
            Mi Propuesta de Valor
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 max-w-2xl leading-tight">
            Transformo tus problemas complejos en <span className="text-gradient">soluciones digitales</span> rentables.
          </h2>
          <p className="text-[var(--text-secondary)] md:text-lg mb-16 max-w-3xl leading-relaxed">
            Mi objetivo no es solo escribir código, sino conectar contigo para entender el desafío real de tu negocio. Si buscas a alguien que diseñe e implemente una estrategia tecnológica profesional que optimice tus procesos y potencie tus resultados, estás en el lugar correcto. Así es como lo lograremos:
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent -z-10"></div>

          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={`w-24 h-24 rounded-2xl ${step.bg} ${step.border} border backdrop-blur-sm flex items-center justify-center mb-6 transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 shadow-lg`}>
                  <Icon className={`w-10 h-10 ${step.color}`} />
                  {/* Glowing dot indicator */}
                  <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${step.bg.replace('/10', '')} border-2 border-[var(--bg-primary)] shadow-[0_0_10px_currentColor] ${step.color}`}></div>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--grad-from)] group-hover:to-[var(--grad-to)] transition-all">
                  {step.id}. {step.title}
                </h3>
                
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
