import ScrollReveal from '../ui/ScrollReveal';
import { Quote, Star } from 'lucide-react';
import karenImage from '../../img/Testimonios/karen.webp';
import saulImage from '../../img/Testimonios/saul.webp';
import cynthiaImage from '../../img/Testimonios/cynthia.png';

const testimonials = [
  {
    id: 1,
    name: "Karen Rosa",
    role: "Consultora en Comunicaciones",
    content: "Me gusta trabajar con Gabriel en proyectos independientes porque me da tranquilidad: más allá de su sólida base técnica (que es indiscutible), tiene la capacidad para comprender la dimensión de cada misión y adaptarse a las distintas necesidades de los clientes. Las entregas siempre llegan a tiempo y la colaboración fluye de forma natural. Es el perfil que busco para llevar a buen puerto cualquier proyecto web",
    rating: 5,
    image: karenImage
  },
  {
    id: 2,
    name: "Saúl Briceño",
    role: "Coordinador de Marketing Digital - SimpleTV",
    content: "Más de 8 años trabajando en múltiples proyectos. Gabriel es sinónimo de proactividad, optimización de procesos y resolución de problemas.",
    rating: 5,
    image: saulImage
  },
  {
    id: 3,
    name: "Cynthia Tafur",
    role: "Comunicaciones y Mercadeo",
    content: "Excelentes capacidades técnicas, especialmente en el desarrollo web. Tiene además gran facilidad para trabajar en equipo y aportar soluciones efectivas para cada reto que se presenta en las actividades diarias a modo de optimizar los procesos.",
    rating: 5,
    image: cynthiaImage
  }
];

// Helper to resolve images imported locally vs external URLs
const getImgSrc = (img: any) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.src) return img.src;
  return '';
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
              Casos de Éxito
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] max-w-2xl leading-tight mb-4">
              Lo que dicen de mi trabajo
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg max-w-xl">
              Resultados reales de clientes que confiaron en mi experiencia para llevar sus negocios al siguiente nivel digital.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile Animated Marquee (Looping from right to left) */}
        <div className="block md:hidden overflow-hidden w-full relative py-4 marquee-mask">
          <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="glass p-6 rounded-2xl relative w-[290px] shrink-0 flex flex-col border border-[var(--glass-border)]"
              >
                <Quote className="absolute top-4 right-4 w-6 h-6 text-[var(--glass-border)]" />
                
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6 flex-grow whitespace-normal">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--glass-border)]">
                  <img 
                    src={getImgSrc(testimonial.image)} 
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-[var(--glass-border)]"
                  />
                  <div>
                    <h4 className="text-[var(--text-primary)] font-bold text-xs">
                      {testimonial.name}
                    </h4>
                    <p className="text-[var(--text-secondary)] text-[10px]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass p-8 rounded-2xl relative group hover:border-[var(--accent-primary)] transition-colors duration-300 flex flex-col"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--glass-border)] group-hover:text-[var(--accent-primary)]/20 transition-colors duration-300" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 flex-grow">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[var(--glass-border)]">
                <img 
                  src={getImgSrc(testimonial.image)} 
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--bg-primary)] ring-2 ring-[var(--glass-border)] group-hover:ring-[var(--accent-primary)]/50 transition-all"
                />
                <div>
                  <h4 className="text-[var(--text-primary)] font-bold text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-[var(--text-secondary)] text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
