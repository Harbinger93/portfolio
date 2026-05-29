import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n/context';

const waSchema = z.object({
  name: z.string().min(2, 'Name required / Nombre requerido'),
  email: z.string().email('Invalid email / Correo inválido'),
  message: z.string().min(5, 'Message too short / Mensaje muy corto'),
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
    formState: { errors },
    reset,
  } = useForm<WaFormData>({
    resolver: zodResolver(waSchema),
  });

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
    const text = `Hola Gabriel! Soy ${data.name} (${data.email}).%0A%0A${data.message}`;
    const url = `https://wa.me/584120113404?text=${text}`;
    window.open(url, '_blank');
    reset();
    setIsOpen(false);
    setShowGreeting(false);
  };

  const greetingText = locale === 'es' 
    ? "¡Hola! Para brindarte una mejor atención, por favor indícame tu nombre, correo y cómo puedo ayudarte." 
    : "Hi! To provide you with better support, please provide your name, email, and how I can help you.";

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 max-w-[calc(100vw-3rem)] glass rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="/avatar-nav.png" alt="Gabriel" className="w-10 h-10 rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#075E54]"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Gabriel Vazquez</h4>
                  <p className="text-[10px] text-white/80">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#e5ddd5] dark:bg-[#0a0a0a] min-h-[200px] flex flex-col gap-3">
              {isTyping && (
                <div className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-3 rounded-2xl rounded-tl-sm w-fit text-sm shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
              {showGreeting && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-3 rounded-2xl rounded-tl-sm w-11/12 text-sm shadow-sm leading-relaxed"
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
                  className="mt-2 space-y-3 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-3 rounded-xl border border-black/5 dark:border-white/5"
                >
                  <div>
                    <input
                      {...register('name')}
                      placeholder={locale === 'es' ? "Tu nombre" : "Your name"}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-black/5 dark:bg-black/40 border-none focus:ring-1 focus:ring-green-500 text-black dark:text-white"
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register('email')}
                      placeholder={locale === 'es' ? "Tu correo" : "Your email"}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-black/5 dark:bg-black/40 border-none focus:ring-1 focus:ring-green-500 text-black dark:text-white"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <textarea
                      {...register('message')}
                      placeholder={locale === 'es' ? "Escribe tu mensaje..." : "Type your message..."}
                      rows={2}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-black/5 dark:bg-black/40 border-none focus:ring-1 focus:ring-green-500 resize-none text-black dark:text-white"
                    />
                    {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors shadow-md"
                  >
                    {locale === 'es' ? "Ir a WhatsApp" : "Go to WhatsApp"} <Send className="w-3 h-3" />
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
