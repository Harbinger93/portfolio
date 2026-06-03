import ga4Landing from '../img/Dashboard GA4/GA4-Dashboard-Control-total-de-tus-analíticas-landing.webp';
import ga4Dashboard from '../img/Dashboard GA4/Dashboard-Principal-GA4-dashboard.webp';
import ga4Reports from '../img/Dashboard GA4/Reportes-y-Analíticas-GA4.webp';
import ga4About from '../img/Dashboard GA4/Conocer-más-Capacidades-del-Sistema-GA4Dash-About.webp';
import ga4Vault from '../img/Dashboard GA4/boveda-de-contraseñas.webp';
import ga4Tasks from '../img/Dashboard GA4/tableto-de-planificación.webp';

import adiwappMain from '../img/Adiwapp/Captura de pantalla 2026-06-02 155754.webp';
import adiwappImg1 from '../img/Adiwapp/Captura de pantalla 2026-06-02 151930.webp';
import adiwappImg2 from '../img/Adiwapp/Captura de pantalla 2026-06-02 151947.webp';
import adiwappImg3 from '../img/Adiwapp/Captura de pantalla 2026-06-02 152003.webp';

import koyoboMain from '../img/Koyobo/Koyobo-Adventures-Expertos-Home.webp';
import koyoboChina from '../img/Koyobo/China-y-Feria-de-Cantón-Negocios-Internacionales.webp';
import koyoboDestinos from '../img/Koyobo/Destinos-Koyobo-Adventures.webp';
import koyoboNosotros from '../img/Koyobo/Nosotros-Koyobo-Adventures-Nosotros.webp';
import koyoboServicios from '../img/Koyobo/Nuestros-Servicios-Koyobo-Adventures.webp';
import koyoboVideo from '../img/Koyobo/Koyobo Adventures _ Expertos en Logística Corporativa.mp4';

import intranetMain from '../img/Intranet/intranet-landing.webp';
import intranetPerfil from '../img/Intranet/Perfil – intranet.webp';
import intranetBiblioteca from '../img/Intranet/intranet-carga-informacion-biblioteca.webp';
import intranetMapa from '../img/Intranet/intranet-carga-informacion-mapa.webp';
import intranetTutorial from '../img/Intranet/intranet-tutorial.webp';

import migracionMain from '../img/Migracion/SomosMigrantes-ComoTu-Trámites-de-Extranjería-en-España.webp';
import migracionTramites from '../img/Migracion/Trámites-de-Extranjería-en-España-SomosMigrantes-ComoTu.webp';
import migracionFaq from '../img/Migracion/Preguntas-Frecuentes-Extranjería-España-SomosMigrantes-ComoTu.webp';
import migracionTestimonios from '../img/Migracion/Testimonios-de-Clientes-SomosMigrantes-ComoTu.webp';
import migracionContacto from '../img/Migracion/Contacto-Asesoría-de-Extranjería-SomosMigrantes-ComoTu.webp';

import iesaHome from '../img/IESA/IESA-Escuela-de-Gerencia-home.png';
import iesaCursos from '../img/IESA/Cursos-y-Programas-IESA-Escuela-de-Gerencia.png';
import iesaMaestria from '../img/IESA/Maestria-en-Administración-IESA-Escuela-de-Gerencia.png';
import iesaProfesores from '../img/IESA/Profesores-IESA-Escuela-de-Gerencia.png';
import iesaProfesor from '../img/IESA/Pagina-profesor-IESA-Escuela-de-Gerencia.png';

import simpletvRecarga from '../img/SimpleTV/Email-RECARGA.png';
import simpletvBienvenida from '../img/SimpleTV/Email-Bienvenida.png';
import simpletvFibra from '../img/SimpleTV/Oferta Simplefibra - El doble de velocidad.png';
import simpletvBdv from '../img/SimpleTV/Promo BDV - 1.png';
import simpletvD2d from '../img/SimpleTV/Door to door.png';

export const projects = {
  en: [
    {
      id: 'ga4-portal',
      icon: 'LayoutDashboard',
      titleKey: 'projects.ga4.title',
      descKey: 'projects.ga4.shortDesc',
      fullDescKey: 'projects.ga4.desc',
      solutionKey: 'projects.ga4.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'Supabase', 'GA4', 'GTM', 'Vercel'],
      imageUrl: ga4Landing,
      isDashboard: true,
      images: [ga4Landing, ga4Dashboard, ga4Reports, ga4About, ga4Vault, ga4Tasks],
      url: '#'
    },
    {
      id: 'adiwapp',
      icon: 'CreditCard',
      titleKey: 'projects.adiwapp.title',
      descKey: 'projects.adiwapp.shortDesc',
      fullDescKey: 'projects.adiwapp.desc',
      solutionKey: 'projects.adiwapp.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
      imageUrl: adiwappMain,
      isDashboard: true,
      images: [adiwappMain, adiwappImg1, adiwappImg2, adiwappImg3],
      url: '#'
    },
    {
      id: 'koyobo',
      icon: 'Compass',
      titleKey: 'projects.koyobo.title',
      descKey: 'projects.koyobo.shortDesc',
      fullDescKey: 'projects.koyobo.desc',
      solutionKey: 'projects.koyobo.solution',
      tags: ['Astro', 'React', 'Tailwind CSS', 'WordPress Headless'],
      imageUrl: koyoboMain,
      isDashboard: false,
      images: [koyoboVideo, koyoboMain, koyoboChina, koyoboDestinos, koyoboNosotros, koyoboServicios],
      url: '#'
    },
    {
      id: 'intranet',
      icon: 'Building2',
      titleKey: 'projects.intranet.title',
      descKey: 'projects.intranet.shortDesc',
      fullDescKey: 'projects.intranet.desc',
      solutionKey: 'projects.intranet.solution',
      tags: ['WordPress Headless', 'Leaflet.js', 'WordPress REST API', 'React'],
      imageUrl: intranetMain,
      isDashboard: true,
      images: [intranetMain, intranetPerfil, intranetBiblioteca, intranetMapa, intranetTutorial],
      url: '#'
    },
    {
      id: 'somosmigrantes',
      icon: 'UserCheck',
      titleKey: 'projects.somosmigrantes.title',
      descKey: 'projects.somosmigrantes.shortDesc',
      fullDescKey: 'projects.somosmigrantes.desc',
      solutionKey: 'projects.somosmigrantes.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'shadcn/ui', 'mapcn', 'Zod', 'Supabase'],
      imageUrl: migracionMain,
      isDashboard: false,
      images: [migracionMain, migracionTramites, migracionFaq, migracionTestimonios, migracionContacto],
      url: '#'
    },
    {
      id: 'iesa',
      icon: 'Globe',
      titleKey: 'projects.iesa.title',
      descKey: 'projects.iesa.shortDesc',
      fullDescKey: 'projects.iesa.desc',
      solutionKey: 'projects.iesa.solution',
      tags: ['WordPress', 'PHP', 'JavaScript', 'CSS3', 'SEO', 'Performance'],
      imageUrl: iesaHome,
      isDashboard: false,
      images: [iesaHome, iesaCursos, iesaMaestria, iesaProfesores, iesaProfesor],
      url: '#'
    },
    {
      id: 'simpletv',
      icon: 'Mail',
      titleKey: 'projects.simpletv.title',
      descKey: 'projects.simpletv.shortDesc',
      fullDescKey: 'projects.simpletv.desc',
      solutionKey: 'projects.simpletv.solution',
      tags: ['HTML5', 'CSS', 'Email Design', 'MJML', 'Responsiveness', 'Email Marketing'],
      imageUrl: simpletvRecarga,
      isDashboard: false,
      images: [simpletvRecarga, simpletvBienvenida, simpletvFibra, simpletvBdv, simpletvD2d],
      url: '#'
    }
  ],
  es: [
    {
      id: 'ga4-portal',
      icon: 'LayoutDashboard',
      titleKey: 'projects.ga4.title',
      descKey: 'projects.ga4.shortDesc',
      fullDescKey: 'projects.ga4.desc',
      solutionKey: 'projects.ga4.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'Supabase', 'GA4', 'GTM', 'Vercel'],
      imageUrl: ga4Landing,
      isDashboard: true,
      images: [ga4Landing, ga4Dashboard, ga4Reports, ga4About, ga4Vault, ga4Tasks],
      url: '#'
    },
    {
      id: 'adiwapp',
      icon: 'CreditCard',
      titleKey: 'projects.adiwapp.title',
      descKey: 'projects.adiwapp.shortDesc',
      fullDescKey: 'projects.adiwapp.desc',
      solutionKey: 'projects.adiwapp.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
      imageUrl: adiwappMain,
      isDashboard: true,
      images: [adiwappMain, adiwappImg1, adiwappImg2, adiwappImg3],
      url: '#'
    },
    {
      id: 'koyobo',
      icon: 'Compass',
      titleKey: 'projects.koyobo.title',
      descKey: 'projects.koyobo.shortDesc',
      fullDescKey: 'projects.koyobo.desc',
      solutionKey: 'projects.koyobo.solution',
      tags: ['Astro', 'React', 'Tailwind CSS', 'WordPress Headless'],
      imageUrl: koyoboMain,
      isDashboard: false,
      images: [koyoboVideo, koyoboMain, koyoboChina, koyoboDestinos, koyoboNosotros, koyoboServicios],
      url: '#'
    },
    {
      id: 'intranet',
      icon: 'Building2',
      titleKey: 'projects.intranet.title',
      descKey: 'projects.intranet.shortDesc',
      fullDescKey: 'projects.intranet.desc',
      solutionKey: 'projects.intranet.solution',
      tags: ['WordPress Headless', 'Leaflet.js', 'WordPress REST API', 'React'],
      imageUrl: intranetMain,
      isDashboard: true,
      images: [intranetMain, intranetPerfil, intranetBiblioteca, intranetMapa, intranetTutorial],
      url: '#'
    },
    {
      id: 'somosmigrantes',
      icon: 'UserCheck',
      titleKey: 'projects.somosmigrantes.title',
      descKey: 'projects.somosmigrantes.shortDesc',
      fullDescKey: 'projects.somosmigrantes.desc',
      solutionKey: 'projects.somosmigrantes.solution',
      tags: ['Astro', 'React.js', 'Tailwind CSS', 'shadcn/ui', 'mapcn', 'Zod', 'Supabase'],
      imageUrl: migracionMain,
      isDashboard: false,
      images: [migracionMain, migracionTramites, migracionFaq, migracionTestimonios, migracionContacto],
      url: '#'
    },
    {
      id: 'iesa',
      icon: 'Globe',
      titleKey: 'projects.iesa.title',
      descKey: 'projects.iesa.shortDesc',
      fullDescKey: 'projects.iesa.desc',
      solutionKey: 'projects.iesa.solution',
      tags: ['WordPress', 'PHP', 'JavaScript', 'CSS3', 'SEO', 'Performance'],
      imageUrl: iesaHome,
      isDashboard: false,
      images: [iesaHome, iesaCursos, iesaMaestria, iesaProfesores, iesaProfesor],
      url: '#'
    },
    {
      id: 'simpletv',
      icon: 'Mail',
      titleKey: 'projects.simpletv.title',
      descKey: 'projects.simpletv.shortDesc',
      fullDescKey: 'projects.simpletv.desc',
      solutionKey: 'projects.simpletv.solution',
      tags: ['HTML5', 'CSS', 'Email Design', 'MJML', 'Responsiveness', 'Email Marketing'],
      imageUrl: simpletvRecarga,
      isDashboard: false,
      images: [simpletvRecarga, simpletvBienvenida, simpletvFibra, simpletvBdv, simpletvD2d],
      url: '#'
    }
  ]
};


export const techStack = {
  en: [
    {
      id: 'frontend',
      titleKey: 'techstack.frontend.title',
      itemsKey: 'techstack.frontend.items',
      tags: ['React', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'WordPress'],
      percentage: 95
    },
    {
      id: 'backend',
      titleKey: 'techstack.backend.title',
      itemsKey: 'techstack.backend.items',
      tags: ['Node.js', 'Python', 'Django', 'Express', 'Astro'],
      percentage: 90
    },
    {
      id: 'database',
      titleKey: 'techstack.database.title',
      itemsKey: 'techstack.database.items',
      tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
      percentage: 85
    },
    {
      id: 'devops',
      titleKey: 'techstack.devops.title',
      itemsKey: 'techstack.devops.items',
      tags: ['Docker', 'AWS', 'Linux', 'Git', 'CI/CD'],
      percentage: 88
    },
    {
      id: 'security',
      titleKey: 'techstack.security.title',
      itemsKey: 'techstack.security.items',
      tags: ['Web Security', 'SSL/TLS', 'Auth'],
      percentage: 80
    },
    {
      id: 'data',
      titleKey: 'techstack.data.title',
      itemsKey: 'techstack.data.items',
      tags: ['Machine Learning', 'Data Analysis'],
      percentage: 75
    }
  ],
  es: [
    {
      id: 'frontend',
      titleKey: 'techstack.frontend.title',
      itemsKey: 'techstack.frontend.items',
      tags: ['React', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'WordPress'],
      percentage: 95
    },
    {
      id: 'backend',
      titleKey: 'techstack.backend.title',
      itemsKey: 'techstack.backend.items',
      tags: ['Node.js', 'Python', 'Django', 'Express', 'Astro'],
      percentage: 90
    },
    {
      id: 'database',
      titleKey: 'techstack.database.title',
      itemsKey: 'techstack.database.items',
      tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
      percentage: 85
    },
    {
      id: 'devops',
      titleKey: 'techstack.devops.title',
      itemsKey: 'techstack.devops.items',
      tags: ['Docker', 'AWS', 'Linux', 'Git', 'CI/CD'],
      percentage: 88
    },
    {
      id: 'security',
      titleKey: 'techstack.security.title',
      itemsKey: 'techstack.security.items',
      tags: ['Seguridad Web', 'SSL/TLS', 'Auth'],
      percentage: 80
    },
    {
      id: 'data',
      titleKey: 'techstack.data.title',
      itemsKey: 'techstack.data.items',
      tags: ['Machine Learning', 'Análisis de Datos'],
      percentage: 75
    }
  ],
};

export const aboutCards = {
  en: [
    { titleKey: 'about.card1.title', descKey: 'about.card1.desc', icon: 'CheckCircle' },
    { titleKey: 'about.card2.title', descKey: 'about.card2.desc', icon: 'Target' },
    { titleKey: 'about.card3.title', descKey: 'about.card3.desc', icon: 'Users' },
    { titleKey: 'about.card4.title', descKey: 'about.card4.desc', icon: 'ThumbsUp' },
    { titleKey: 'about.card5.title', descKey: 'about.card5.desc', icon: 'Calendar' },
    { titleKey: 'about.card6.title', descKey: 'about.card6.desc', icon: 'TrendingUp' },
  ],
  es: [
    { titleKey: 'about.card1.title', descKey: 'about.card1.desc', icon: 'CheckCircle' },
    { titleKey: 'about.card2.title', descKey: 'about.card2.desc', icon: 'Target' },
    { titleKey: 'about.card3.title', descKey: 'about.card3.desc', icon: 'Users' },
    { titleKey: 'about.card4.title', descKey: 'about.card4.desc', icon: 'ThumbsUp' },
    { titleKey: 'about.card5.title', descKey: 'about.card5.desc', icon: 'Calendar' },
    { titleKey: 'about.card6.title', descKey: 'about.card6.desc', icon: 'TrendingUp' },
  ]
};
