import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '../../../lib/rate-limit';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? (process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL) : '') || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? (process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) : '') || ''; 

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
    const { matchId } = body;

    // Ejecutar la lógica para deshacer la finalización del partido
    const { error: rpcError } = await supabase.rpc('unfinalize_match', { 
      match_id_param: matchId
    });
    
    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ success: true, message: 'Partido deshecho y puntos revertidos correctamente.' }), {
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
