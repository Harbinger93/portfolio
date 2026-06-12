import ScrollReveal from '../ui/ScrollReveal';
import { Quote, Star } from 'lucide-react';
import karenImage from '../../img/Testimonios/karen.webp';

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
    name: "Ana Silva",
    role: "Directora de Marketing",
    content: "Buscábamos a alguien que no nos diera excusas, sino resultados. Su profesionalismo, atención al detalle y capacidad para solucionar problemas superó nuestras expectativas.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Miguel Torres",
    role: "Fundador de E-Commerce",
    content: "Llevábamos meses estancados con otra agencia. Gabriel tomó el proyecto, optimizó la arquitectura y en pocas semanas teníamos un ecosistema digital robusto y escalable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
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
