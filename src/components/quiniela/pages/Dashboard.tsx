import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/quiniela/supabase';
import AuthModal from '../AuthModal';
import LeaderboardPodium from '../LeaderboardPodium';
import TournamentBracket from '../TournamentBracket';
import FAQ from '../FAQ';
import TermsModal from '../TermsModal';
import UserPredictionsModal from '../UserPredictionsModal';
import { Button } from '../../ui/button';
import { RainbowButton } from '../../ui/rainbow-button';
import { useI18n } from '../../../i18n/context';
import { LogIn, LogOut, User, ShieldAlert, Wifi, WifiOff, ChevronDown, Trophy, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useI18n();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [predictionsModalOpen, setPredictionsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedTotalPoints, setSelectedTotalPoints] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
        setIsAdmin(data?.is_admin || false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
        setIsAdmin(data?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const queryClient = useQueryClient();

  // Escuchar cambios en tiempo real en perfiles (puntos)
  useEffect(() => {
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Fetch Leaderboard (Caché agresivo)
  const { data: profiles } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, total_points, predictions(points_earned)')
        .order('total_points', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="w-full min-h-screen pt-36 md:pt-28 pb-24 relative overflow-hidden bg-background text-foreground">

      {/* Header / Nav de Quiniela */}
      <header className="absolute top-20 md:top-4 right-4 md:right-8 z-40 flex items-center gap-4 py-4">
        <div className="flex items-center gap-4">
          {!isOnline && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-medium">
              <WifiOff className="w-3 h-3" />
              <span>Sin Conexión</span>
            </div>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex gap-3 items-center bg-card hover:bg-muted backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {user.user_metadata?.username || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-white/5 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Panel Admin
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      supabase.auth.signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-white/5 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 bg-card hover:bg-muted backdrop-blur-md px-5 py-2.5 rounded-full border border-border transition-all shadow-lg text-sm font-medium text-foreground group"
            >
              <LogIn className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              Ingresar
            </button>
          )}
        </div>
      </header>

      <main className="px-4 sm:px-8 mt-4 space-y-20 relative z-10">
        {!user && (
          <div className="text-center glass border border-white/10 p-10 rounded-2xl max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">¡Bienvenido a la Quiniela!</h2>
            <p className="mb-8 text-muted-foreground text-lg">Debes iniciar sesión o registrarte para guardar tus predicciones.</p>
            <RainbowButton onClick={() => setAuthModalOpen(true)} className="text-lg py-6 px-10">Crear cuenta ahora</RainbowButton>
          </div>
        )}

        {/* Podium y Leaderboard */}
        <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto pt-4">
          <section className="w-full">
            <h2 className="text-3xl font-black text-center mb-16 text-[#00f2fe] drop-shadow-sm">
              {t('quiniela.globalLeaderboard')}
            </h2>
            <LeaderboardPodium profiles={profiles || []} />
            
            {/* Tabla de posiciones con scroll */}
            <div className="mt-12 glass border border-border bg-card/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-4xl mx-auto">
              <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-foreground">{t('quiniela.leaderboardTableTitle')}</h3>
                </div>
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['leaderboard'] })}
                  className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/50 px-3 py-1.5 rounded-full transition-all border border-cyan-800/50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refrescar
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/80 sticky top-0 z-20 shadow-sm backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 font-bold text-muted-foreground w-16 text-center">#</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground">{t('quiniela.participant')}</th>
                      <th className="px-4 py-4 font-bold text-muted-foreground text-center">Exactos</th>
                      <th className="px-4 py-4 font-bold text-muted-foreground text-center">Parciales</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-center">Acciones</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-right">{t('quiniela.totalPoints')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {profiles?.map((p: any, index: number) => {
                      const isCurrentUser = user && user.id === p.id;
                      const exacts = p.predictions?.filter((pr: any) => pr.points_earned >= 3).length || 0;
                      const partials = p.predictions?.filter((pr: any) => pr.points_earned === 1 || pr.points_earned === 2).length || 0;
                      return (
                        <tr key={p.id} className={`transition-colors ${isCurrentUser ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400 scale-[1.02] transform shadow-lg relative z-10' : 'hover:bg-muted/50'}`}>
                          <td className="px-6 py-4 font-black text-center text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.avatar_url ? (
                                <img src={p.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-border object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                  {(p.full_name || p.username || '?').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className={`font-semibold ${isCurrentUser ? 'text-cyan-400' : 'text-foreground'}`}>{p.full_name || p.username}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-emerald-400/90">
                            {exacts}
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-sky-400/90">
                            {partials}
                          </td>
                          <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedUserId(p.id);
                                  setSelectedUsername(p.full_name || p.username || 'Usuario');
                                  setSelectedTotalPoints(p.total_points);
                                  setPredictionsModalOpen(true);
                                }}
                                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-full shadow-md transition-all"
                              >
                                Ver predicciones
                              </button>
                          </td>
                          <td className={`px-6 py-4 text-right font-black text-lg ${isCurrentUser ? 'text-cyan-400' : 'text-primary'}`}>
                            {p.total_points}
                          </td>
                        </tr>
                      );
                    })}
                    {(!profiles || profiles.length === 0) && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          {t('quiniela.noScores')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Brackets */}
          <section className="w-full">
            <TournamentBracket />
          </section>
        </div>
        <FAQ />

        {/* Pequeño footer de la quiniela */}
        <footer className="w-full text-center py-6 border-t border-white/10 mt-12">
          <button 
            onClick={() => setTermsModalOpen(true)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Ver Términos y Condiciones de la Plataforma Recreativa
          </button>
        </footer>
      </main>

      {/* Modal de Auth */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => {}}
        onOpenTerms={() => {
          setAuthModalOpen(false);
          setTermsModalOpen(true);
        }}
      />

      <TermsModal 
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      <UserPredictionsModal
        isOpen={predictionsModalOpen}
        onClose={() => setPredictionsModalOpen(false)}
        userId={selectedUserId}
        username={selectedUsername}
        totalPoints={selectedTotalPoints}
      />
    </div>
  );
}
