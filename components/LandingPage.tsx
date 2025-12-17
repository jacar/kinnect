import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { db } from '../utils/db';

interface Props {
    onNavigate: (view: View) => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isIframe, setIsIframe] = useState(false);

    const [isRegistering, setIsRegistering] = useState(false);

    // Form states for UI visualization
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (window.self !== window.top) {
                    setIsIframe(true);
                }
            } catch (e) {
                setIsIframe(true);
            }
        }
    }, []);

    const openInNewTab = () => {
        window.open(window.location.href, '_blank');
    };

    const handleGoogleLogin = async () => {
        if (isIframe) {
            openInNewTab();
            return;
        }
        setIsGoogleLoading(true);
        try {
            await db.signInWithGoogle();
        } catch (error: any) {
            if (error?.message === 'Canceled' || error?.message?.includes('navigating')) return;
            console.error(error);
            alert("Error al iniciar sesión con Google.");
            setIsGoogleLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailLoading(true);
        try {
            if (isRegistering) {
                await db.signUpWithEmail(email, password);
                alert("Registro exitoso! Por favor revisa tu correo para confirmar.");
                setIsRegistering(false);
            } else {
                await db.signInWithEmail(email, password);
                // Auth state change will handle navigation in App.tsx usually, but we can try manual or just wait for listener
                // For now, let's assume successful login redirects or updates state
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error en autenticación");
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            alert("Por favor ingresa tu correo electrónico para restablecer la contraseña.");
            return;
        }
        try {
            await db.resetPassword(email);
            alert("Se ha enviado un correo para restablecer tu contraseña.");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error al solicitar restablecimiento de contraseña");
        }
    };

    return (
        <div className="bg-warm-white min-h-screen flex flex-col font-display text-stone-dark selection:bg-sage selection:text-white relative overflow-x-hidden">

            {/* Header */}
            <header className="w-full px-6 py-5 lg:px-12 flex items-center justify-between sticky top-0 z-50 bg-warm-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-3 select-none">
                    <div className="size-14 text-sage-dark">
                        <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-sage-dark tracking-tight leading-none">Kinnect</span>
                        <span className="text-xs font-medium text-stone/80 leading-tight">Porque la familia importa</span>
                    </div>
                </div>
                <nav className="hidden sm:flex items-center gap-8">
                    <button className="text-sm font-medium text-stone hover:text-sage-dark transition-colors">Sobre nosotros</button>
                    <button className="text-sm font-medium text-stone hover:text-sage-dark transition-colors">Ayuda</button>
                </nav>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-6 lg:px-12 py-8 lg:py-12 items-center">

                {/* Left Column: Hero Content */}
                <div className="flex flex-col gap-10 lg:pr-10 order-2 lg:order-1">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.05] tracking-tight text-stone-dark">
                            Cultiva tus conexiones <br />
                            <span className="text-sage-dark">más importantes</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-stone leading-relaxed max-w-xl">
                            Gestiona a las personas que más significan para ti con empatía e intención. Un espacio tranquilo diseñado para profundizar tus relaciones y recordarte lo que realmente importa.
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sage/10 border border-soft-green aspect-[16/9] w-full mt-2 group">
                        <video
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/Siempre-conectados-1.mp4" type="video/mp4" />
                            Tu navegador no soporta el tag de video.
                        </video>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex -space-x-4">
                            {[
                                "https://i.pravatar.cc/100?img=32",
                                "https://i.pravatar.cc/100?img=47",
                                "https://i.pravatar.cc/100?img=12"
                            ].map((src, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-warm-white bg-soft-green overflow-hidden">
                                    <img src={src} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-4 border-warm-white bg-sage/20 flex items-center justify-center text-sage-dark text-xs font-bold">
                                <span className="material-symbols-outlined !text-lg">person</span>
                            </div>
                        </div>
                        <p className="text-stone font-medium text-sm">
                            Más de 10,000 relaciones cultivadas.
                        </p>
                    </div>
                </div>

                {/* Right Column: Login Card */}
                <div className="flex flex-col items-center lg:items-end w-full order-1 lg:order-2">
                    <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-sage/5 border border-soft-green w-full max-w-[500px]">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-stone-dark mb-2">
                                {isRegistering ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
                            </h2>
                            <p className="text-stone">
                                {isRegistering ? 'Ingresa tus datos para registrarte' : 'Ingresa tus datos para continuar'}
                            </p>
                        </div>

                        <div className="mb-8">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isGoogleLoading || isEmailLoading}
                                className="w-full flex items-center justify-center gap-2 h-14 rounded-xl border border-soft-green hover:border-sage hover:bg-soft-green/20 transition-all font-medium text-stone-dark text-lg"
                            >
                                {isGoogleLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                ) : (
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-6 h-6" />
                                )}
                                <span>Continuar con Google</span>
                            </button>
                        </div>

                        <div className="relative flex items-center gap-4 mb-8">
                            <div className="h-px bg-soft-green flex-1"></div>
                            <span className="text-xs font-bold text-stone/50 uppercase tracking-widest">O continúa con email</span>
                            <div className="h-px bg-soft-green flex-1"></div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-stone-dark ml-1">Correo electrónico</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ejemplo@correo.com"
                                        className="w-full h-14 bg-soft-green-bg border border-soft-green rounded-xl px-4 pl-12 text-stone-dark focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone">mail</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-stone-dark">Contraseña</label>
                                    {!isRegistering && (
                                        <button
                                            type="button"
                                            onClick={handleResetPassword}
                                            className="text-xs font-bold text-sage-dark hover:underline"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-soft-green-bg border border-soft-green rounded-xl px-4 pl-12 text-stone-dark focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone">lock</span>
                                    <span
                                        className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone cursor-pointer hover:text-stone-dark select-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isEmailLoading || isGoogleLoading}
                                className="w-full h-14 bg-sage-dark hover:bg-sage text-white font-bold rounded-xl mt-4 shadow-lg shadow-sage/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center"
                            >
                                {isEmailLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                            </button>
                        </form>

                        <div className="mt-8 text-center flex flex-col gap-4">
                            <p className="text-stone text-sm">
                                {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                                <button
                                    onClick={() => setIsRegistering(!isRegistering)}
                                    className="font-bold text-sage-dark hover:underline ml-1"
                                >
                                    {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-[500px] mt-6 flex justify-between text-xs text-stone/60 px-4">
                        <button onClick={() => onNavigate(View.TERMS)} className="hover:text-stone-dark underline">Términos de Servicio</button>
                        <button onClick={() => onNavigate(View.PRIVACY)} className="hover:text-stone-dark underline">Política de Privacidad</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;