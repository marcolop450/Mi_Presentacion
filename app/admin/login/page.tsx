"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const supabase = createClient();

    if (!supabase) {
      setErrorMsg("Configuración de Supabase no detectada en las variables de entorno.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (
          error.message === "Invalid login credentials" ||
          error.message?.toLowerCase().includes("invalid login") ||
          error.message?.toLowerCase().includes("invalid credentials")
        ) {
          setErrorMsg("Credenciales incorrectas. Verifica tu correo y contraseña.");
        } else {
          setErrorMsg("Problemas de Servidor. Intenta nuevamente en unos instantes.");
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        setSuccessMsg("¡Bienvenido, Marco! Accediendo al panel de administración...");
        setTimeout(() => {
          router.replace("/admin/dashboard");
        }, 600);
      } else {
        setErrorMsg("Problemas de Servidor. No se pudo iniciar la sesión.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Problemas de Servidor. Intenta nuevamente más tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      {/* Botón flotante para cambiar de tema */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20">
        <ThemeToggle />
      </div>

      {/* Tarjeta de Autenticación con estilo oficial KIRIS */}
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl p-7 sm:p-9 bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl shadow-teal-950/20 backdrop-blur-xl">
          {/* Emblema Oficial con Logo */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#071915] p-2 flex items-center justify-center">
                  <Image
                    src="/images/logo_kiris.png"
                    alt="Logo KIRIS"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-teal-950/70 border border-slate-300 dark:border-teal-800/80 text-teal-800 dark:text-teal-200 text-xs font-mono font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>FICCT // UAGRM • PANEL SEGURO</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Portal de Administración
            </h1>
            <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1 font-sans">
              Acceso exclusivo para gestión de auxiliaturas, recursos y categorías.
            </p>
          </div>

          {/* Alertas de Error o Éxito */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-teal-200 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcolop450@gmail.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-teal-200 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-teal-400 dark:hover:text-teal-200 transition"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl font-bold text-sm bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-lg shadow-teal-700/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Panel Seguro</span>
              )}
            </button>
          </form>

          {/* Enlace de Retorno */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-teal-900/40 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-teal-300/80 hover:text-teal-600 dark:hover:text-teal-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Presentación KIRIS</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
