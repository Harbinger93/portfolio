import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/quiniela/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { RainbowButton } from '../ui/rainbow-button';
import { useI18n } from '../../i18n/context';
import { ShieldAlert } from 'lucide-react';

// Interfaz básica
interface Team {
  name: string;
  flag_url: string;
}

interface Match {
  id: number;
  team_home_id: string;
  team_away_id: string;
  match_time: string;
  goals_home: number | null;
  goals_away: number | null;
  team_home?: Team;
  team_away?: Team;
  stage?: {
    sequence_order: number;
    display_name: string;
  };
  is_finished?: boolean;
  winner_id?: string;
}

export default function TournamentBracket() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [localPredictions, setLocalPredictions] = useState<Record<number, any>>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeTab, setActiveTab] = useState<string>('0');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Fetch Partidos (Caché por 2 minutos)
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team_home:teams!team_home_id(name, flag_url),
          team_away:teams!team_away_id(name, flag_url),
          stage:tournament_stages(sequence_order, display_name)
        `)
        .order('match_time', { ascending: true });
      if (error) throw error;
      return data as Match[];
    }
  });

  // Fetch Predicciones existentes
  const { data: serverPredictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Cargar predicciones del servidor en estado local
  useEffect(() => {
    if (serverPredictions && serverPredictions.length > 0) {
      const loaded: Record<number, any> = {};
      serverPredictions.forEach((p: any) => {
        loaded[p.match_id] = {
          match_id: p.match_id,
          home: p.pred_goals_home,
          away: p.pred_goals_away,
          winner: p.pred_winner_id
        };
      });
      setLocalPredictions(loaded);
    }
  }, [serverPredictions]);

  // Mutación para guardar (Batch Update)
  const saveMutation = useMutation({
    mutationFn: async (predictions: Record<number, any>) => {
      // Filtrar predicciones incompletas
      const payload = Object.values(predictions).filter(
        p => p.home !== undefined && p.home !== null && p.home !== '' && p.away !== undefined && p.away !== null && p.away !== ''
      );
      if (payload.length === 0) return;
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No estás autenticado');

      const upsertData = payload.map((p) => ({
        user_id: userData.user.id,
        match_id: p.match_id,
        pred_goals_home: p.home,
        pred_goals_away: p.away,
        pred_winner_id: p.winner || null,
      }));

      const { error } = await supabase.from('predictions').upsert(upsertData, { onConflict: 'user_id, match_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t('quiniela.savedSuccess'));
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      setLocalPredictions({}); // Limpiar estado local si se guardó
    },
    onError: (err: any) => {
      if (isOffline || err.message === 'Failed to fetch') {
        toast.info(t('quiniela.offlineInfo'));
      } else {
        toast.error(`${t('quiniela.error')}: ${err.message}`);
      }
    }
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveMutation.mutate(localPredictions);
    setConfirmOpen(false);
  };

  const updatePrediction = (matchId: number, home: number | '', away: number | '', winner?: string) => {
    setLocalPredictions(prev => ({
      ...prev,
      [matchId]: { match_id: matchId, home, away, winner }
    }));
  };

  if (matchesLoading || predictionsLoading) return <div className="text-center py-8">{t('quiniela.loading')}</div>;

  const hasUnsavedChanges = JSON.stringify(localPredictions) !== JSON.stringify(
    serverPredictions?.reduce((acc: any, p: any) => ({
      ...acc,
      [p.match_id]: { match_id: p.match_id, home: p.pred_goals_home, away: p.pred_goals_away, winner: p.pred_winner_id }
    }), {}) || {}
  );

  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 md:p-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-4 w-full max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 md:mb-0 text-center md:text-left">
          {t('quiniela.brackets')}
        </h2>
        {user ? (
          <>
            <RainbowButton
              onClick={() => setConfirmOpen(true)}
              disabled={Object.keys(localPredictions).length === 0 || saveMutation.isPending || !hasUnsavedChanges}
              className="w-full md:w-auto"
            >
              {saveMutation.isPending ? t('quiniela.saving') : hasUnsavedChanges ? t('quiniela.saveButton') : t('quiniela.savedButton')}
            </RainbowButton>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border rounded-2xl shadow-2xl p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    {t('quiniela.confirmTitle')}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground pt-4 text-base text-center">
                    {t('quiniela.confirmDesc1')} <br/><br/>
                    <strong className="text-foreground">{t('quiniela.confirmDesc2')}</strong> {t('quiniela.confirmDesc3')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} className="w-full sm:w-auto text-muted-foreground border-border hover:bg-muted">
                    {t('quiniela.cancel')}
                  </Button>
                  <Button type="button" onClick={handleSave} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                    {t('quiniela.confirmSave')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-sm text-slate-400 border border-white/10 bg-white/5 px-4 py-2 rounded-full">{t('quiniela.loginToSave')}</p>
        )}
      </div>

      {isOffline && (
        <div className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-md mb-6 border border-yellow-500/50">
          ⚠️ Estás navegando sin conexión. Puedes seguir editando tu quiniela; los cambios se sincronizarán al volver.
        </div>
      )}

      {/* Disclaimer de Bloqueo */}
      <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-500/30 rounded-xl p-4 mb-8 flex items-start sm:items-center gap-3 w-full max-w-[1400px] mx-auto text-blue-800 dark:text-blue-200 shadow-lg shadow-blue-500/5 dark:shadow-blue-900/10">
        <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm font-medium leading-relaxed">{t('quiniela.lockDisclaimer')}</p>
      </div>

      {/* Tabs / Pestañas de Fases */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-white/10 touch-pan-x">
        {Object.entries(
          (matches || []).reduce((acc: any, match) => {
            const seq = match.stage?.sequence_order || 0;
            if (!acc[seq]) acc[seq] = { name: match.stage?.display_name || 'Fase', matches: [] };
            acc[seq].matches.push(match);
            return acc;
          }, {})
        )
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([seq, stageData]: [string, any]) => (
          <button
            key={seq}
            onClick={() => {
              setActiveTab(seq);
              document.getElementById('stage-' + seq)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-t-lg font-bold transition-all ${
              activeTab === seq 
                ? 'bg-primary text-primary-foreground shadow-[0_-4px_15px_rgba(var(--primary),0.3)]' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {stageData.name}
          </button>
        ))}
      </div>

      {/* Contenedor del Bracket - Estilo Árbol Conectado */}
      <div className="flex gap-8 overflow-x-auto pb-8 touch-pan-x" style={{ scrollbarWidth: 'none' }}>
        {Object.entries(
          (matches || []).reduce((acc: any, match) => {
            const seq = match.stage?.sequence_order || 0;
            if (!acc[seq]) acc[seq] = { name: match.stage?.display_name || 'Fase', matches: [] };
            acc[seq].matches.push(match);
            return acc;
          }, {})
        )
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([seq, stageData]: [string, any]) => (
          <div key={seq} id={`stage-${seq}`} className="flex flex-col min-w-[280px] max-w-[320px] gap-3 shrink-0 relative pt-2">
            
            {/* Visual Connector Line (Except on last column) */}
            {Number(seq) < 4 && (
              <div className="hidden md:block absolute -right-4 top-10 bottom-10 w-4 border-r-2 border-slate-700/30 rounded-r-3xl z-0" />
            )}

            <div className="flex flex-col justify-start gap-4 py-2 relative z-10 h-max">
              {stageData.matches.map((match: Match) => {
                const localTime = new Intl.DateTimeFormat('es-ES', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }).format(new Date(match.match_time));

                const currentPred = localPredictions[match.id] || { home: '', away: '' };
                const isTie = currentPred.home !== '' && currentPred.away !== '' && currentPred.home === currentPred.away;
                const isAlreadySaved = serverPredictions?.some((p: any) => p.match_id === match.id);
                // Bloqueado si el partido terminó, faltan 15 mins o menos para empezar, ya se guardó, o faltan equipos por definir
                const matchLimitTime = new Date(new Date(match.match_time).getTime() - 15 * 60000);
                const isLocked = match.is_finished || matchLimitTime < new Date() || isAlreadySaved || !match.team_home_id || !match.team_away_id;

                // Lógica de clic para desempatar: si hay empate, al hacer clic en un equipo se elige como ganador
                const handleTeamClick = (teamId: string) => {
                  if (isTie && !isLocked) {
                    updatePrediction(match.id, currentPred.home, currentPred.away, teamId);
                  }
                };

                return (
                  <div key={match.id} className="glass rounded-xl p-3 shadow-md flex flex-col gap-1 border border-border relative overflow-hidden bg-card/80 transition-all hover:border-primary/50">
                    
                    <div className="text-[10px] font-medium text-muted-foreground text-center uppercase tracking-wider mb-1">
                      {localTime}
                      {match.is_finished && <span className="ml-2 text-green-500 font-bold">({t('quiniela.finished')})</span>}
                    </div>
                    
                    {/* Home Team Row */}
                    <div 
                      onClick={() => !isLocked && match.team_home_id && handleTeamClick(match.team_home_id)}
                      className={`flex items-center justify-between p-1 px-2 rounded-lg transition-all ${!isLocked && isTie ? 'cursor-pointer hover:bg-white/5' : ''} ${currentPred.winner === match.team_home_id || match.winner_id === match.team_home_id ? 'ring-1 ring-primary bg-primary/10' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {match.team_home?.flag_url ? (
                          <img src={match.team_home.flag_url} alt={match.team_home_id} className="w-7 h-5 object-cover rounded-[2px]" />
                        ) : (
                          <div className="w-7 h-5 bg-slate-800 rounded-[2px]" />
                        )}
                        <span className={`text-[13px] font-semibold ${currentPred.winner === match.team_home_id || match.winner_id === match.team_home_id ? 'text-primary' : 'text-foreground/80'}`}>{match.team_home?.name || match.team_home_id || t('quiniela.toBeDefined')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.is_finished && match.goals_home !== null && (
                          <span className="text-sm font-bold text-green-500">{match.goals_home}</span>
                        )}
                        <Input 
                          type="number" 
                          min="0" 
                          disabled={isLocked}
                          className={`w-10 h-8 text-center font-bold text-md p-1 bg-background border-border text-foreground ${isLocked ? 'opacity-50 cursor-not-allowed' : 'focus-visible:ring-primary'}`}
                          value={currentPred.home}
                          onChange={(e) => {
                            if (isLocked) return;
                            const val = e.target.value === '' ? '' : parseInt(e.target.value);
                            const newWinner = val !== currentPred.away ? undefined : currentPred.winner;
                            updatePrediction(match.id, val, currentPred.away, newWinner);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Away Team Row */}
                    <div 
                      onClick={() => !isLocked && match.team_away_id && handleTeamClick(match.team_away_id)}
                      className={`flex items-center justify-between p-1 px-2 rounded-lg transition-all ${!isLocked && isTie ? 'cursor-pointer hover:bg-white/5' : ''} ${currentPred.winner === match.team_away_id || match.winner_id === match.team_away_id ? 'ring-1 ring-primary bg-primary/10' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {match.team_away?.flag_url ? (
                          <img src={match.team_away.flag_url} alt={match.team_away_id} className="w-7 h-5 object-cover rounded-[2px]" />
                        ) : (
                          <div className="w-7 h-5 bg-slate-800 rounded-[2px]" />
                        )}
                        <span className={`text-[13px] font-semibold ${currentPred.winner === match.team_away_id || match.winner_id === match.team_away_id ? 'text-primary' : 'text-foreground/80'}`}>{match.team_away?.name || match.team_away_id || t('quiniela.toBeDefined')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.is_finished && match.goals_away !== null && (
                          <span className="text-sm font-bold text-green-500">{match.goals_away}</span>
                        )}
                        <Input 
                          type="number" 
                          min="0" 
                          disabled={isLocked}
                          className={`w-10 h-8 text-center font-bold text-md p-1 bg-background border-border text-foreground ${isLocked ? 'opacity-50 cursor-not-allowed' : 'focus-visible:ring-primary'}`}
                          value={currentPred.away}
                          onChange={(e) => {
                            if (isLocked) return;
                            const val = e.target.value === '' ? '' : parseInt(e.target.value);
                            const newWinner = currentPred.home !== val ? undefined : currentPred.winner;
                            updatePrediction(match.id, currentPred.home, val, newWinner);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {isTie && !currentPred.winner && (
                      <div className="text-[10px] text-blue-400 text-center animate-pulse mt-1 font-medium">
                        Haz clic en el equipo que avanza
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
