import { useState, type FormEvent } from 'react';
import { useI18n } from '../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import {
  Mail,
  MapPin,
  Linkedin,
  Palette,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function Contact() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Required';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');

    try {
      const res = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _language: locale }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  const inputClass =
    'w-full bg-deep-800/50 border border-glass-border rounded-lg px-4 py-3 text-sm text-slate-150 placeholder-slate-600 focus:outline-none focus:border-ice-300/30 focus:ring-1 focus:ring-ice-300/10 transition-all duration-300';

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
            {t('contact.subtitle')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-slate-150 mb-12">
            {t('contact.title')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          <div className="md:col-span-3">
            <ScrollReveal direction="up" delay={0.2}>
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <input
                      type="text"
                      placeholder={t('contact.name')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`${inputClass} ${errors.name ? 'border-red-500/40' : ''}`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t('contact.email')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`${inputClass} ${errors.email ? 'border-red-500/40' : ''}`}
                    />
                  </div>
                  <div>
                    <textarea
                      rows={5}
                      placeholder={t('contact.message')}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none ${errors.message ? 'border-red-500/40' : ''}`}
                    />
                  </div>

                  <NeonButton
                    variant="primary"
                    onClick={() => {}}
                    className="w-full"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-3.5 h-3.5 animate-pulse" />
                        {t('contact.sending')}
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t('contact.success')}
                      </span>
                    ) : status === 'error' ? (
                      <span className="flex items-center justify-center gap-2 text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {t('contact.error')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        {t('contact.send')}
                      </span>
                    )}
                  </NeonButton>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>

          <div className="md:col-span-2">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="space-y-4">
                <GlassCard>
                  <a
                    href="mailto:dev.gabo23@gmail.com"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center group-hover:border-ice-300/20 transition-all">
                      <Mail className="w-4 h-4 text-ice-300" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        {t('contact.email_label')}
                      </p>
                      <p className="text-xs text-slate-300 group-hover:text-ice-300 transition-colors">
                        dev.gabo23@gmail.com
                      </p>
                    </div>
                  </a>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-steel-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Location
                      </p>
                      <p className="text-xs text-slate-300">
                        {t('contact.location')}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <a
                    href="https://www.linkedin.com/in/gabriel-vazquez-076a00208/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center group-hover:border-ice-300/20 transition-all">
                      <Linkedin className="w-4 h-4 text-blue-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        LinkedIn
                      </p>
                      <p className="text-xs text-slate-300 group-hover:text-ice-300 transition-colors">
                        Gabriél Vazquez
                      </p>
                    </div>
                  </a>
                </GlassCard>

                <GlassCard>
                  <a
                    href="https://www.behance.net/gabrielvazquez7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center group-hover:border-ice-300/20 transition-all">
                      <Palette className="w-4 h-4 text-steel-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Behance
                      </p>
                      <p className="text-xs text-slate-300 group-hover:text-ice-300 transition-colors">
                        /gabrielvazquez7
                      </p>
                    </div>
                  </a>
                </GlassCard>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
