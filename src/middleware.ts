import { defineMiddleware } from 'astro:middleware';

// Almacenamiento en memoria para el Rate Limiter básico.
// En Vercel (versión gratuita), esta memoria no se comparte entre todas las instancias serverless,
// pero es muy efectiva para frenar ráfagas de peticiones (spam) dirigidas a la misma instancia
// sin necesidad de configurar ni pagar servicios externos como Redis.
const rateLimit = new Map<string, { count: number, resetTime: number }>();

export const onRequest = defineMiddleware((context, next) => {
  const { url, request } = context;

  // Solo aplicar rate limiting a las rutas de la API que pueden consumir recursos pesados
  if (url.pathname.startsWith('/api/quiniela/')) {
    // Obtener la IP en Vercel (x-forwarded-for) o el entorno local
    const ip = request.headers.get('x-forwarded-for') || context.clientAddress || 'unknown-ip';
    const now = Date.now();
    
    // Límite básico: Máximo 10 peticiones cada 15 segundos por IP para las rutas API
    const limit = 10;
    const windowMs = 15000; 

    let client = rateLimit.get(ip);
    
    // Si no existe o ya pasó el tiempo, resetear
    if (!client || client.resetTime < now) {
      client = { count: 0, resetTime: now + windowMs };
    }

    client.count++;
    rateLimit.set(ip, client);
    console.log(`Middleware rate limit - IP: ${ip}, Count: ${client.count}`);

    // Si excede el límite, bloquear
    if (client.count > limit) {
      return new Response(JSON.stringify({ 
        error: 'Demasiadas peticiones (Rate Limit). Por favor, espera unos segundos e intenta nuevamente.' 
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((client.resetTime - now) / 1000).toString()
        }
      });
    }
  }

  // Continuar con la petición normal si todo está bien
  return next();
});
