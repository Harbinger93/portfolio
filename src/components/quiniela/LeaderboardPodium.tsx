import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useI18n } from '../../i18n/context';

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  total_points: number;
}

interface LeaderboardProps {
  profiles: Profile[];
}

export default function LeaderboardPodium({ profiles }: LeaderboardProps) {
  const { t } = useI18n();

  // Ordenamos de mayor a menor puntaje
  const sorted = [...profiles].sort((a, b) => b.total_points - a.total_points);
  
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // Asegurarnos de que haya al menos 3 para el podio (rellenando con vacíos si es necesario)
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 relative z-10">
      {profiles.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center border border-border shadow-xl max-w-lg mx-auto bg-card">
          <h3 className="text-xl font-bold text-foreground/80 mb-2">{t('quiniela.emptyLeaderboard')}</h3>
          <p className="text-muted-foreground">{t('quiniela.emptyLeaderboardSub')}</p>
        </div>
      ) : (
        <>
          {/* PODIO 3D con Framer Motion */}
          <div className="flex justify-center items-end h-64 gap-2 sm:gap-6 mb-12 px-4">
        
          {/* Segundo Lugar (Izquierda) */}
          {second && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center w-1/3 max-w-[120px]"
            >
              <div className="mb-2 relative">
                {second.avatar_url ? (
                  <img src={second.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-border shadow-md object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-border bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg shadow-md">
                    {(second.full_name || second.username || '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-sm font-bold truncate w-full text-center drop-shadow-md text-foreground">{second.full_name || second.username}</div>
              <div className="text-xs font-medium text-muted-foreground mb-2">{second.total_points} {t('quiniela.pts')}</div>
              <div className="w-full h-32 glass rounded-t-2xl flex justify-center items-start pt-4 shadow-xl border border-border border-b-0 bg-muted/30 backdrop-blur-md">
                <span className="text-4xl font-black text-muted-foreground drop-shadow-lg">2</span>
              </div>
            </motion.div>
          )}

          {/* Primer Lugar (Centro) */}
          {first && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
              className="flex flex-col items-center w-1/3 max-w-[140px] z-10"
            >
              <div className="mb-2 relative">
                {first.avatar_url ? (
                  <img src={first.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border-4 border-yellow-400 shadow-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-black text-2xl shadow-lg">
                    {(first.full_name || first.username || '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-lg font-black truncate w-full text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-yellow-700 drop-shadow-md">{first.full_name || first.username}</div>
              <div className="text-sm font-bold text-yellow-600 mb-2">{first.total_points} {t('quiniela.pts')}</div>
              <div className="w-full h-44 glass rounded-t-2xl flex justify-center items-start pt-4 shadow-2xl border border-yellow-400/40 border-b-0 bg-gradient-to-t from-yellow-500/20 to-yellow-300/10 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                <span className="text-5xl font-black text-yellow-300 drop-shadow-xl">1</span>
              </div>
            </motion.div>
          )}

          {/* Tercer Lugar (Derecha) */}
          {third && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center w-1/3 max-w-[120px]"
            >
              <div className="mb-2 relative">
                {third.avatar_url ? (
                  <img src={third.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-orange-400 shadow-md object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-orange-400 bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg shadow-md">
                    {(third.full_name || third.username || '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-sm font-bold truncate w-full text-center text-orange-600 drop-shadow-md">{third.full_name || third.username}</div>
              <div className="text-xs font-medium text-orange-600/80 mb-2">{third.total_points} {t('quiniela.pts')}</div>
              <div className="w-full h-24 glass rounded-t-2xl flex justify-center items-start pt-4 shadow-xl border border-orange-500/30 border-b-0 bg-gradient-to-t from-orange-600/20 to-orange-400/10 backdrop-blur-md">
                <span className="text-3xl font-black text-orange-300 drop-shadow-lg">3</span>
              </div>
            </motion.div>
          )}
        </div>

        </>
      )}
    </div>
  );
}
