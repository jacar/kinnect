
import React, { useState } from 'react';
import { View } from '../types';
import { db } from '../utils/db';

interface SettingsProps {
  onNavigate: (view: View) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  // Mock states for settings UI
  const [notifications, setNotifications] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const handleLogout = async () => {
    try {
        await db.signOut();
        // App.tsx auth listener handles redirect
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="bg-warm-white text-text-dark font-display min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-soft-green/50 px-6 h-20 flex items-center justify-between">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
            <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-8 w-auto" />
            <div className="hidden md:flex flex-col">
                <h1 className="text-xl font-bold text-sage-dark leading-none">Kinnect</h1>
                <span className="text-[10px] font-medium text-stone tracking-wide">Porque la familia importa</span>
            </div>
         </div>
         <nav className="flex items-center gap-1">
            <button onClick={() => onNavigate(View.DASHBOARD)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Inicio</button>
            <button onClick={() => onNavigate(View.CIRCLE)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Mi Círculo</button>
            <button onClick={() => onNavigate(View.JOURNAL)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Diario</button>
            <button className="px-4 py-2 rounded-full text-sm font-bold text-sage-dark bg-soft-green/50">Ajustes</button>
         </nav>
      </header>
      
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10">
        <h1 className="text-4xl font-bold text-stone-dark mb-2">Ajustes</h1>
        <p className="text-stone mb-10">Personaliza tu experiencia en Kinnect.</p>

        <div className="space-y-8">
            {/* Preferences */}
            <section className="bg-white p-6 rounded-2xl border border-soft-green">
                <h2 className="text-lg font-bold text-stone-dark mb-4 border-b border-soft-green/50 pb-2">Preferencias</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-stone-dark">Notificaciones de recordatorio</p>
                            <p className="text-xs text-stone">Recibe avisos cuando sea momento de reconectar</p>
                        </div>
                        <div 
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-sage-dark' : 'bg-stone/30'}`}
                            onClick={() => setNotifications(!notifications)}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications ? 'translate-x-5' : ''}`}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account */}
            <section className="bg-white p-6 rounded-2xl border border-soft-green">
                <h2 className="text-lg font-bold text-stone-dark mb-4 border-b border-soft-green/50 pb-2">Datos y Cuenta</h2>
                <div className="space-y-4">
                    <button 
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-soft-green/20 transition-colors text-left"
                        onClick={() => {
                            setExportLoading(true);
                            setTimeout(() => {
                                alert("Tus datos han sido exportados (simulado).");
                                setExportLoading(false);
                            }, 1500);
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-stone">download</span>
                            <div>
                                <p className="font-medium text-stone-dark">Exportar mis datos</p>
                                <p className="text-xs text-stone">Descarga una copia de todos tus contactos y recuerdos</p>
                            </div>
                        </div>
                        {exportLoading && <span className="material-symbols-outlined animate-spin text-sage-dark">progress_activity</span>}
                    </button>
                    
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone/5 transition-colors text-left group border border-transparent hover:border-stone/10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-stone group-hover:text-stone-dark transition-colors">logout</span>
                            <div>
                                <p className="font-medium text-stone-dark">Cerrar Sesión</p>
                                <p className="text-xs text-stone">Salir de tu cuenta de forma segura</p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* About */}
            <section className="bg-white p-6 rounded-2xl border border-soft-green">
                <h2 className="text-lg font-bold text-stone-dark mb-4 border-b border-soft-green/50 pb-2">Acerca de</h2>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone">Versión</span>
                    <span className="font-mono text-stone-dark bg-soft-green/30 px-2 py-1 rounded">v1.2.0</span>
                </div>
                <div className="mt-4 flex gap-4 text-sm font-medium">
                    <button onClick={() => onNavigate(View.PRIVACY)} className="text-sage-dark hover:underline">Privacidad</button>
                    <button onClick={() => onNavigate(View.TERMS)} className="text-sage-dark hover:underline">Términos</button>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
