import React, { useState } from 'react';
import { supabase } from '../../lib/quiniela/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { User, Chrome, Lock, Mail, AtSign, ShieldAlert } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenTerms
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenTerms?: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleGoogleLogin = async () => {
    if (!isLogin && !acceptedTerms) {
      toast.error('Debes aceptar los Términos y Condiciones para registrarte.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/quiniela`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión con Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !acceptedTerms) {
      toast.error('Debes aceptar los Términos y Condiciones para registrarte.');
      return;
    }
    
    if (!isLogin && !validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('¡Sesión iniciada correctamente!');
        onSuccess();
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        toast.success('Cuenta creada. Revisa tu correo o inicia sesión.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-white/5 backdrop-blur-2xl shadow-2xl p-8 rounded-3xl bg-black/60">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isLogin
              ? 'Accede para ver tu quiniela.'
              : 'Regístrate para participar en la polla del mundial.'}
          </DialogDescription>
        </DialogHeader>
        
        {!isLogin && (
          <div className="flex flex-col gap-3 mb-2">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-yellow-100/90 leading-relaxed font-medium">
                <strong className="text-yellow-400">Aviso Importante:</strong> Esta plataforma es 100% gratuita, recreativa y <strong className="text-yellow-400">sin fines de lucro</strong>. Queda terminantemente prohibido su uso para apuestas monetarias o juegos de azar.
              </p>
            </div>

            <div className="flex items-start space-x-3 mb-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(c) => setAcceptedTerms(c as boolean)}
                className="mt-1 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="terms" className="text-xs font-normal text-slate-400 leading-tight cursor-pointer">
                Acepto los <button type="button" onClick={(e) => { e.preventDefault(); onOpenTerms?.(); }} className="text-blue-400 hover:text-blue-300 underline transition-colors">Términos y Condiciones de Uso – Plataforma Recreativa</button>. Entiendo que está prohibido apostar dinero.
              </Label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 transition-all font-semibold"
          >
            <Chrome className="w-5 h-5 mr-2 text-blue-400" />
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#101010] px-2 text-slate-500 rounded-full">O con tu correo</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {!isLogin && (
            <div className="space-y-2 relative">
              <Label htmlFor="username" className="text-slate-300 ml-1">Nombre de Usuario</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Elige un alias único"
                  className="pl-10 bg-white/5 border-white/10 focus:border-blue-500 text-white"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2 relative">
            <Label htmlFor="email" className="text-slate-300 ml-1">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="pl-10 bg-white/5 border-white/10 focus:border-blue-500 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-slate-300 ml-1">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-white/5 border-white/10 focus:border-blue-500 text-white"
                required
              />
            </div>
            {!isLogin && (
              <p className="text-[10px] text-slate-500 ml-1 mt-1">Mínimo 8 caracteres, 1 mayúscula y 1 número.</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all" 
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarse'}
          </Button>
        </form>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Crea una gratis' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
