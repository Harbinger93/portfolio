import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import GlowCard from '../ui/GlowCard';

export default function LegalContent() {
  const { t, locale } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-6">
      <ScrollReveal direction="up">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
            {locale === 'es' ? 'Legal' : 'Legal Notice'}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
            {t('legal.title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-xs font-semibold">
            {t('legal.lastUpdated')}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <GlowCard className="border border-[var(--glass-border)] p-4 md:p-6 rounded-3xl bg-[var(--bg-secondary)]/40 backdrop-blur-2xl shadow-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {locale === 'es' ? (
            <div className="flex flex-col gap-10 md:gap-12">
              {/* Sección 1: Introducción */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  1. Aceptación de los Términos
                </h2>
                <p>
                  Al acceder y utilizar este sitio web, usted acepta estar sujeto a los presentes Términos y Condiciones de Uso y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas comerciales aplicables.
                </p>
              </div>

              {/* Sección 2: Uso de Herramientas y Descargo de Responsabilidad */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  2. Descargo de Responsabilidad de las Herramientas (Radar, Analizador, Optimizador)
                </h2>
                <p>
                  Este sitio web ofrece herramientas gratuitas de rendimiento y cálculo (como el radar de tipo de cambio) con fines exclusivamente de referencia, educativos e informativos:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Calculadora de Divisas (Radar):</strong> Los montos mostrados son aproximados y de carácter referencial. La tasa del dólar paralelo representa un promedio de cotizaciones del mercado informal recopilado por plataformas de terceros. El resto de las tasas son extraídas de fuentes públicas y APIs. Gabriel Vazquez no realiza actividades de intermediación financiera, corretaje de divisas ni transacciones cambiarias.
                  </li>
                  <li>
                    <strong>Optimizador y Analizador Web:</strong> La compresión de archivos se realiza localmente en el navegador del usuario. Las puntuaciones de rendimiento son obtenidas a través de la API pública de Google PageSpeed y constituyen diagnósticos técnicos aproximados.
                  </li>
                </ul>
                <p>
                  <strong>Limitación de Responsabilidad:</strong> En ningún caso Gabriel Vazquez será responsable de ningún daño (incluyendo, sin limitación, daños por pérdida de datos, beneficios, o interrupción del negocio) que surja del uso o de la imposibilidad de usar los materiales o herramientas de este sitio, incluso si se ha notificado la posibilidad de tales daños. El usuario asume toda la responsabilidad por las decisiones tomadas en base a la información provista.
                </p>
              </div>

              {/* Sección 3: Política de Privacidad */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  3. Política de Privacidad y Tratamiento de Datos
                </h2>
                <p>
                  Tu privacidad es de suma importancia. Esta política detalla cómo se gestiona la información recopilada:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Procesamiento Local:</strong> Las herramientas de optimización de imágenes/PDF y la calculadora Radar procesan toda la información y archivos de forma 100% local en tu navegador. Tus archivos y datos financieros nunca se suben a nuestros servidores.
                  </li>
                  <li>
                    <strong>Formularios de Contacto y Onboarding:</strong> La información provista a través de formularios (nombre, correo electrónico, teléfono, datos del proyecto) se envía de forma encriptada y segura hacia una base de datos privada en Google Sheets para coordinar la relación de servicio técnico. No compartimos, vendemos ni alquilamos tus datos personales a terceros.
                  </li>
                  <li>
                    <strong>Protección Anti-Spam y Control de Frecuencia:</strong> Empleamos campos de seguridad invisibles (Honeypot) y rate limiting local (almacenado temporalmente en tu navegador) para prevenir el spam y ataques de denegación de servicio.
                  </li>
                </ul>
              </div>

              {/* Sección 4: Propiedad Intelectual */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  4. Propiedad Intelectual
                </h2>
                <p>
                  Todos los derechos sobre el diseño, código fuente, logotipos y contenidos de este sitio web pertenecen a Gabriel Vazquez o a sus respectivos licenciantes. Se prohíbe la reproducción parcial o total, distribución o modificación no autorizada de estos materiales sin previo consentimiento expreso por escrito.
                </p>
              </div>

              {/* Sección 5: Ley Aplicable */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  5. Modificaciones y Ley Aplicable
                </h2>
                <p>
                  Nos reservamos el derecho de revisar y modificar estos términos en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión vigente de estos Términos y Condiciones de Uso. Cualquier reclamo relacionado con este sitio web se regirá por las leyes y normativas civiles aplicables.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10 md:gap-12">
              {/* Section 1: Introduction */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  1. Terms of Use
                </h2>
                <p>
                  By accessing and using this website, you agree to be bound by these Terms and Conditions of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark laws.
                </p>
              </div>

              {/* Section 2: Tools Disclaimer */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  2. Disclaimer for Tools (Radar, Analyzer, Optimizer)
                </h2>
                <p>
                  This website offers free performance and calculation tools (such as the exchange rate calculator) strictly for reference, educational, and informational purposes:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Currency Calculator (Radar):</strong> Displayed values are approximate and referential. The parallel dollar rate represents an average of informal market rates compiled by third-party platforms. Official rates are retrieved from public APIs and regulatory entities. Gabriel Vazquez does not engage in financial intermediation, currency trading, or foreign exchange transactions.
                  </li>
                  <li>
                    <strong>Optimizer & Web Analyzer:</strong> File compression is processed 100% locally in the user's browser. Performance scores are fetched from Google PageSpeed public APIs and constitute approximate technical diagnostics.
                  </li>
                </ul>
                <p>
                  <strong>Limitation of Liability:</strong> In no event shall Gabriel Vazquez be liable for any damages (including, without limitation, damages for loss of data, profit, or business interruption) arising out of the use of or inability to use the tools or materials on this site, even if notified of the possibility of such damage. Users assume full responsibility for decisions made based on the provided information.
                </p>
              </div>

              {/* Section 3: Privacy Policy */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  3. Privacy Policy & Data Treatment
                </h2>
                <p>
                  Your privacy is highly important. This policy details how collected information is managed:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Local Processing:</strong> Asset optimization tools and the Radar calculator process all files and data 100% locally in your browser. Your files and financial values are never uploaded to our servers.
                  </li>
                  <li>
                    <strong>Contact & Onboarding Forms:</strong> Information submitted via forms (name, email, phone, project details) is securely sent encrypted to a private Google Sheets database to coordinate the service relationship. We do not sell, rent, or share your personal data with third parties.
                  </li>
                  <li>
                    <strong>Spam Protection & Rate Limiting:</strong> We implement invisible security fields (Honeypot) and local rate limiting (stored temporarily in your browser) to prevent spam and abuse.
                  </li>
                </ul>
              </div>

              {/* Section 4: Intellectual Property */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  4. Intellectual Property
                </h2>
                <p>
                  All rights to the design, source code, logos, and content of this website belong to Gabriel Vazquez or his respective licensors. Unauthorized reproduction, distribution, or modification of these materials is strictly prohibited without prior written consent.
                </p>
              </div>

              {/* Section 5: Governing Law */}
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-glass-border pb-3">
                  5. Revisions and Governing Law
                </h2>
                <p>
                  We reserve the right to revise and modify these terms at any time without notice. By using this website, you agree to be bound by the current version of these Terms and Conditions of Use. Any claim related to this website shall be governed by the applicable civil laws.
                </p>
              </div>
            </div>
          )}
        </GlowCard>
      </ScrollReveal>
    </div>
  );
}
