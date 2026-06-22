import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CustomCountrySelect } from '../ui/CustomCountrySelect';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import GlowCard from '../ui/GlowCard';
import { 
  Check, 
  Clipboard, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Mail, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  FolderOpen,
  FileText,
  Share2,
  Clock
} from 'lucide-react';

// Safe SHA-256 implementation using Web Crypto API
async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback: simple hash function
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

// Dominios permitidos para almacenamiento en la nube
const CLOUD_DOMAINS = [
  'drive.google.com',
  'dropbox.com',
  'onedrive.live.com',
  'onedrive.com',
  '1drv.ms'
];

// Helper to check if a URL is from an allowed cloud domain
const isCloudUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return CLOUD_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    );
  } catch (e) {
    return false;
  }
};

// Pure JS lightweight ZIP archive generator for empty folders (requires no external libraries)
function createSimpleZip(folders: string[]): Blob {
  const fileData: Uint8Array[] = [];
  const localHeaders: { name: string; offset: number }[] = [];
  let currentOffset = 0;

  const writeU16 = (val: number, arr: Uint8Array, offset: number) => {
    arr[offset] = val & 0xff;
    arr[offset + 1] = (val >> 8) & 0xff;
  };

  const writeU32 = (val: number, arr: Uint8Array, offset: number) => {
    arr[offset] = val & 0xff;
    arr[offset + 1] = (val >> 8) & 0xff;
    arr[offset + 2] = (val >> 16) & 0xff;
    arr[offset + 3] = (val >> 24) & 0xff;
  };

  const textEncoder = new TextEncoder();

  for (const name of folders) {
    const folderName = name.endsWith('/') ? name : name + '/';
    const nameBytes = textEncoder.encode(folderName);
    const header = new Uint8Array(30 + nameBytes.length);

    writeU32(0x04034b50, header, 0);
    writeU16(10, header, 4);
    writeU16(0, header, 6);
    writeU16(0, header, 8);
    writeU32(0, header, 10);
    writeU32(0, header, 14);
    writeU32(0, header, 18);
    writeU32(0, header, 22);
    writeU16(nameBytes.length, header, 26);
    writeU16(0, header, 28);
    header.set(nameBytes, 30);

    fileData.push(header);
    localHeaders.push({ name: folderName, offset: currentOffset });
    currentOffset += header.length;
  }

  const centralDirectoryOffset = currentOffset;
  let centralDirectorySize = 0;

  for (let i = 0; i < localHeaders.length; i++) {
    const item = localHeaders[i];
    const nameBytes = textEncoder.encode(item.name);
    const cdHeader = new Uint8Array(46 + nameBytes.length);

    writeU32(0x02014b50, cdHeader, 0);
    writeU16(20, cdHeader, 4);
    writeU16(10, cdHeader, 6);
    writeU16(0, cdHeader, 8);
    writeU16(0, cdHeader, 10);
    writeU32(0, cdHeader, 12);
    writeU32(0, cdHeader, 16);
    writeU32(0, cdHeader, 20);
    writeU32(0, cdHeader, 24);
    writeU16(nameBytes.length, cdHeader, 28);
    writeU16(0, cdHeader, 30);
    writeU16(0, cdHeader, 32);
    writeU16(0, cdHeader, 34);
    writeU16(0, cdHeader, 36);
    writeU32(16, cdHeader, 38);
    writeU32(item.offset, cdHeader, 42);
    cdHeader.set(nameBytes, 46);

    fileData.push(cdHeader);
    centralDirectorySize += cdHeader.length;
    currentOffset += cdHeader.length;
  }

  const eocd = new Uint8Array(22);
  writeU32(0x06054b50, eocd, 0);
  writeU16(0, eocd, 4);
  writeU16(0, eocd, 6);
  writeU16(folders.length, eocd, 8);
  writeU16(folders.length, eocd, 10);
  writeU32(centralDirectorySize, eocd, 12);
  writeU32(centralDirectoryOffset, eocd, 16);
  writeU16(0, eocd, 20);

  fileData.push(eocd);

  return new Blob(fileData, { type: 'application/zip' });
}

// Form Validation Schema
const onboardingSchema = z.object({
  // Step 1: Info Básica
  companyName: z.string().min(2, 'Nombre de la empresa es requerido'),
  contactPerson: z.string().min(2, 'Persona de contacto es requerida').regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  email: z.string().email('Correo electrónico no válido'),
  phone: z.string().optional(),
  currentWebsite: z.string().refine(val => !val || /^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(val), {
    message: 'El sitio web debe usar protocolo seguro HTTPS (https://)'
  }).optional(),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad para continuar'
  }),

  // Step 2: Propósito
  businessDescription: z.string().min(10, 'Describe tu negocio (mínimo 10 caracteres)'),
  targetAudience: z.string().min(10, 'Describe tu público objetivo (mínimo 10 caracteres)'),
  primaryGoal: z.enum(['lead_generation', 'ecommerce', 'portfolio', 'branding', 'other']),
  primaryGoalOther: z.string().optional(),

  // Step 3: Requerimientos
  hasHostingAndDomain: z.enum(['yes_both', 'only_domain', 'no_need_help']),
  hostingProvider: z.string().optional(),
  brandAssetsStatus: z.enum(['yes_ready', 'logo_no_manual', 'no_need_design']),
  requiredSections: z.array(z.string()).min(1, 'Selecciona al menos una sección indispensable'),

  // Step 4: Funciones Especiales
  hasEcommerce: z.boolean(),
  ecommerceProductsCount: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().min(1, 'Mínimo 1 producto').optional()),
  hasBooking: z.boolean(),
  bookingSoftware: z.string().optional(),
  hasLiveChat: z.boolean(),
  hasMultilingual: z.boolean(),
  additionalLanguages: z.string().optional(),
  hasAdminPanel: z.boolean(),

  // Step 5: Tiempos y Presupuesto
  deadline: z.string().optional(),
  estimatedBudgetRange: z.enum(['range_low', 'range_medium', 'range_high']),
  
  // Honeypot anti-spam field
  website_honeypot: z.string().max(0, { message: 'Spam detected' }).optional()
});

type OnboardingData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  clientUuid?: string;
}

export default function OnboardingForm({ clientUuid = 'default-client-uuid' }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<OnboardingData | null>(null);
  
  // Phase 2 states
  const [driveLink, setDriveLink] = useState('');
  const [isDriveSubmitted, setIsDriveSubmitted] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSuccess, setDriveSuccess] = useState(false);
  
  // Copy notification states
  const [copiedStructure, setCopiedStructure] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);
  const [emailSentSimulation, setEmailSentSimulation] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      primaryGoal: 'lead_generation',
      hasHostingAndDomain: 'no_need_help',
      brandAssetsStatus: 'no_need_design',
      requiredSections: ['Inicio'],
      hasEcommerce: false,
      hasBooking: false,
      hasLiveChat: false,
      hasMultilingual: false,
      hasAdminPanel: false,
      estimatedBudgetRange: 'range_medium',
      privacyPolicyAccepted: false,
      website_honeypot: ''
    }
  });

  // Watch fields for conditional rendering
  const watchPrimaryGoal = watch('primaryGoal');
  const watchHasHosting = watch('hasHostingAndDomain');
  const watchEcommerce = watch('hasEcommerce');
  const watchBooking = watch('hasBooking');
  const watchMultilingual = watch('hasMultilingual');
  const watchRequiredSections = watch('requiredSections');
  const watchCompanyName = watch('companyName') || 'Tu Empresa';

  // Check client-side rate limit (max 3 submissions per hour)
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const history = localStorage.getItem('onboarding_submission_history');
    if (!history) return true;

    try {
      const timestamps: number[] = JSON.parse(history);
      // Filter out timestamps older than 1 hour
      const recent = timestamps.filter(t => now - t < oneHour);
      localStorage.setItem('onboarding_submission_history', JSON.stringify(recent));

      return recent.length < 3;
    } catch (e) {
      return true;
    }
  };

  const registerSubmission = () => {
    const now = Date.now();
    const history = localStorage.getItem('onboarding_submission_history');
    let timestamps: number[] = [];
    if (history) {
      try {
        timestamps = JSON.parse(history);
      } catch (e) {}
    }
    timestamps.push(now);
    localStorage.setItem('onboarding_submission_history', JSON.stringify(timestamps));
  };

  const nextStep = async () => {
    // Validate only fields in the current step before advancing
    let fieldsToValidate: (keyof OnboardingData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['companyName', 'contactPerson', 'email', 'phone', 'currentWebsite', 'privacyPolicyAccepted'];
    } else if (step === 2) {
      fieldsToValidate = ['businessDescription', 'targetAudience', 'primaryGoal', 'primaryGoalOther'];
    } else if (step === 3) {
      fieldsToValidate = ['hasHostingAndDomain', 'hostingProvider', 'brandAssetsStatus', 'requiredSections'];
    } else if (step === 4) {
      fieldsToValidate = ['hasEcommerce', 'ecommerceProductsCount', 'hasBooking', 'bookingSoftware', 'hasLiveChat', 'hasMultilingual', 'additionalLanguages', 'hasAdminPanel'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        e.preventDefault();
        if (step < 5) {
          nextStep();
        }
      }
    }
  };

  const onSubmit = async (data: OnboardingData) => {
    // 1. Honeypot check (anti-bot)
    if (data.website_honeypot && data.website_honeypot.length > 0) {
      console.log('Spam detected via Honeypot field.');
      // Simulate success to the spammer
      setIsSubmitted(true);
      setSubmissionId('onb_' + Math.random().toString(36).substr(2, 9));
      return;
    }

    // 2. Client-side Rate Limit check
    if (!checkRateLimit()) {
      setSubmissionError(
        'Has alcanzado el límite máximo de envíos permitidos por hora (máximo 3). Por favor, inténtalo más tarde.'
      );
      return;
    }

    setLoading(true);
    setSubmissionError(null);

    try {
      // 3. Sanitizar campos de texto contra XSS
      const sanitizedCompany = DOMPurify.sanitize(data.companyName);
      const sanitizedContact = DOMPurify.sanitize(data.contactPerson);
      const sanitizedBusiness = DOMPurify.sanitize(data.businessDescription);
      const sanitizedAudience = DOMPurify.sanitize(data.targetAudience);
      const sanitizedProvider = data.hostingProvider ? DOMPurify.sanitize(data.hostingProvider) : '';
      const sanitizedGoalOther = data.primaryGoalOther ? DOMPurify.sanitize(data.primaryGoalOther) : '';
      const sanitizedLanguages = data.additionalLanguages ? DOMPurify.sanitize(data.additionalLanguages) : '';
      const sanitizedBooking = data.bookingSoftware ? DOMPurify.sanitize(data.bookingSoftware) : '';

      // 4. IP Hash Mock calculation safely on client
      const randomIp = 'ip_' + Math.random().toString();
      const ipHash = await sha256(randomIp);

      const uniqueId = 'onb_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      
      // Map enums to user friendly values for backend
      const primaryGoalLabel = 
        data.primaryGoal === 'lead_generation' ? 'Generar Leads (Contactos/Cotizaciones)' :
        data.primaryGoal === 'ecommerce' ? 'Vender productos directamente (Tienda Online)' :
        data.primaryGoal === 'portfolio' ? 'Mostrar un portafolio de trabajos/proyectos' :
        data.primaryGoal === 'branding' ? 'Sitio web informativo / Branding institucional' :
        'Otro: ' + sanitizedGoalOther;

      const hostingLabel =
        data.hasHostingAndDomain === 'yes_both' ? `Sí, ambos comprados (Proveedor: ${sanitizedProvider})` :
        data.hasHostingAndDomain === 'only_domain' ? 'Solo dominio.' :
        'No, necesito asesoría con la compra.';

      const brandAssetsLabel =
        data.brandAssetsStatus === 'yes_ready' ? 'Sí, tengo todo listo.' :
        data.brandAssetsStatus === 'logo_no_manual' ? 'Tengo logo pero no manual de marca formal.' :
        'No tengo identidad de marca / Necesito diseño de logo.';

      const budgetRangeLabel =
        data.estimatedBudgetRange === 'range_low' ? '$1,000 - $2,000' :
        data.estimatedBudgetRange === 'range_medium' ? '$2,000 - $5,000' :
        '$5,000+';

      const payload = {
        action: 'onboarding',
        id: uniqueId,
        clientUuid: clientUuid,
        companyName: sanitizedCompany,
        contactPerson: sanitizedContact,
        email: data.email,
        phone: data.phone || '',
        currentWebsite: data.currentWebsite || '',
        businessDescription: sanitizedBusiness,
        targetAudience: sanitizedAudience,
        primaryGoal: primaryGoalLabel,
        hostingStatus: hostingLabel,
        brandAssetsStatus: brandAssetsLabel,
        requiredSections: data.requiredSections.join(', '),
        featuresSelected: [
          data.hasEcommerce ? `E-commerce (${data.ecommerceProductsCount || 0} prod)` : null,
          data.hasBooking ? `Agenda/Citas (${sanitizedBooking})` : null,
          data.hasLiveChat ? 'Chat de soporte' : null,
          data.hasMultilingual ? `Multilingüe (${sanitizedLanguages})` : null,
          data.hasAdminPanel ? 'Panel Autogestionable' : null,
        ].filter(Boolean).join(', '),
        deadline: data.deadline || 'No especificado',
        estimatedBudgetRange: budgetRangeLabel,
        driveFolderLink: '',
        privacyPolicyAccepted: data.privacyPolicyAccepted ? 'Aceptado' : 'No aceptado',
        consentTimestamp: new Date().toISOString(),
        consentVersion: 'v1.2',
        ipAddressHash: ipHash,
        createdAt: new Date().toISOString(),
        status: 'Awaiting_Content'
      };

      // Send to the Google Apps Script Web App
      const res = await fetch('https://script.google.com/macros/s/AKfycbwrKgxGDWtPemqy3UXpfdGPXuEG3lXV91evDbB9QKLB7ERqd8aeWoHfHWW_BkYJ3dGe/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      // Register successful submission timestamp for client-side rate limiting
      registerSubmission();
      
      setSubmissionId(uniqueId);
      setIsSubmitted(true);
      setSubmittedData(data);
    } catch (err: any) {
      setSubmissionError(
        'Ha ocurrido un error al procesar tu solicitud. Por favor, vuelve a intentarlo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Cloud folder submission handler (Phase 2, Step 3)
  const handleDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriveError(null);
    setDriveSuccess(false);

    if (!driveLink) {
      setDriveError('Por favor ingresa un enlace.');
      return;
    }

    const sanitizedUrl = DOMPurify.sanitize(driveLink.trim());

    if (!sanitizedUrl.startsWith('https://')) {
      setDriveError('El enlace debe comenzar con https:// por razones de seguridad.');
      return;
    }

    if (!isCloudUrl(sanitizedUrl)) {
      setDriveError('El enlace debe ser de un proveedor válido (Google Drive, Dropbox, OneDrive).');
      return;
    }

    setDriveLoading(true);

    try {
      const payload = {
        action: 'onboarding_update_drive',
        id: submissionId,
        driveFolderLink: sanitizedUrl,
        updatedAt: new Date().toISOString()
      };

      await fetch('https://script.google.com/macros/s/AKfycbwrKgxGDWtPemqy3UXpfdGPXuEG3lXV91evDbB9QKLB7ERqd8aeWoHfHWW_BkYJ3dGe/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      setIsDriveSubmitted(true);
      setDriveSuccess(true);
      setTimeout(() => setDriveSuccess(false), 5000);
    } catch (err) {
      setDriveError('Error al guardar el enlace. Por favor inténtalo de nuevo.');
    } finally {
      setDriveLoading(false);
    }
  };

  // --- TEXT GENERATION HELPERS (Copy functions) ---

  const copyToClipboard = (text: string, callback: (v: boolean) => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          callback(true);
          setTimeout(() => callback(false), 2000);
        })
        .catch(() => {
          // Fallback
          fallbackCopyText(text, callback);
        });
    } else {
      fallbackCopyText(text, callback);
    }
  };

  const fallbackCopyText = (text: string, callback: (v: boolean) => void) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        callback(true);
        setTimeout(() => callback(false), 2000);
      }
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleDownloadZip = () => {
    const rootName = `${watchCompanyName} - Proyecto Web`;
    const folders = [
      `${rootName}/`,
      `${rootName}/01. Identidad Visual/`,
      `${rootName}/02. Textos/`,
      `${rootName}/03. Multimedia/`
    ];

    try {
      const blob = createSimpleZip(folders);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${watchCompanyName} - Estructura de Carpetas.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating zip:', err);
    }
  };

  const handleCopyStructure = () => {
    const text = `Estructura de Carpetas Recomendada para ${watchCompanyName}:
├── 01. Identidad Visual
├── 02. Textos
└── 03. Multimedia`;
    copyToClipboard(text, setCopiedStructure);
  };

  const handleCopyTextTemplate = () => {
    let sectionsText = '';
    const selected = watchRequiredSections || ['Inicio'];
    
    if (selected.includes('Inicio')) {
      sectionsText += `========================================\nSECCIÓN: INICIO (HOME)\n========================================\n[Escribe aquí tu frase ganadora / propuesta de valor principal]\n- Ejemplo: "Hacemos que tu negocio destaque..."\n\n[Resumen clave de tu negocio / qué haces]\n- Escribe 2 o 3 párrafos explicando tus principales diferenciales.\n\n`;
    }
    if (selected.includes('Nosotros / Quiénes somos')) {
      sectionsText += `========================================\nSECCIÓN: NOSOTROS / QUIÉNES SOMOS\n========================================\n[Historia de la empresa / Visión]\n- ¿Cómo empezó la marca y cuál es su filosofía?\n\n[Información del Equipo]\n- Nombres, cargos y una breve descripción de cada miembro clave.\n\n`;
    }
    if (selected.includes('Servicios / Soluciones')) {
      sectionsText += `========================================\nSECCIÓN: SERVICIOS / SOLUCIONES\n========================================\n[Nombre del Servicio 1]\n- Descripción detallada:\n- Beneficios principales:\n- Precios (si aplica):\n\n[Nombre del Servicio 2]\n- Descripción detallada:\n- Beneficios principales:\n\n`;
    }
    if (selected.includes('Portafolio / Casos de éxito')) {
      sectionsText += `========================================\nSECCIÓN: PORTAFOLIO / CASOS DE ÉXITO\n========================================\n[Proyecto 1]\n- Nombre del proyecto:\n- Reto solucionado:\n- Resultados obtenidos:\n\n`;
    }
    if (selected.includes('Blog / Artículos')) {
      sectionsText += `========================================\nSECCIÓN: BLOG / ARTÍCULOS\n========================================\n[Borrador del primer artículo]\n- Título:\n- Categoría:\n- Contenido principal...\n\n`;
    }
    if (selected.includes('Contacto / Ubicación')) {
      sectionsText += `========================================\nSECCIÓN: CONTACTO / UBICACIÓN\n========================================\n- Teléfono oficial:\n- Correo de soporte:\n- Dirección física (si aplica):\n- Enlaces de Redes Sociales:\n\n`;
    }
    if (selected.includes('Preguntas Frecuentes (FAQ)')) {
      sectionsText += `========================================\nSECCIÓN: PREGUNTAS FRECUENTES (FAQ)\n========================================\nP: ¿Cuál es tu pregunta más frecuente?\nR: [Escribe la respuesta aquí]\n\n`;
    }

    const fullTemplate = `PLANTILLA DE TEXTOS DE CONTENIDO - ${watchCompanyName.toUpperCase()}
Este borrador te ayudará a redactar la información indispensable. Copia y pega esto en un Google Doc o Word.

${sectionsText}`;
    copyToClipboard(fullTemplate, setCopiedTemplate);
  };

  const handleCopyInstructions = () => {
    const text = `INSTRUCCIONES DE PREPARACIÓN DE CONTENIDO - ${watchCompanyName.toUpperCase()}

PASO 1: Crea tu espacio de trabajo en la nube
Crea una carpeta en Google Drive, Dropbox o OneDrive con el nombre: "${watchCompanyName} - Proyecto Web" y organiza estas carpetas adentro:
├── 01. Identidad Visual
├── 02. Textos
└── 03. Multimedia

PASO 2: Redacta tus textos
Usa la plantilla estructurada de textos para rellenar la información de las secciones indispensables que seleccionamos:
${(watchRequiredSections || ['Inicio']).join(', ')}

PASO 3: Comparte los accesos
Configura tu carpeta en la nube como "Cualquier persona con el enlace puede editar" y envía el enlace al desarrollador para comenzar con la maquetación.`;
    copyToClipboard(text, setCopiedInstructions);
  };

  const handleSimulateEmail = async () => {
    const emailToUse = submittedData?.email || watch('email');
    const contactPersonToUse = submittedData?.contactPerson || watch('contactPerson');
    const companyNameToUse = submittedData?.companyName || watch('companyName');
    const requiredSectionsToUse = submittedData?.requiredSections || watchRequiredSections;

    setEmailSentSimulation(true);
    try {
      await fetch('https://script.google.com/macros/s/AKfycbwrKgxGDWtPemqy3UXpfdGPXuEG3lXV91evDbB9QKLB7ERqd8aeWoHfHWW_BkYJ3dGe/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'onboarding_resend_email',
          email: emailToUse,
          contactPerson: contactPersonToUse,
          companyName: companyNameToUse,
          requiredSections: requiredSectionsToUse ? requiredSectionsToUse.join(', ') : 'Inicio'
        }),
      });
      setTimeout(() => setEmailSentSimulation(false), 5000);
    } catch (e) {
      console.error('Error sending email request:', e);
      setEmailSentSimulation(false);
    }
  };

  // --- RENDER FRONTEND ---

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 animate-[fadeIn_0.5s_ease-out]">
        {/* Banner de Éxito */}
        <div className="glass p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 shadow-2xl relative overflow-hidden mb-8 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse"></div>
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-[bounce_1s_ease-in-out_infinite]" />
          <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-3">
            ¡Formulario recibido con éxito! 🚀
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            El diseño de tu web depende de tu contenido. Empecemos a prepararlo hoy mismo siguiendo los siguientes pasos interactivos.
          </p>
        </div>

        {/* Tracker de Progreso del Proyecto */}
        <div className="glass p-6 rounded-2xl border border-glass-border mb-8 bg-white/[0.01]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div className="text-left">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-400">Paso 1</span>
                <span className="text-xs font-extrabold text-[var(--text-primary)]">Formulario Enviado</span>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-px bg-emerald-500/30 mx-4"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50 flex items-center justify-center font-bold text-xs animate-pulse">
                2
              </div>
              <div className="text-left">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-blue-400">Paso 2 (Actual)</span>
                <span className="text-xs font-extrabold text-[var(--text-primary)]">Recolección de Contenido</span>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-px bg-glass-border mx-4"></div>

            <div className="flex items-center gap-2.5 opacity-55">
              <div className="w-8 h-8 rounded-full bg-white/5 text-[var(--text-secondary)] border border-glass-border flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="text-left">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Paso 3</span>
                <span className="text-xs font-extrabold text-[var(--text-primary)]">Reunión de Alineación</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guía Interactiva en 3 Pasos */}
        <div className="space-y-6 mb-8">
          
          {/* Card 1: Cloud Workspace */}
          <GlowCard className="border border-glass-border p-6 rounded-2xl bg-[var(--bg-secondary)]/80">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Paso 1: Tu espacio de trabajo en la nube
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Crea una carpeta raíz en tu servicio de almacenamiento en la nube (Google Drive, Dropbox o OneDrive) llamada <strong className="text-[var(--text-primary)]">"{watchCompanyName} - Proyecto Web"</strong>. Adentro debes organizar tres subcarpetas esenciales para tu material. Puedes **crearlas de forma manual** o bien hacer clic abajo para **descargar la estructura ya organizada en un archivo .zip** listo para descomprimir y subir a tu nube.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    className="px-4 py-2.5 rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-all font-semibold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Descargar estructura (.zip)
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyStructure}
                    className="px-4 py-2.5 rounded-xl border border-glass-border hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all font-semibold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    {copiedStructure ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado con éxito
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5" /> Copiar nombres como referencia
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Card 2: Organization of Content */}
          <GlowCard className="border border-glass-border p-6 rounded-2xl bg-[var(--bg-secondary)]/80">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Paso 2: Organización del Contenido (Secciones)
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Basado en tus elecciones, debes redactar los textos para estas secciones:
                </p>

                {/* Dinamically list selected sections with help text */}
                <div className="space-y-3 mb-5 pl-2 border-l border-glass-border">
                  {(watchRequiredSections || ['Inicio']).map((sect) => (
                    <div key={sect} className="text-xs">
                      <span className="font-bold text-[var(--text-primary)] block">{sect}</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        {sect.includes('Inicio') && 'Define aquí tu frase de entrada o propuesta de valor y añade un resumen de tu marca.'}
                        {sect.includes('Nosotros') && 'Redacta la historia de tu empresa, tu filosofía y sube fotos de tu equipo real.'}
                        {sect.includes('Servicios') && 'Describe a detalle los servicios que ofreces, sus ventajas y opcionalmente sus precios.'}
                        {sect.includes('Portafolio') && 'Describe casos de éxito previos y sube capturas o imágenes de tus trabajos.'}
                        {sect.includes('Blog') && 'Redacta los primeros artículos informativos con sus títulos y categorías correspondientes.'}
                        {sect.includes('Contacto') && 'Prepara tus teléfonos de soporte, correo, redes oficiales y dirección física.'}
                        {sect.includes('Preguntas') && 'Escribe las preguntas más comunes de tus clientes y sus respuestas correspondientes.'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyTextTemplate}
                  className="px-4 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Plantilla copiada
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar plantilla de textos (Google Doc)
                    </>
                  )}
                </button>
              </div>
            </div>
          </GlowCard>

          {/* Card 3: Share Access */}
          <GlowCard className="border border-glass-border p-6 rounded-2xl bg-[var(--bg-secondary)]/80">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Paso 3: Compartir los Accesos
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Asegúrate de configurar los permisos de tu carpeta raíz en Google Drive, Dropbox o OneDrive en <strong className="text-[var(--text-primary)]">"Cualquier persona con el enlace puede editar"</strong> para que el equipo de desarrollo pueda extraer y maquetar el contenido.
                </p>

                {!isDriveSubmitted ? (
                  <form onSubmit={handleDriveSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type="url"
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        disabled={driveLoading}
                        className="w-full h-11 pl-4 pr-12 bg-[var(--bg-primary)]/45 border border-glass-border rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/35 transition-all"
                      />
                    </div>
                    {driveError && (
                      <p className="text-[10px] text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {driveError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={driveLoading}
                      className="px-5 py-2.5 rounded-xl bg-gradient-primary hover:bg-gradient-primary/95 text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 border border-white/20 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-xs"
                    >
                      {driveLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...
                        </>
                      ) : (
                        <>
                          Enviar enlace de carpeta
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Enlace guardado y vinculado a tu briefing con éxito!</span>
                  </div>
                )}
              </div>
            </div>
          </GlowCard>

        </div>

        {/* Footer Utilities */}
        <div className="border-t border-glass-border pt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleCopyInstructions}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copiedInstructions ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> ¡Copiado con éxito!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar estas instrucciones
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSimulateEmail}
            className="px-5 py-2.5 rounded-xl border border-glass-border hover:border-[var(--text-primary)]/35 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-extrabold flex items-center gap-2 cursor-pointer bg-white/[0.01]"
          >
            {emailSentSimulation ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> ¡Guía enviada por correo!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" /> Enviar guía por correo
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6">
      
      {/* Wizard Header / Progress Bar */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-2">
          Briefing de Desarrollo Web
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Paso {step} de 5: {
            step === 1 ? 'Información Básica' :
            step === 2 ? 'Propósito y Audiencia' :
            step === 3 ? 'Requerimientos e Identidad' :
            step === 4 ? 'Funciones Especiales' :
            'Tiempos y Presupuesto'
          }
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4 relative">
          <div 
            className="h-full progress-bar-animated transition-all duration-300 ease-out relative" 
            style={{ width: `${(step / 5) * 100}%` }}
          >
            {/* Glowing head indicator */}
            <div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px] opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Form container */}
      <GlowCard className="border border-glass-border p-6 md:p-8 rounded-3xl bg-[var(--bg-secondary)]/50 shadow-2xl relative">
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
          
          {/* Honeypot hidden input (Spam Prevention) */}
          <div className="hidden">
            <label htmlFor="website_honeypot">Ignorar este campo</label>
            <input
              id="website_honeypot"
              type="text"
              {...register('website_honeypot')}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Nombre de la Empresa / Marca *</Label>
                <Input
                  {...register('companyName')}
                  id="companyName"
                  placeholder="Empresa Ejemplo S.A."
                />
                {errors.companyName && <span className="text-[10px] text-rose-400 block">{errors.companyName.message}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPerson">Persona de Contacto *</Label>
                <Input
                  {...register('contactPerson')}
                  id="contactPerson"
                  placeholder="Juan Pérez"
                />
                {errors.contactPerson && <span className="text-[10px] text-rose-400 block">{errors.contactPerson.message}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="juan@empresa.com"
                />
                {errors.email && <span className="text-[10px] text-rose-400 block">{errors.email.message}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Teléfono / WhatsApp (Opcional)</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="VE"
                      id="phone"
                      aria-label="Teléfono"
                      className="phone-input-dark text-xs"
                      countrySelectComponent={CustomCountrySelect}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currentWebsite">Sitio Web Actual (si aplica, con https://)</Label>
                <Input
                  {...register('currentWebsite')}
                  id="currentWebsite"
                  placeholder="https://empresa.com"
                />
                {errors.currentWebsite && <span className="text-[10px] text-rose-400 block">{errors.currentWebsite.message}</span>}
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="privacyPolicyAccepted"
                  {...register('privacyPolicyAccepted')}
                  className="w-4 h-4 accent-[var(--accent-primary)] mt-0.5 rounded cursor-pointer"
                />
                <label htmlFor="privacyPolicyAccepted" className="text-[10px] leading-relaxed text-[var(--text-secondary)] select-none cursor-pointer">
                  He leído y acepto la <a href="/legal" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="underline hover:text-[var(--accent-primary)] transition-colors">Política de Privacidad de Datos</a> para el procesamiento de este briefing técnico.
                </label>
              </div>
              {errors.privacyPolicyAccepted && <span className="text-[10px] text-rose-400 block mt-1">{errors.privacyPolicyAccepted.message}</span>}
            </div>
          )}

          {/* STEP 2: Purpose and Audience */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="businessDescription">¿A qué se dedica tu negocio y cuál es tu propuesta de valor? *</Label>
                <Textarea
                  {...register('businessDescription')}
                  id="businessDescription"
                  rows={4}
                  placeholder="Explica detalladamente las actividades comerciales, ventajas competitivas o propósito de tu marca..."
                />
                {errors.businessDescription && <span className="text-[10px] text-rose-400 block">{errors.businessDescription.message}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="targetAudience">¿Quién es tu cliente ideal / público objetivo? *</Label>
                <Textarea
                  {...register('targetAudience')}
                  id="targetAudience"
                  rows={3}
                  placeholder="Edades, intereses, necesidades o perfil demográfico del público..."
                />
                {errors.targetAudience && <span className="text-[10px] text-rose-400 block">{errors.targetAudience.message}</span>}
              </div>

              <div className="space-y-2">
                <Label>¿Cuál es el objetivo principal del nuevo sitio web? *</Label>
                <div className="space-y-2 pt-1">
                  {[
                    { key: 'lead_generation', val: 'Generar Leads (Contactos/Cotizaciones)' },
                    { key: 'ecommerce', val: 'Vender productos directamente (Tienda Online)' },
                    { key: 'portfolio', val: 'Mostrar un portafolio de trabajos/proyectos' },
                    { key: 'branding', val: 'Sitio web informativo / Branding institucional' },
                    { key: 'other', val: 'Otro' },
                  ].map((option) => (
                    <div key={option.key} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        id={`goal_${option.key}`}
                        value={option.key}
                        {...register('primaryGoal')}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor={`goal_${option.key}`} className="text-[var(--text-secondary)] select-none cursor-pointer">
                        {option.val}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {watchPrimaryGoal === 'other' && (
                <div className="space-y-1.5 animate-[fadeIn_0.2s_ease]">
                  <Label htmlFor="primaryGoalOther">Especifica el objetivo *</Label>
                  <Input
                    {...register('primaryGoalOther')}
                    id="primaryGoalOther"
                    placeholder="Describe el objetivo aquí..."
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Tech and Identity */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>¿Cuentas actualmente con dominio y hosting propio? *</Label>
                <div className="space-y-2 pt-1">
                  {[
                    { key: 'yes_both', val: 'Sí, ambos comprados.' },
                    { key: 'only_domain', val: 'Solo dominio.' },
                    { key: 'no_need_help', val: 'No, necesito asesoría con la compra.' }
                  ].map(option => (
                    <div key={option.key} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        id={`hosting_${option.key}`}
                        value={option.key}
                        {...register('hasHostingAndDomain')}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor={`hosting_${option.key}`} className="text-[var(--text-secondary)] select-none cursor-pointer">
                        {option.val}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {watchHasHosting === 'yes_both' && (
                <div className="space-y-1.5 animate-[fadeIn_0.2s_ease]">
                  <Label htmlFor="hostingProvider">¿Con qué proveedor de Hosting?</Label>
                  <Input
                    {...register('hostingProvider')}
                    id="hostingProvider"
                    placeholder="Ej. Siteground, Hostinger, Bluehost..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>¿Cuentas con manual de identidad, logo en alta y paleta de colores? *</Label>
                <div className="space-y-2 pt-1">
                  {[
                    { key: 'yes_ready', val: 'Sí, tengo todo listo.' },
                    { key: 'logo_no_manual', val: 'Tengo logo pero no manual de marca formal.' },
                    { key: 'no_need_design', val: 'No tengo identidad de marca / Necesito diseño de logo.' }
                  ].map(option => (
                    <div key={option.key} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        id={`identity_${option.key}`}
                        value={option.key}
                        {...register('brandAssetsStatus')}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor={`identity_${option.key}`} className="text-[var(--text-secondary)] select-none cursor-pointer">
                        {option.val}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>¿Qué secciones/páginas son indispensables en tu web? *</Label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    'Inicio (Home)',
                    'Nosotros / Quiénes somos',
                    'Servicios / Soluciones',
                    'Portafolio / Casos de éxito',
                    'Blog / Artículos',
                    'Contacto / Ubicación',
                    'Preguntas Frecuentes (FAQ)'
                  ].map((section) => (
                    <div key={section} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        id={`sect_${section}`}
                        value={section}
                        {...register('requiredSections')}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                      <label htmlFor={`sect_${section}`} className="text-[var(--text-secondary)] select-none cursor-pointer">
                        {section}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.requiredSections && <span className="text-[10px] text-rose-400 block">{errors.requiredSections.message}</span>}
              </div>
            </div>
          )}

          {/* STEP 4: Special Features */}
          {step === 4 && (
            <div className="space-y-5">
              <Label>¿Qué funciones especiales requiere tu web?</Label>
              <div className="space-y-4 pt-1">
                
                {/* Ecommerce checkbox */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="hasEcommerce"
                      {...register('hasEcommerce')}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="hasEcommerce" className="text-[var(--text-secondary)] select-none cursor-pointer font-bold">
                      Pasarela de Pagos (E-commerce)
                    </label>
                  </div>
                  {watchEcommerce && (
                    <div className="pl-6 space-y-1.5 animate-[fadeIn_0.2s_ease]">
                      <Label htmlFor="ecommerceProductsCount">¿Cuántos productos estimas vender inicialmente? *</Label>
                      <Input
                        {...register('ecommerceProductsCount')}
                        type="number"
                        id="ecommerceProductsCount"
                        placeholder="50"
                        min="1"
                      />
                      {errors.ecommerceProductsCount && <span className="text-[10px] text-rose-400 block">{errors.ecommerceProductsCount.message}</span>}
                    </div>
                  )}
                </div>

                {/* Booking checkbox */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="hasBooking"
                      {...register('hasBooking')}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="hasBooking" className="text-[var(--text-secondary)] select-none cursor-pointer font-bold">
                      Agenda, reservas o citas en línea
                    </label>
                  </div>
                  {watchBooking && (
                    <div className="pl-6 space-y-1.5 animate-[fadeIn_0.2s_ease]">
                      <Label htmlFor="bookingSoftware">¿Qué software usas o prefieres? (ej. Calendly, Acuity...)</Label>
                      <Input
                        {...register('bookingSoftware')}
                        id="bookingSoftware"
                        placeholder="Calendly, Acuity, Integración propia..."
                      />
                    </div>
                  )}
                </div>

                {/* Live support checkbox */}
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="hasLiveChat"
                    {...register('hasLiveChat')}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="hasLiveChat" className="text-[var(--text-secondary)] select-none cursor-pointer font-bold">
                    Chat de soporte en vivo (WhatsApp, Tawk.to, etc.)
                  </label>
                </div>

                {/* Multilingual checkbox */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="hasMultilingual"
                      {...register('hasMultilingual')}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="hasMultilingual" className="text-[var(--text-secondary)] select-none cursor-pointer font-bold">
                      Sitio Multilingüe (Idiomas adicionales)
                    </label>
                  </div>
                  {watchMultilingual && (
                    <div className="pl-6 space-y-1.5 animate-[fadeIn_0.2s_ease]">
                      <Label htmlFor="additionalLanguages">¿Qué idiomas adicionales?</Label>
                      <Input
                        {...register('additionalLanguages')}
                        id="additionalLanguages"
                        placeholder="Ej. Inglés, Francés, Portugués..."
                      />
                    </div>
                  )}
                </div>

                {/* Admin panel checkbox */}
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="hasAdminPanel"
                    {...register('hasAdminPanel')}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="hasAdminPanel" className="text-[var(--text-secondary)] select-none cursor-pointer font-bold">
                    Panel de administración para autogestionar textos y blogs
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* STEP 5: Timeline & Budget */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="deadline">¿Tienes alguna fecha límite o evento para el lanzamiento?</Label>
                <Input
                  {...register('deadline')}
                  type="date"
                  id="deadline"
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>Presupuesto estimado para el proyecto *</Label>
                <div className="space-y-2 pt-1">
                  {[
                    { key: 'range_low', val: 'Rango Inicial ($1,000 - $2,000)' },
                    { key: 'range_medium', val: 'Rango Medio ($2,000 - $5,000)' },
                    { key: 'range_high', val: 'Rango Avanzado ($5,000+)' }
                  ].map(option => (
                    <div key={option.key} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        id={`budget_${option.key}`}
                        value={option.key}
                        {...register('estimatedBudgetRange')}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor={`budget_${option.key}`} className="text-[var(--text-secondary)] select-none cursor-pointer">
                        {option.val}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {submissionError && (
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="pt-4 flex items-center justify-between border-t border-glass-border">
            {step > 1 ? (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                disabled={loading}
                className="h-10 px-4 rounded-xl border border-glass-border hover:bg-white/5 text-xs flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Atrás
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="h-10 px-5 rounded-xl bg-gradient-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs flex items-center gap-1 text-white shadow-lg hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] cursor-pointer"
              >
                Siguiente <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="h-10 px-6 rounded-xl bg-gradient-primary hover:bg-gradient-primary/95 text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 border border-white/20 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-xs"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    Enviar Formulario <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>

        </form>
      </GlowCard>
    </div>
  );
}
