import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '../../../lib/rate-limit';

export const prerender = false;

const resendKey = import.meta.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''; 

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getIp(request);
    const rl = checkRateLimit(ip, 20, 60000);
    if (!rl.success) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429 });
    }
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    
    // Inicializar cliente con el token del usuario para respetar el RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const body = await request.json();
    const { matchId, homeGoals, awayGoals, winnerId } = body;

    // 1. Aquí se ejecutaría la lógica atómica real de recalcular puntos
    const { error: rpcError } = await supabase.rpc('finalize_match', { 
      match_id_param: matchId,
      actual_goals_home: homeGoals,
      actual_goals_away: awayGoals,
      actual_winner_id: winnerId
    });
    if (rpcError) throw rpcError;

    // 2. Traer predicciones para este partido para ver quién acertó Pleno (3 pts)
    const { data: predictions } = await supabase
      .from('predictions')
      .select('*, profiles(email, username)')
      .eq('match_id', matchId);

    if (predictions) {
      for (const pred of predictions) {
        // Lógica de Pleno
        if (pred.pred_goals_home === homeGoals && pred.pred_goals_away === awayGoals) {
          // Obtener 3 puntos (esto debería actualizarse en la BD idealmente en el RPC)
          
          // Enviar Email de Pleno
          if (resend && pred.profiles?.email) {
            await resend.emails.send({
              from: 'Quiniela <onboarding@resend.dev>', // Cambiar por dominio verificado
              to: pred.profiles.email,
              subject: '¡Pleno Exacto! +3 Puntos 🔥',
              html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; padding: 40px 30px; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; padding: 12px 24px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 9999px; margin-bottom: 20px;">
                      <span style="background: linear-gradient(to right, #60a5fa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 14px; letter-spacing: 1px;">QUINIELA 2026</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">¡PLENO EXACTO! 🎉</h1>
                  </div>
                  
                  <div style="background: linear-gradient(145deg, #0f172a, #020617); padding: 35px 25px; border-radius: 16px; text-align: center; border: 1px solid #1e293b; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent);"></div>
                    <h2 style="margin-top: 0; color: #f8fafc; font-size: 24px; font-weight: 800;">Felicidades, ${pred.profiles.username}</h2>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Has acertado el marcador exacto del partido. Tu predicción fue impecable y sumaste la máxima puntuación posible. ¡Sigue así para mantenerte en el podio!</p>
                    
                    <div style="display: inline-block; padding: 4px; background: linear-gradient(to right, #10b981, #059669); border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);">
                      <div style="background-color: #020617; padding: 12px 32px; border-radius: 10px;">
                        <span style="background: linear-gradient(to right, #34d399, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-size: 28px;">
                          +3 PUNTOS
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p style="text-align: center; color: #475569; font-size: 13px; margin-top: 40px; font-weight: 500;">
                    Ingresa a tu dashboard para ver tu posición en la tabla general.<br><br>
                    © 2026 Quiniela. Todos los derechos reservados.
                  </p>
                </div>
              `,
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Partido finalizado y puntos procesados.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
