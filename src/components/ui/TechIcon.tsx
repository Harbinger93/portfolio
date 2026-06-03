import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
}

export default function TechIcon({ name, className = 'w-4 h-4' }: TechIconProps) {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();

  // Return SVG based on normalized name
  if (normalized.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23 23 20.46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    );
  }

  if (normalized.includes('astro')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.167 12.875a.5.5 0 00-.417-.417l-4.167-.833-.833-4.167a.5.5 0 00-.833 0l-.833 4.167-4.167.833a.5.5 0 000 .833l4.167.833.833 4.167a.5.5 0 00.833 0l.833-4.167 4.167-.833a.5.5 0 00.417-.417zM2.875 14.167a.5.5 0 01.417-.417l2.5-.5.5-2.5a.5.5 0 01.833 0l.5 2.5 2.5.5a.5.5 0 010 .833l-2.5.5-.5 2.5a.5.5 0 01-.833 0l-.5-2.5-2.5-.5a.5.5 0 01-.417-.417zm8.5-8.5a.5.5 0 01.417-.417l1.25-.25.25-1.25a.5.5 0 01.833 0l.25 1.25 1.25.25a.5.5 0 010 .833l-1.25.25-.25 1.25a.5.5 0 01-.833 0l-.25-1.25-1.25-.25a.5.5 0 01-.417-.417z"/>
      </svg>
    );
  }

  if (normalized.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.91,0.23,1.57,0.89,2.29,1.62C13.67,10.62,15.03,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.91-0.23-1.57-0.89-2.29-1.62C16.34,6.18,14.98,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.91,0.23,1.57,0.89,2.29,1.62c1.18,1.19,2.54,2.58,5.51,2.58c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.91-0.23-1.57-0.89-2.29-1.62C10.34,13.38,8.98,12,6.001,12z"/>
      </svg>
    );
  }

  if (normalized.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.36 11.004l-9.366 9.362c-.782.782-2.05.782-2.831 0l-6.527-6.522a2.002 2.002 0 010-2.83l9.366-9.363c.78-.782 2.049-.782 2.83 0l6.527 6.523a2.001 2.001 0 010 2.83z" opacity="0.15"/>
        <path d="M13.435 2.586a1 1 0 00-1.707.707v5.5a.5.5 0 01-.5.5h-5.5a1 1 0 00-.707 1.707l8.5 8.5a1 1 0 001.707-.707v-5.5a.5.5 0 01.5-.5h5.5a1 1 0 00.707-1.707l-8.5-8.5z"/>
      </svg>
    );
  }

  if (normalized.includes('wordpress')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.16 12.79l-2.7 7.84c.81.24 1.66.37 2.54.37a9.55 9.55 0 0 0 3.74-.76l-.12-.2-3.46-7.25zm5.12-3.43c.1-.18.16-.36.16-.52 0-.42-.32-.79-.84-.79-.53 0-.95.42-1.37.95l-3.33 4.76 2.75 7.64a9.55 9.55 0 0 0 4.09-5.47c.07-.53.11-1.07.11-1.61 0-1.85-.79-3.75-1.57-4.96zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 1.25c2.4 0 4.6.82 6.36 2.19l-1.92 5.28c-.95-1.16-2.17-1.64-3.38-1.64-.95 0-1.9.37-2.69 1.11L10.3 8.36C11.52 6.2 12 3.61 12 1.25zM9.15 8.48l3.53 9.95A9.55 9.55 0 0 1 1.25 12c0-2.43.91-4.64 2.41-6.33l5.49 15.4c.05-.15.1-.31.14-.48l2.13-6.19-2.27-6.19z"/>
      </svg>
    );
  }

  if (normalized.includes('vercel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L24 22H0L12 2Z" />
      </svg>
    );
  }

  if (normalized.includes('leaflet')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 8 18 11c1 3-2.5 6-7 9z" />
        <path d="M9 19c2.5-4 5.5-6.5 9-8" />
      </svg>
    );
  }

  if (normalized.includes('mongo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c-4.4 0-8 3.6-8 8 0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8z" />
        <path d="M12 6c-2.2 0-4 1.8-4 4" />
      </svg>
    );
  }

  if (normalized.includes('map')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    );
  }

  if (normalized.includes('zod')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M12 3L3 12l9 9 9-9-9-9z" />
      </svg>
    );
  }

  if (normalized.includes('shadcn')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (normalized.includes('ga4') || normalized.includes('analytics') || normalized.includes('data')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }

  if (normalized.includes('gtm') || normalized.includes('tag')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    );
  }

  if (normalized.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5a10.5 10.5 0 0 0-10.5 10.5c0 4.12 2.38 7.69 5.88 9.42L8.5 19.3A8.47 8.47 0 0 1 3.6 12 8.4 8.4 0 0 1 12 3.6a8.4 8.4 0 0 1 8.4 8.4 8.47 8.47 0 0 1-4.9 7.3l1.12 2.12c3.5-1.73 5.88-5.3 5.88-9.42A10.5 10.5 0 0 0 12 1.5zm-1 6.5h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    );
  }

  if (normalized.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.002 0C5.378 0 5 5.378 5 5.378l.056 2.378H12v1.078h-6.94c-2.73 0-3.326.685-3.326 3.325v3.136c0 1.94 1.258 3.518 3.52 3.518h1.8v-2.5c0-2.43 1.97-4.4 4.4-4.4h6.056c2.43 0 4.4-1.97 4.4-4.4V5.378c0-3.6-2.584-5.378-5.378-5.378H12.002zM8.5 2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm12.16 8.5c0 2.43-1.97 4.4-4.4 4.4h-6.056c-2.43 0-4.4 1.97-4.4 4.4v5.184c0 3.6 2.584 5.378 5.378 5.378h3.376c6.624 0 7-5.378 7-5.378l-.056-2.378H12V21.5h6.94c2.73 0 3.326-.685 3.326-3.325v-3.136c0-1.94-1.258-3.518-3.52-3.518h-1.8v2.5c0 2.43-1.97 4.4-4.4 4.4h-2.04v-.96zm-5.16 10.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
    );
  }

  if (normalized.includes('django')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.66 18.22c-1.39 0-2.55-.42-3.23-1.16-.62-.68-.89-1.68-.89-3.21 0-1.46.26-2.47.88-3.17.65-.74 1.77-1.16 3.14-1.16 1.48 0 2.65.46 3.23 1.25V7.47h-5.06V5.41h7.12v12.43c-.76.79-2.22 1.38-5.19 1.38zm.37-6.66c-.7 0-1.24.23-1.52.65-.28.42-.39 1.07-.39 2.06 0 .97.11 1.61.39 2.02.28.41.83.63 1.55.63.74 0 1.25-.22 1.5-.63v-4.1c-.26-.41-.78-.63-1.53-.63zm-9.03 6.32c-.52 0-.96-.13-1.26-.37-.29-.24-.44-.65-.44-1.25v-.31h2v.22c0 .24.05.41.13.51.08.1.25.15.53.15.54 0 .84-.36.84-1.1V10.82h-1.8v-2h3.83v9.06c0 1.15-.31 1.94-.9 2.37-.58.42-1.51.63-2.93.63z" />
      </svg>
    );
  }

  if (normalized.includes('postgres') || normalized.includes('sql')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.66 0 3 1.34 3 3v1.78c.89.4 1.59 1.17 1.9 2.12l.1.33c.12.35.1.7-.06.98-.16.28-.46.46-.8.46h-.24z"/>
      </svg>
    );
  }

  if (normalized.includes('redis')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm8 6.3l-8 4.4L4 8.3l8-4.4 8 4.4zM4 10.3l7 3.8v7.4l-7-3.8V10.3zm9 11.2v-7.4l7-3.8v7.4l-7 3.8z"/>
      </svg>
    );
  }

  if (normalized.includes('docker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V8.906c0-.102-.084-.186-.186-.186h-2.119c-.103 0-.186.084-.186.186v1.987c0 .102.083.185.186.185m-2.954-5.43h2.118c.103 0 .185-.083.185-.186V3.475c0-.103-.082-.186-.185-.186h-2.118c-.103 0-.186.083-.186.186v1.987c0 .103.083.186.186.186m0 2.715h2.118c.103 0 .185-.083.185-.186V6.19c0-.102-.082-.186-.185-.186h-2.118c-.103 0-.186.084-.186.186v1.987c0 .103.083.186.186.186m-2.953 2.715h2.119c.102 0 .185-.083.185-.185V8.906c0-.102-.083-.186-.185-.186H8.076c-.102 0-.185.084-.185.186v1.987c0 .102.083.185.185.185m0-2.715h2.119c.102 0 .185-.083.185-.186V6.19c0-.102-.083-.186-.185-.186H8.076c-.102 0-.185.084-.185.186v1.987c0 .103.083.186.185.186m-2.955 2.715h2.119c.102 0 .185-.083.185-.185V8.906c0-.102-.083-.186-.185-.186H5.12c-.102 0-.185.084-.185.186v1.987c0 .102.083.185.185.185m-2.952 0h2.118c.103 0 .186-.083.186-.185V8.906c0-.102-.083-.186-.186-.186H2.168c-.102 0-.185.084-.185.186v1.987c0 .102.083.185.185.185m-2.952 0h2.118c.103 0 .185-.083.185-.185V8.906c0-.102-.082-.186-.185-.186h-2.118c-.103 0-.186.084-.186.186v1.987c0 .102.083.185.186.185m-2.952-2.715h2.118c.103 0 .185-.083.185-.186V6.19c0-.102-.082-.186-.185-.186h-2.118c-.103 0-.186.084-.186.186v1.987c0 .103.083.186.186.186m26.13 1.358c-.506-.017-.988.18-1.32.53-.1-.1-.205-.191-.314-.272a.311.311 0 00-.27-.04.312.312 0 00-.2.22c-.226.793-.578 1.542-1.04 2.224l-.15-.072a.314.314 0 00-.4.108.31.31 0 00.11.4l.2.094c-.452.545-.986.999-1.58 1.34l-.066-.176a.313.313 0 00-.374-.185.312.312 0 00-.2.35l.083.226c-1.353.585-2.854.767-4.298.52-.087-.417-.267-.805-.53-1.127a.311.311 0 00-.437-.037.313.313 0 00-.037.437c.31.378.497.857.53 1.357-3.927.467-7.915-1.579-9.988-5.11a.312.312 0 00-.4-.127.311.311 0 00-.13.4c2.247 3.826 6.55 6.068 10.87 5.568.17 0 .33-.06.45-.17a.312.312 0 00.08-.24c-.035-.3-.137-.59-.3-.84l.092.012c1.382.164 2.782-.016 4.07-.52l.063.155a.311.311 0 00.373.178.312.312 0 00.185-.373l-.069-.17c.563-.341 1.066-.78 1.488-1.299l.176.084a.31.31 0 00.413-.131.311.311 0 00-.131-.413l-.155-.074c.42-.647.737-1.365.94-2.12l.182.01c.17.01.31-.102.34-.27a.312.312 0 00-.22-.353l-.2-.012c.168-.535.253-1.096.253-1.66 0-1.85-.92-3.553-2.482-4.593a.313.313 0 00-.43.087.312.312 0 00.088.43c1.36.905 2.166 2.39 2.166 4.004c0 .487-.073.972-.217 1.437z"/>
      </svg>
    );
  }

  if (normalized.includes('aws')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.6 15c-.4 0-.8-.1-1.1-.3-.3-.2-.5-.5-.7-.8v.9c-.3.1-.6.2-.9.2-.5 0-.8-.1-1.1-.4-.3-.3-.4-.7-.4-1.2 0-.6.2-1.1.5-1.4.3-.3.8-.5 1.5-.5.2 0 .5.1.7.2v-.4c0-.3-.1-.6-.2-.7-.2-.2-.5-.3-.8-.3-.4 0-.8.1-1.2.3l-.4-.9c.6-.4 1.3-.6 2.1-.6.7 0 1.2.2 1.5.5.3.3.5.8.5 1.5v3.1c.1.3.1.6.3.7v.1h-1.6zm-1.8-2.3c-.3 0-.5.1-.7.2-.2.1-.3.3-.3.6 0 .4.2.6.6.6.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5v-.7h-.3z"/>
      </svg>
    );
  }

  if (normalized.includes('git')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 15V9a4 4 0 0 0-4-4H9" />
        <line x1="6" y1="9" x2="6" y2="15" />
      </svg>
    );
  }

  if (normalized.includes('compass') || normalized.includes('travel') || normalized.includes('koyobo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  if (normalized.includes('credit') || normalized.includes('payment') || normalized.includes('card')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  }

  if (normalized.includes('building') || normalized.includes('intranet') || normalized.includes('corporate')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
        <line x1="15" y1="16" x2="15" y2="22" />
        <line x1="9" y1="8" x2="9.01" y2="8" />
        <line x1="15" y1="8" x2="15.01" y2="8" />
        <line x1="9" y1="12" x2="9.01" y2="12" />
        <line x1="15" y1="12" x2="15.01" y2="12" />
      </svg>
    );
  }

  if (normalized.includes('user') || normalized.includes('migrante') || normalized.includes('comutu')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    );
  }

  if (normalized.includes('javascript') || normalized.includes('js')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.034 18.5a.78.78 0 0 0-.25-.33c-.23-.19-.65-.33-1.28-.43-1.03-.18-1.57-.42-1.82-.7a1.6 1.6 0 0 1-.36-.98c0-.46.18-.84.55-1.12.37-.29.93-.43 1.69-.43.71 0 1.25.13 1.63.39.38.25.62.66.72 1.2l-1.89.37c-.05-.28-.15-.47-.32-.57-.17-.09-.43-.14-.77-.14-.33 0-.58.05-.75.14-.17.09-.25.22-.25.4 0 .12.06.22.18.29.11.08.4.15.86.23.97.16 1.62.39 1.95.68.32.3.49.72.49 1.27 0 .54-.2 1-.59 1.34-.39.35-.97.52-1.74.52-.8 0-1.46-.19-1.97-.56-.51-.37-.77-.94-.78-1.7h1.9c.02.32.14.56.36.71.22.14.56.22 1.02.22.38 0 .66-.06.84-.17.18-.11.27-.27.27-.47zm-10.45-3.32a.77.77 0 0 0-.25-.33c-.23-.19-.66-.33-1.29-.43-1.02-.18-1.56-.42-1.81-.7a1.62 1.62 0 0 1-.36-.98c0-.46.18-.84.55-1.12.37-.29.93-.43 1.69-.43.71 0 1.25.13 1.63.39.38.25.61.66.72 1.2l-1.9.37c-.05-.28-.15-.47-.32-.57-.17-.09-.43-.14-.77-.14-.33 0-.58.05-.75.14-.17.09-.25.22-.25.4 0 .12.06.22.18.29.11.08.4.15.86.23.97.16 1.62.39 1.95.68.32.3.49.72.49 1.27 0 .54-.2 1-.59 1.34-.39.35-.97.52-1.74.52-.8 0-1.46-.19-1.97-.56-.51-.37-.77-.94-.78-1.7h1.9c.02.32.14.56.36.71.22.14.56.22 1.02.22.38 0 .66-.06.84-.17.18-.11.27-.27.27-.47z" />
      </svg>
    );
  }

  if (normalized.includes('typescript') || normalized.includes('ts')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.034 18.5a.78.78 0 0 0-.25-.33c-.23-.19-.65-.33-1.28-.43-1.03-.18-1.57-.42-1.82-.7a1.6 1.6 0 0 1-.36-.98c0-.46.18-.84.55-1.12.37-.29.93-.43 1.69-.43.71 0 1.25.13 1.63.39.38.25.62.66.72 1.2l-1.89.37c-.05-.28-.15-.47-.32-.57-.17-.09-.43-.14-.77-.14-.33 0-.58.05-.75.14-.17.09-.25.22-.25.4 0 .12.06.22.18.29.11.08.4.15.86.23.97.16 1.62.39 1.95.68.32.3.49.72.49 1.27 0 .54-.2 1-.59 1.34-.39.35-.97.52-1.74.52-.8 0-1.46-.19-1.97-.56-.51-.37-.77-.94-.78-1.7h1.9c.02.32.14.56.36.71.22.14.56.22 1.02.22.38 0 .66-.06.84-.17.18-.11.27-.27.27-.47zm-10.45-3.32h-3v-6.5h8v2h-5v4.5z" />
      </svg>
    );
  }

  // Fallback (Generic Code Icon)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
