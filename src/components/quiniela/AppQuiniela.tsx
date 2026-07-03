import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Pages
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

// Components
import { Toaster } from 'sonner';

// Configuración del QueryClient con caché agresiva
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      retry: 2,
    },
  },
});

// Persistencia en localStorage (fallback rápido para la sesión, idb-keyval es ideal para async)
const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'QUINELA_OFFLINE_CACHE',
});

export default function AppQuiniela() {
  // Manejador de reconexión para sincronización diferida
  useEffect(() => {
    const handleOnline = () => {
      // Aquí despacharemos las peticiones retenidas de Supabase
      console.log('🌐 Conexión recuperada. Sincronizando predicciones locales...');
      // TODO: Lógica para vaciar la cola deIndexedDB y hacer push a Supabase
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <HashRouter basename="/">
        <div className="w-full h-full min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" theme="dark" />
      </HashRouter>
    </PersistQueryClientProvider>
  );
}
