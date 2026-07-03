import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '../../../lib/rate-limit';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''; 

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getIp(request);
    const rl = checkRateLimit(ip, 20, 60000); // 20 peticiones por minuto
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
    const { matchId, field, teamId } = body;

    if (!matchId || !field) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros' }), { status: 400 });
    }

    if (field !== 'team_home_id' && field !== 'team_away_id' && field !== 'match_time') {
      return new Response(JSON.stringify({ error: 'Campo inválido' }), { status: 400 });
    }

    const { error } = await supabase.from('matches').update({ [field]: teamId || null }).eq('id', matchId);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
