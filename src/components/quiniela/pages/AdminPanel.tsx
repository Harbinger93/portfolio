import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/quiniela/supabase';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import { Navigate, Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../../ui/dialog';
import { ShieldAlert, Users, Trophy, Settings, ArrowLeft, Loader2, Save, Download, FileJson } from 'lucide-react';
import { useI18n } from '../../../i18n/context';

export default function AdminPanel() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('matches');
  const [currentView, setCurrentView] = useState<'matches' | 'users' | 'config'>('matches');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Verificar Admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoadingAuth(false);
        return;
      }
      const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (error || !data?.is_admin) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      setLoadingAuth(false);
    }
    checkAdmin();
  }, []);

  // Fetch Partidos con información de equipos (para banderas)
  const { data: matches, isLoading } = useQuery({
    queryKey: ['admin_matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *, 
          stage:tournament_stages(sequence_order, display_name),
          team_home:teams!matches_team_home_id_fkey(name, flag_url),
          team_away:teams!matches_team_away_id_fkey(name, flag_url)
        `)
        .order('match_time', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true
  });

  // Fetch Usuarios
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, predictions(id, points_earned, match_id, pred_goals_home, pred_goals_away, pred_winner_id)')
        .order('total_points', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true && currentView === 'users'
  });

  // Fetch Equipos para el selector manual
  const { data: teams } = useQuery({
    queryKey: ['admin_teams'],
    queryFn: async () => {
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true
  });

  const exportCSV = () => {
    if (!users) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Usuario,Nombre,Plenos (3pts),Aciertos Parciales (1pt),Puntos Totales\n"
      + users.map((u: any) => {
          const plenos = u.predictions?.filter((p: any) => p.points_earned === 3).length || 0;
          const aciertos = u.predictions?.filter((p: any) => p.points_earned === 1).length || 0;
          return `${u.email || ''},${u.username || ''},${u.full_name || ''},${plenos},${aciertos},${u.total_points}`;
        }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_posiciones.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [matchResults, setMatchResults] = useState<Record<number, { home: number; away: number; winner?: string }>>({});

  const finalizeMutation = useMutation({
    mutationFn: async (matchId: number) => {
      const result = matchResults[matchId];
      if (!result || result.home === undefined || result.away === undefined) {
        throw new Error('Debes ingresar los goles de ambos equipos');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/quiniela/recalculate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({
          matchId,
          homeGoals: result.home,
          awayGoals: result.away,
          winnerId: result.winner || null,
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al procesar el partido');
    },
    onSuccess: () => {
      toast.success('Partido finalizado y puntos calculados correctamente.');
      queryClient.invalidateQueries({ queryKey: ['admin_matches'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message}`);
    }
  });

  const unfinalizeMutation = useMutation({
    mutationFn: async (matchId: number) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/quiniela/unfinalize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ matchId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al revertir el partido');
    },
    onSuccess: () => {
      toast.success('Partido revertido correctamente.');
      queryClient.invalidateQueries({ queryKey: ['admin_matches'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message}`);
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ matchId, field, teamId }: { matchId: number, field: 'team_home_id' | 'team_away_id' | 'match_time', teamId: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/quiniela/update-match-team', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ matchId, field, teamId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar equipo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_matches'] });
      toast.success('Información actualizada en el partido.');
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message}`);
    }
  });

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center">Verificando credenciales...</div>;
  if (isAdmin === false) return <Navigate to="/" replace />;

  return (
    <div className="w-full min-h-screen pt-24 bg-background flex flex-col md:flex-row text-foreground transition-colors">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border/10 bg-card flex flex-col min-h-[calc(100vh-6rem)]">
        <div className="p-6 border-b border-border/10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{t('quiniela.admin.panel')}</h2>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('matches'); setCurrentView('matches'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'matches' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">{t('quiniela.admin.matches')}</span>
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setCurrentView('users'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{t('quiniela.admin.users')}</span>
          </button>
          <button 
            onClick={() => { setActiveTab('config'); setCurrentView('config'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'config' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{t('quiniela.admin.config')}</span>
          </button>
        </nav>
      </aside>

      {/* Floating Back Button */}
      <Link 
        to="/"
        className="fixed bottom-24 left-6 z-50 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('quiniela.admin.backApp')}
      </Link>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {currentView === 'matches' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-foreground">{t('quiniela.admin.matchesTitle')}</h1>
                <p className="text-slate-400 mt-2">Actualiza los resultados y finaliza los partidos. El sistema calculará los puntos y avanzará a los ganadores automáticamente.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-10 text-muted-foreground"><Loader2 className="animate-spin w-8 h-8" /></div>
            ) : (
              <>
                <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                  {Object.entries(
                    (matches || []).reduce((acc: any, match: any) => {
                      const seq = match.stage?.sequence_order || 0;
                      if (!acc[seq]) acc[seq] = { name: match.stage?.display_name || 'Fase', matches: [] };
                      acc[seq].matches.push(match);
                      return acc;
                    }, {})
                  )
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([seq, stageData]: [string, any]) => {
                    const usedTeamIds = new Set<string>();
                    stageData.matches.forEach((m: any) => {
                      if (m.team_home_id) usedTeamIds.add(m.team_home_id);
                      if (m.team_away_id) usedTeamIds.add(m.team_away_id);
                    });

                    return (
                    <div key={seq} id={`stage-${seq}`} className="flex flex-col min-w-[280px] max-w-[320px] gap-3 snap-center shrink-0 relative">
                      
                      <h3 className="text-lg font-bold mb-2 text-center text-foreground">{stageData.name}</h3>

                      <div className="flex flex-col justify-start gap-3 relative z-10 h-max">
                        {stageData.matches.map((match: any) => (
                          <div key={match.id} className="glass rounded-xl p-3 shadow-md flex flex-col gap-1 border border-border relative overflow-hidden bg-card transition-all hover:border-primary/50">
                          
                          {/* Info del Partido */}
                          <div className="flex flex-col items-center justify-center tracking-wider mb-2 gap-1">
                            <Input 
                              type="datetime-local" 
                              defaultValue={new Date(new Date(match.match_time).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                              className="h-6 w-max bg-muted border-border text-[10px] text-foreground font-medium text-center px-2 py-0 focus-visible:ring-1 focus-visible:ring-primary"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const isoString = new Date(e.target.value).toISOString();
                                  updateTeamMutation.mutate({ matchId: match.id, field: 'match_time', teamId: isoString });
                                }
                              }}
                            />
                            {match.is_finished && <span className="text-[10px] text-green-400 font-bold uppercase">(Finalizado)</span>}
                          </div>
                          
                          {/* Home Team Row */}
                          <div className="flex items-center justify-between p-1 px-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              {match.team_home?.flag_url ? (
                                <img src={match.team_home.flag_url} alt="Flag" className="w-7 h-5 object-cover rounded-[2px] shadow-sm" />
                              ) : (
                                <div className="w-7 h-5 bg-muted-foreground/20 rounded-[2px]" />
                              )}
                              {!match.is_finished ? (
                                <select 
                                  className="bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary"
                                  value={match.team_home_id || ''}
                                  onChange={(e) => updateTeamMutation.mutate({ matchId: match.id, field: 'team_home_id', teamId: e.target.value })}
                                  disabled={updateTeamMutation.isPending}
                                >
                                  <option value="" className="bg-slate-900 text-slate-400">A definir</option>
                                  {teams?.filter((t: any) => !usedTeamIds.has(t.id) || t.id === match.team_home_id).map((t: any) => (
                                    <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">{t.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-bold text-[14px] text-foreground">{match.team_home?.name || match.team_home_id || 'A definir'}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  defaultValue={match.goals_home !== null ? match.goals_home : undefined}
                                  className="w-10 h-8 text-center font-bold text-md p-1 bg-background border-border text-foreground rounded-md focus:ring-2 focus:ring-primary outline-none border"
                                  onChange={(e) => setMatchResults(prev => ({
                                    ...prev,
                                    [match.id]: { ...prev[match.id], home: parseInt(e.target.value) }
                                  }))}
                                />
                            </div>
                          </div>

                          {/* Away Team Row */}
                          <div className="flex items-center justify-between p-1 px-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              {match.team_away?.flag_url ? (
                                <img src={match.team_away.flag_url} alt="Flag" className="w-7 h-5 object-cover rounded-[2px] shadow-sm" />
                              ) : (
                                <div className="w-7 h-5 bg-muted-foreground/20 rounded-[2px]" />
                              )}
                              {!match.is_finished ? (
                                <select 
                                  className="bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary"
                                  value={match.team_away_id || ''}
                                  onChange={(e) => updateTeamMutation.mutate({ matchId: match.id, field: 'team_away_id', teamId: e.target.value })}
                                  disabled={updateTeamMutation.isPending}
                                >
                                  <option value="" className="bg-slate-900 text-slate-400">A definir</option>
                                  {teams?.filter((t: any) => !usedTeamIds.has(t.id) || t.id === match.team_away_id).map((t: any) => (
                                    <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">{t.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-bold text-[14px] text-foreground">{match.team_away?.name || match.team_away_id || 'A definir'}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  defaultValue={match.goals_away !== null ? match.goals_away : undefined}
                                  className="w-10 h-8 text-center font-bold text-md p-1 bg-background border-border text-foreground rounded-md focus:ring-2 focus:ring-primary outline-none border"
                                  onChange={(e) => setMatchResults(prev => ({
                                    ...prev,
                                    [match.id]: { ...prev[match.id], away: parseInt(e.target.value) }
                                  }))}
                                />
                            </div>
                          </div>

                          {/* Controles de Finalización */}
                          <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-3">
                              {matchResults[match.id]?.home === matchResults[match.id]?.away && matchResults[match.id]?.home !== undefined && (
                                <select 
                                  className="w-full p-2 border border-slate-700 rounded-md bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-primary outline-none"
                                  onChange={(e) => setMatchResults(prev => ({
                                    ...prev,
                                    [match.id]: { ...prev[match.id], winner: e.target.value }
                                  }))}
                                >
                                  <option value="" className="bg-slate-900 text-slate-100">Elige quién avanza (Desempate)...</option>
                                  <option value="" className="bg-slate-900 text-slate-100">Desempate...</option>
                                  <option value={match.team_home_id} className="bg-slate-900 text-slate-100">{match.team_home?.name || match.team_home_id}</option>
                                  <option value={match.team_away_id} className="bg-slate-900 text-slate-100">{match.team_away?.name || match.team_away_id}</option>
                                </select>
                              )}

                                <Button 
                                  onClick={() => finalizeMutation.mutate(match.id)}
                                  disabled={finalizeMutation.isPending || unfinalizeMutation.isPending}
                                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-[11px] font-bold"
                                >
                                  {finalizeMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : match.is_finished ? 'Actualizar Resultado' : 'Finalizar'}
                                </Button>
                                {match.is_finished && (
                                  <Button 
                                    onClick={() => unfinalizeMutation.mutate(match.id)}
                                    disabled={unfinalizeMutation.isPending || finalizeMutation.isPending}
                                    variant="outline"
                                    className="w-full h-7 text-[11px] font-bold text-red-500 border-red-500/50 hover:bg-red-500/10"
                                  >
                                    {unfinalizeMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : 'Deshacer (Revertir)'}
                                  </Button>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Posiciones y Reportes</h1>
              <Button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              {loadingUsers ? (
                <div className="p-10 text-center text-muted-foreground">Cargando usuarios...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">Posición</th>
                        <th className="px-6 py-4 font-medium">Usuario / Email</th>
                        <th className="px-6 py-4 font-medium text-center">Plenos (3pts)</th>
                        <th className="px-6 py-4 font-medium text-center">Aciertos (1pt)</th>
                        <th className="px-6 py-4 font-medium text-right">Puntos Totales</th>
                        <th className="px-6 py-4 font-medium text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user: any, index: number) => {
                        const plenos = user.predictions?.filter((p: any) => p.points_earned === 3).length || 0;
                        const aciertos = user.predictions?.filter((p: any) => p.points_earned === 1).length || 0;
                        
                        return (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-lg">{index + 1}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold">{user.username || 'Sin usuario'}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                              {user.is_admin && <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full font-bold">ADMIN</span>}
                            </td>
                            <td className="px-6 py-4 text-center text-green-500 font-bold">{plenos}</td>
                            <td className="px-6 py-4 text-center text-yellow-500 font-bold">{aciertos}</td>
                            <td className="px-6 py-4 text-right font-black text-xl text-primary">{user.total_points}</td>
                            <td className="px-6 py-4 text-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedUser(user)}
                                className="text-xs font-bold bg-muted/50 hover:bg-primary/20 border-border"
                              >
                                Ver Detalles
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal de Predicciones del Usuario */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
              <DialogContent className="max-w-3xl max-h-[85vh] bg-zinc-950/95 backdrop-blur-xl border-white/10 overflow-hidden flex flex-col p-0 rounded-2xl shadow-2xl">
                <div className="p-6 border-b border-white/10 bg-muted/30">
                  <DialogTitle className="text-xl font-bold">
                    Predicciones de: <span className="text-primary">{selectedUser?.username || selectedUser?.full_name || selectedUser?.email}</span>
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">Total Puntos: {selectedUser?.total_points} pts</p>
                </div>
                
                <div className="overflow-y-auto p-6 space-y-4 custom-purple-scrollbar">
                  {selectedUser?.predictions?.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">Este usuario aún no ha guardado predicciones.</div>
                  ) : (
                    matches?.filter((m: any) => selectedUser?.predictions?.some((p: any) => p.match_id === m.id))
                      .sort((a: any, b: any) => new Date(a.match_time).getTime() - new Date(b.match_time).getTime())
                      .map((match: any) => {
                        const pred = selectedUser.predictions.find((p: any) => p.match_id === match.id);
                        if (!pred) return null;
                        
                        return (
                          <div key={match.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
                            
                            {/* Equipos (Real) */}
                            <div className="flex items-center gap-4 w-full justify-center">
                              <div className="flex flex-col items-end gap-1 flex-1">
                                <span className="font-bold text-sm text-right leading-tight">{match.team_home?.name || match.team_home_id || '?'}</span>
                                {match.team_home?.flag_url && <img src={match.team_home.flag_url} className="w-5 h-3 rounded-[1px]" />}
                              </div>
                              <span className="font-black text-muted-foreground text-xs px-2">VS</span>
                              <div className="flex flex-col items-start gap-1 flex-1">
                                <span className="font-bold text-sm leading-tight">{match.team_away?.name || match.team_away_id || '?'}</span>
                                {match.team_away?.flag_url && <img src={match.team_away.flag_url} className="w-5 h-3 rounded-[1px]" />}
                              </div>
                            </div>
                            
                            <div className="flex flex-row justify-around items-center w-full bg-muted/20 p-3 rounded-lg flex-wrap gap-3">
                              {/* Predicción */}
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Predicción</span>
                                <div className="flex gap-2 items-center font-black text-lg bg-muted/50 px-3 py-1 rounded-md">
                                  <span>{pred.pred_goals_home}</span>
                                  <span>-</span>
                                  <span>{pred.pred_goals_away}</span>
                                </div>
                              </div>
                              
                              {/* Resultado Final (Si existe) */}
                              <div className="flex flex-col items-center">
                                <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${match.is_finished ? 'text-primary' : 'text-muted-foreground'}`}>Resultado Real</span>
                                <div className={`flex gap-2 items-center font-black text-lg px-3 py-1 rounded-md ${match.is_finished ? 'bg-primary/10 border border-primary/20 text-primary' : 'opacity-50'}`}>
                                  <span>{match.goals_home ?? '-'}</span>
                                  <span>-</span>
                                  <span>{match.goals_away ?? '-'}</span>
                                </div>
                              </div>

                              {/* Puntos Obtenidos */}
                              <div className="flex flex-col items-center justify-center min-w-[60px]">
                                {match.is_finished ? (
                                  <>
                                    <span className={`text-2xl font-black ${pred.points_earned === 3 ? 'text-green-500' : pred.points_earned === 1 ? 'text-yellow-500' : 'text-slate-500'}`}>
                                      +{pred.points_earned}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">pts</span>
                                  </>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic mt-2">En espera</span>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })
                  )}
                </div>
                
                <div className="p-4 border-t border-white/10 bg-muted/30 flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>Cerrar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {currentView === 'config' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Configuración y Carga</h1>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-sm p-8 max-w-3xl">
              <h2 className="text-xl font-bold mb-2">Carga Masiva (JSON)</h2>
              <p className="text-muted-foreground mb-8">
                Sube un archivo <code className="bg-muted px-1 py-0.5 rounded">.json</code> con la estructura de Equipos y Fases para inicializar un torneo sin necesidad de usar SQL directamente.
              </p>
              
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-input rounded-xl cursor-pointer bg-muted/10 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileJson className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para buscar</span> o arrastra y suelta aquí</p>
                        <p className="text-xs text-muted-foreground">Documento JSON (MAX. 5MB)</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const json = JSON.parse(event.target?.result as string);
                              toast.success('Archivo leído correctamente. Validando estructura...');
                              console.log("JSON cargado:", json);
                              // Aquí iría la lógica para enviar el JSON a una API Route o función de Supabase que parsee e inserte equipos y llaves.
                            } catch (error) {
                              toast.error('El archivo no tiene un formato JSON válido.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
