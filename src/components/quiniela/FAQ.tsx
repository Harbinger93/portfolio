import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import GlowCard from '../ui/GlowCard';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      q: '¿Cómo se suman los puntos?',
      a: 'Sumas 3 puntos si aciertas el marcador exacto del partido. Sumas 1 punto si aciertas el ganador o el empate, pero no el marcador exacto.'
    },
    {
      q: '¿Qué pasa si el partido va a prórroga o penales?',
      a: 'El marcador de la quiniela toma en cuenta el resultado oficial finalizado el tiempo reglamentario o la prórroga (120 minutos). No incluye la tanda de penales. Sin embargo, para los partidos de eliminación directa, deberás elegir de forma obligatoria qué equipo clasifica; acertar esto te otorgará 1 punto adicional.'
    },
    {
      q: '¿Hasta qué hora puedo modificar mis predicciones?',
      a: 'Puedes cambiar tu pronóstico en cualquier momento hasta el segundo exacto antes de la hora estipulada de inicio real del partido. Una vez que el partido comienza, el sistema bloquea los inputs automáticamente.'
    },
    {
      q: '¿Qué pasa si guardo mis cambios sin internet?',
      a: 'La plataforma cuenta con un sistema de almacenamiento local. Tus predicciones quedarán respaldadas en tu dispositivo y se enviarán automáticamente a nuestros servidores apenas recuperes una conexión estable.'
    }
  ];

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 relative z-10">
      <h2 className="text-3xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 drop-shadow-sm">
        Preguntas Frecuentes (FAQ)
      </h2>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <GlowCard 
              key={index} 
              className={`border border-[var(--glass-border)] rounded-2xl overflow-hidden transition-all duration-300 bg-[var(--bg-secondary)]/40 backdrop-blur-md ${
                isOpen ? 'border-[var(--accent-primary)]/40 shadow-[0_0_20px_rgba(0,242,254,0.05)]' : 'hover:border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]/70'}`} />
                  <span className={`text-sm md:text-base font-extrabold text-[var(--text-primary)] leading-snug transition-colors duration-300 ${isOpen ? 'text-blue-400' : ''}`}>
                    {item.q}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-all duration-300 bg-white/[0.01] hover:bg-white/[0.05] ${isOpen ? 'rotate-180 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100 border-t border-[var(--glass-border)]/45' : 'max-h-0 opacity-0 pointer-events-none'
                } overflow-hidden`}
              >
                <div className="p-6 text-sm text-[var(--text-secondary)] leading-relaxed bg-white/[0.01]">
                  {item.a}
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}
