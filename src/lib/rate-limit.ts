interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Limpieza básica para evitar fugas de memoria en la instancia
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, 60000);

/**
 * Chequea y actualiza el contador para una IP dada.
 * @param ip Dirección IP del cliente
 * @param limit Número máximo de peticiones permitidas
 * @param windowMs Ventana de tiempo en milisegundos
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = store.get(ip);

  // Si no existe o ya expiró la ventana, resetear/crear
  if (!record || now > record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: Math.max(0, limit - 1), reset: now + windowMs };
  }

  // Si ya llegó al límite
  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  // Incrementar contador
  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}

/**
 * Obtiene la IP de los headers de Vercel
 */
export function getIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown-ip';
}
