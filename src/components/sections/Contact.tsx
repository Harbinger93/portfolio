import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { Send, CheckCircle2, AlertCircle, Linkedin, Instagram, Dribbble } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DOMPurify from 'isomorphic-dompurify';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  email: z.string().email('Correo electrónico no válido'),
  phone: z.string({ required_error: 'Teléfono es requerido' }).min(5, 'Teléfono no válido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      // Sanitización del mensaje contra XSS
      const sanitizedMessage = DOMPurify.sanitize(data.message);
      
      // Intentamos extraer el código de país del teléfono
      let countryCode = 'Desconocido';
      try {
        const parsed = parsePhoneNumber(data.phone);
        if (parsed?.country) {
          countryCode = parsed.country;
        }
      } catch (e) {
        // Ignorar error de parseo si ocurre
      }

      await fetch('https://script.google.com/macros/s/AKfycbxzY-w231HVLeFS4o3YFyl8Wokc0UWwgz7GjZTq2to59U5pHNhmo6RDchwE-IUUNnNMew/exec', {
        method: 'POST',
        mode: 'no-cors', // Evita problemas de CORS con Google Scripts
        headers: {
          'Content-Type': 'text/plain', // Usamos text/plain para evitar el preflight de CORS
        },
        body: JSON.stringify({
          nombre: data.name,
          email: data.email,
          telefono: data.phone,
          pais: countryCode,
          mensaje: sanitizedMessage,
          fecha: new Date().toLocaleString()
        }),
      });

      const whatsappMessage = `Hola Gabriel, mi nombre es ${data.name} desde el país (${countryCode}). Te escribo desde tu portfolio.\n\n${sanitizedMessage}\n\nMi correo es: ${data.email}\nMi número es: ${data.phone}`;
      const whatsappUrl = `https://wa.me/584120113404?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative z-10 overflow-hidden">
      {/* Background glow for contact section */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[var(--accent-primary)] blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
            {t('contact.subtitle')}
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-10 leading-tight">
            {t('contact.title')}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="glass p-8 md:p-10 rounded-3xl border border-[var(--glass-border)] bg-[#0a0a0a]/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">
                    {t('contact.name')}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      // Block digits and common special chars in name field
                      if (/[0-9<>{}[\]\\\/;:"|,]/.test(e.key)) e.preventDefault();
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/5 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 border border-white/10 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all disabled:opacity-50`}
                    placeholder="Gabriel J. Vazquez"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">
                    {t('contact.email')}
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/5 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 border border-white/10 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all disabled:opacity-50`}
                    placeholder="gjvo93@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="phone" className="text-sm font-medium text-[var(--text-secondary)]">
                    Teléfono
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        defaultCountry="VE"
                        disabled={isSubmitting}
                        className="phone-input-dark"
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">
                  {t('contact.message')}
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={5}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-4 rounded-xl bg-black/40 border border-white/5 text-[var(--text-primary)] focus:outline-none focus:border-white/20 transition-colors resize-none disabled:opacity-50`}
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button & Status */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0d0d0d] border border-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#151515] hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[var(--text-secondary)]/30 border-t-[var(--text-secondary)] rounded-full animate-spin" />
                      {t('contact.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('contact.send')} <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-sm text-emerald-400 flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
                    <CheckCircle2 className="w-4 h-4" /> {t('contact.success')}
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-sm text-rose-400 flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
                    <AlertCircle className="w-4 h-4" /> {t('contact.error')}
                  </p>
                )}
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Social Links */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <a 
              href="https://linkedin.com/in/tu_usuario" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">LinkedIn</span>
            </a>
            <a 
              href="https://instagram.com/tu_usuario" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Instagram</span>
            </a>
            <a 
              href="https://behance.net/tu_usuario" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Dribbble className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Behance</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
