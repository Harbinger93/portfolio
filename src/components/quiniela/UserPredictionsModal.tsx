import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/quiniela/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useI18n } from '../../i18n/context';

interface UserPredictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  totalPoints: number;
}

export default function UserPredictionsModal({ isOpen, onClose, userId, username, totalPoints }: UserPredictionsModalProps) {
  const { t } = useI18n();

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team_home:teams!team_home_id(*),
          team_away:teams!team_away_id(*),
          stage:tournament_stages(*)
        `)
        .order('match_time', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: isOpen
  });

  const { data: predictions } = useQuery({
    queryKey: ['predictions', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('predictions').select('*').eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!userId
  });

  // Solo mostrar partidos para los cuales el usuario hizo una predicción,
  // ordenados cronológicamente
  const userMatches = matches?.filter(m => predictions?.some(p => p.match_id === m.id)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f0f13] text-foreground border-border/10 p-0 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 border-b border-white/10 pb-4 bg-background/50 backdrop-blur-md">
          <DialogTitle className="text-xl font-bold text-white flex flex-col gap-1">
            <span>Predicciones de: {username}</span>
            <span className="text-sm font-medium text-slate-400">Total Puntos: {totalPoints} pts</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 overflow-y-auto overscroll-contain custom-scrollbar flex-1 flex flex-col gap-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {userMatches.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
              No hay predicciones registradas aún.
            </div>
          ) : (
            userMatches.map(match => {
              const pred = predictions?.find(p => p.match_id === match.id);
              if (!pred) return null;

              return (
                <div key={match.id} className="border border-white/10 rounded-xl p-4 bg-white/5 relative flex flex-col gap-3">
                  {/* Teams */}
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-1 w-24">
                      <span className="font-bold text-sm text-white text-center truncate w-full">{match.team_home?.name}</span>
                      {match.team_home?.flag_url && (
                        <img src={match.team_home.flag_url} alt="Flag" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                      )}
                    </div>
                    <span className="font-black text-xs text-white/50">VS</span>
                    <div className="flex flex-col items-center gap-1 w-24">
                      <span className="font-bold text-sm text-white text-center truncate w-full">{match.team_away?.name}</span>
                      {match.team_away?.flag_url && (
                        <img src={match.team_away.flag_url} alt="Flag" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                      )}
                    </div>
                  </div>

                  {/* Results area */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col items-center justify-center border-r border-white/10">
                      <span className="text-[9px] font-black tracking-widest text-white mb-1">PREDICCIÓN</span>
                      <span className="text-2xl font-black text-white tracking-widest">
                        {pred.pred_goals_home} - {pred.pred_goals_away}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black tracking-widest text-white mb-1">RESULTADO REAL</span>
                      {match.is_finished ? (
                        <span className="text-2xl font-black text-white tracking-widest">
                          {match.goals_home} - {match.goals_away}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-white/40 italic flex items-center justify-center h-[32px]">
                          En espera
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end bg-background/50 backdrop-blur-md">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-white/20 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
