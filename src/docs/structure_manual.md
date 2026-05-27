# Manual de Estructura y Funcionamiento del Portafolio

Este documento detalla la arquitectura, la estructura de directorios, el flujo de datos y la organización de componentes del proyecto.

---

## 1. Arquitectura General

La web está construida con **Astro 5** como framework principal, utilizando **React 19** para la interactividad de la interfaz y **Tailwind CSS v4** para los estilos.

### Arquitectura de Islas de Astro
Por defecto, Astro genera HTML estático con cero JavaScript en el cliente para maximizar la velocidad de carga. Para los elementos interactivos, Astro utiliza su **isla de componentes**. 
En [BaseLayout.astro](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/layouts/BaseLayout.astro), verás directivas como:
- `client:only="react"` o `client:load`: Esto le indica a Astro que debe enviar el código de React al navegador e hidratar el componente para que sea interactivo.

---

## 2. Estructura de Directorios

La estructura de carpetas dentro del directorio `src/` se organiza de la siguiente manera:

```text
src/
├── components/          # Componentes React de la aplicación
│   ├── layout/          # Elementos estructurales (Navbar, Footer, LenisProvider)
│   ├── sections/        # Secciones principales del Home (Hero, Proyectos, Habilidades, etc.)
│   ├── security/        # Capa de protección y bloqueo de inspección (ProtectionLayer)
│   └── ui/              # Componentes de UI reutilizables (SkillBar, GlowBackground, etc.)
├── config/              # Archivos de configuración y datos estáticos (listas de proyectos, tags)
├── docs/                # Documentación técnica (este manual)
├── i18n/                # Sistema de traducción bilingüe (contexto y diccionario de textos)
├── layouts/             # Plantillas base de Astro (BaseLayout.astro)
├── pages/               # Enrutamiento de páginas de Astro (index.astro es la página de inicio)
├── styles/              # Archivos CSS globales (global.css con Tailwind v4)
└── utils/               # Funciones de utilidad (control de tema y listeners de seguridad)
```

---

## 3. Funcionamiento de los Elementos Clave

### A. Sistema de Traducciones (i18n)
La web es completamente bilingüe (Español / Inglés). Los textos **no están hardcodeados** en los componentes visuales.
1. **Diccionario de Textos:** En [translations.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/i18n/translations.ts) se definen todos los literales organizados bajo las claves `en` y `es`.
2. **Contexto de Traducción:** En [context.tsx](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/i18n/context.tsx) se crea el Hook `useI18n()`, el cual expone la función `t('clave.del.texto')` que devuelve el texto correspondiente según el idioma activo.
3. **Configuración de Datos:** Los proyectos y habilidades en [data.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/config/data.ts) contienen referencias a claves de traducción (como `projects.messenger.title`), las cuales se resuelven dinámicamente en los componentes usando `t()`.

### B. Capa de Seguridad (ProtectionLayer)
Para evitar que se inspeccione la web o se copie el código fuente mediante atajos rápidos:
1. **Listeners Globales:** El archivo [security.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/utils/security.ts) captura los eventos de clic derecho (`contextmenu`), atajos de teclado (`F12`, `Ctrl+Shift+I`, `Ctrl+U`, etc.) y desactiva la selección y arrastre de elementos.
2. **Capa Visual:** El componente [ProtectionLayer.tsx](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/components/security/ProtectionLayer.tsx) inicializa estos scripts. Si detecta que las dimensiones de la ventana sugieren la apertura de DevTools, muestra una pantalla de bloqueo a pantalla completa. Además, muestra alertas tipo Toast cuando se intenta hacer clic derecho.

### C. Gestión de Rendimiento (Fondo Animado y Scroll)
1. **Lenis Scroll:** El portafolio implementa scroll suave utilizando la librería **Lenis** a través del componente [LenisProvider.tsx](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/components/layout/LenisProvider.tsx), que sincroniza el scroll en un bucle de `requestAnimationFrame`.
2. **Canvas Glow Background:** En [GlowBackground.tsx](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/components/ui/GlowBackground.tsx) se dibuja un fondo dinámico con gradientes radiales animados en un elemento HTML5 Canvas.

### D. Sistema de Estilos y Temas
1. **Tailwind v4:** El archivo [global.css](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/styles/global.css) utiliza la directiva `@import "tailwindcss"` e integra el tema mediante `@theme` (donde se definen colores personalizados de la paleta oscura).
2. **Variables de CSS:** El sistema de cambio de tema (Claro / Oscuro) modifica la clase `.light` en la etiqueta `<html>`. Las variables de color globales (como `--bg-primary` y `--text-primary`) cambian de valor según el tema activo, asegurando una transición suave.

---

## 4. Guía para Modificar y Expandir la Web

- **Para cambiar un texto:** Ve a [translations.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/i18n/translations.ts) y localiza la clave correspondiente en la sección `es` y `en`.
- **Para añadir un proyecto:** Primero añade las descripciones correspondientes en [translations.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/i18n/translations.ts) y luego agrega el objeto del proyecto en [data.ts](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/config/data.ts) relacionándolo con las claves de traducción creadas.
- **Para agregar un nuevo estilo o color:** Edita [global.css](file:///c:/Users/gabriel.vazquez/Desktop/Proyectos/proyecto-portafolio/src/styles/global.css) en la sección `@theme` o define variables de CSS en `:root` y `html.light`.
