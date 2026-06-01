import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n/context';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DOMPurify from 'isomorphic-dompurify';

const waSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre requerido')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),
  email: z.string().email('Correo inválido'),
  phone: z.string({ required_error: 'Teléfono requerido' }).min(5, 'Teléfono inválido'),
  message: z.string().min(5, 'Mensaje muy corto'),
});

type WaFormData = z.infer<typeof waSchema>;

export default function WhatsAppBubble() {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<WaFormData>({ resolver: zodResolver(waSchema) });

  useEffect(() => {
    if (isOpen && !showGreeting) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setShowGreeting(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showGreeting]);

  useEffect(() => {
    const handleOpenWa = () => setIsOpen(true);
    window.addEventListener('open-whatsapp', handleOpenWa);
    return () => window.removeEventListener('open-whatsapp', handleOpenWa);
  }, []);

  const onSubmit = (data: WaFormData) => {
    const sanitizedMessage = DOMPurify.sanitize(data.message);

    let countryCode = '';
    try {
      const parsed = parsePhoneNumber(data.phone);
      if (parsed?.country) countryCode = ` (${parsed.country})`;
    } catch (_) {}

    const text = encodeURIComponent(
      `Hola Gabriel! Soy ${data.name}${countryCode} (${data.email}).\n\n${sanitizedMessage}\n\nTel: ${data.phone}`
    );
    window.open(`https://wa.me/584120113404?text=${text}`, '_blank');
    reset();
    setIsOpen(false);
    setShowGreeting(false);
  };

  const greetingText =
    locale === 'es'
      ? '¡Hola! Para brindarte una mejor atención, indícame tu nombre, correo, teléfono y cómo puedo ayudarte.'
      : 'Hi! To better assist you, please share your name, email, phone number and how I can help.';

  // Input class reused across fields
  const inputCls =
    'w-full text-xs px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] focus:ring-1 focus:ring-[#25D366] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all';

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden flex flex-col bg-[var(--bg-secondary)]/95 backdrop-blur-xl"
            style={{}}
          >
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="/avatar-nav.png" alt="Gabriel" className="w-10 h-10 rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#075E54]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Gabriel Vazquez</h4>
                  <p className="text-[10px] text-white/80">Online</p>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); setShowGreeting(false); reset(); }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="p-4 min-h-[160px] flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
              {/* Typing indicator */}
              {isTyping && (
                <div className="bg-[var(--bg-primary)] border border-[var(--glass-border)] p-3 rounded-2xl rounded-tl-sm w-fit text-sm shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              {/* Greeting bubble */}
              {showGreeting && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[var(--bg-primary)] border border-[var(--glass-border)] text-[var(--text-primary)] p-3 rounded-2xl rounded-tl-sm w-11/12 text-xs shadow-sm leading-relaxed"
                >
                  {greetingText}
                </motion.div>
              )}

              {/* Form */}
              {showGreeting && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-1 space-y-2"
                >
                  {/* Name */}
                  <div>
                    <input
                      {...register('name')}
                      placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
                      onKeyDown={(e) => { if (/[0-9<>{}[\]\\;:"|,]/.test(e.key)) e.preventDefault(); }}
                      className={inputCls}
                    />
                    {errors.name && <p className="text-[10px] text-red-400 mt-0.5">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder={locale === 'es' ? 'Tu correo' : 'Your email'}
                      className={inputCls}
                    />
                    {errors.email && <p className="text-[10px] text-red-400 mt-0.5">{errors.email.message}</p>}
                  </div>

                  {/* Phone with flag */}
                  <div>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          defaultCountry="VE"
                          className="phone-input-wa"
                        />
                      )}
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 mt-0.5">{errors.phone.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      {...register('message')}
                      placeholder={locale === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
                      rows={2}
                      className={`${inputCls} resize-none`}
                      onPaste={(e) => {
                        // Sanitize paste
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        document.execCommand('insertText', false, text);
                      }}
                    />
                    {errors.message && <p className="text-[10px] text-red-400 mt-0.5">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors shadow-md"
                  >
                    {locale === 'es' ? 'Ir a WhatsApp' : 'Go to WhatsApp'} <Send className="w-3 h-3" />
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>
    </div>
  );
}
