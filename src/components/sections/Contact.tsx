import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { Send, CheckCircle2, AlertCircle, Linkedin, Instagram } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DOMPurify from 'isomorphic-dompurify';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CustomCountrySelect } from '../ui/CustomCountrySelect';

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
          <div className="glass p-8 md:p-10 rounded-3xl border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/30 transition-colors duration-500 bg-[var(--bg-primary)]/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('contact.name')}
                  </Label>
                  <Input
                    {...register('name')}
                    type="text"
                    id="name"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      // Block digits and common special chars in name field
                      if (/[0-9<>{}[\]\\\/;:"|,]/.test(e.key)) e.preventDefault();
                    }}
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
                  <Label htmlFor="email">
                    {t('contact.email')}
                  </Label>
                  <Input
                    {...register('email')}
                    type="email"
                    id="email"
                    disabled={isSubmitting}
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
                  <Label htmlFor="phone">
                    Teléfono
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        defaultCountry="VE"
                        disabled={isSubmitting}
                        id="phone"
                        aria-label="Teléfono"
                        className="phone-input-dark"
                        countrySelectComponent={CustomCountrySelect}
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
                <Label htmlFor="message">
                  {t('contact.message')}
                </Label>
                <Textarea
                  {...register('message')}
                  id="message"
                  rows={5}
                  disabled={isSubmitting}
                  placeholder={t('contact.messagePlaceholder')}
                />
                {errors.message && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button & Status */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-auto px-8 py-3.5 rounded-xl bg-gradient-primary hover:bg-gradient-primary/95 text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
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
                </Button>

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
              href="https://www.linkedin.com/in/gabriel-jesse-vazquez/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">LinkedIn</span>
            </a>
            <a 
              href="https://www.instagram.com/gjvo23/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Instagram</span>
            </a>
            <a 
              href="https://www.behance.net/gjvo23" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z"/>
              </svg>
              <span className="text-sm font-medium tracking-wide">Behance</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
