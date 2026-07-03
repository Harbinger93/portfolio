import React from 'react';

export default function TermsAndConditions() {
  return (
    <div id="terms-section" className="w-full max-w-4xl mx-auto my-12 p-10 glass rounded-3xl shadow-2xl border border-white/10 relative z-10 text-sm text-slate-300 leading-relaxed backdrop-blur-xl">
      <h2 className="text-2xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 text-center uppercase tracking-wider">TÉRMINOS Y CONDICIONES DE USO – PLATAFORMA RECREATIVA</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-foreground mb-2">1. NATURALEZA EXCLUSIVAMENTE RECREATIVA</h3>
          <p>
            Esta plataforma web de Quiniela / Polla / Prode ha sido desarrollada única y exclusivamente con fines de entretenimiento, recreación privada y sana competencia entre aficionados del fútbol.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-2">2. PROHIBICIÓN ABSOLUTA DE APUESTAS Y JUEGOS DE AZAR</h3>
          <p>
            Este sitio <strong>NO es una casa de apuestas, casino en línea, ni una plataforma de juegos de azar</strong>. Queda estrictamente prohibido utilizar este software para gestionar, recaudar, apostar o transaccionar dinero real, divisas, criptomonedas o cualquier activo con valor comercial. La plataforma no cuenta con pasarelas de pago ni monederos virtuales de ningún tipo.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-2">3. AUSENCIA DE LUCRO Y PREMIOS</h3>
          <p>
            El organizador y los desarrolladores de este software no cobran tarifas de inscripción, no generan comisiones por actividad, ni ofrecen, financian o garantizan premios de carácter económico derivados del uso de la aplicación. Cualquier incentivo simbólico que pueda otorgarse en entornos privados es ajeno al funcionamiento y responsabilidad de este sistema web.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-2">4. EXCLUSIÓN DE RESPONSABILIDAD</h3>
          <p>
            El usuario acepta que el uso de esta plataforma es bajo su propio riesgo voluntario. Los administradores se reservan el derecho de suspender, modificar o dar por terminada la actividad en cualquier momento si se detecta un uso indebido que viole la naturaleza recreativa de estos términos o las leyes locales aplicables en materia de juegos y apuestas.
          </p>
        </section>
      </div>
    </div>
  );
}
