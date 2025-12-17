
import React from 'react';
import { View } from '../types';

interface Props {
  onNavigate: (view: View) => void;
}

const TermsOfService: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-warm-white min-h-screen text-stone-dark font-display">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-soft-green/50 px-6 h-20 flex items-center justify-between">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
            <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-8 w-auto" />
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-sage-dark leading-none">Kinnect</h1>
                <span className="text-[10px] font-medium text-stone tracking-wide">Porque la familia importa</span>
            </div>
         </div>
         <button onClick={() => onNavigate(View.DASHBOARD)} className="text-stone hover:text-sage-dark font-medium">Volver</button>
      </header>
      
      <main className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8 text-sage-dark">Términos de Uso</h1>
        
        <div className="space-y-6 text-stone leading-relaxed">
          <h2 className="text-2xl font-bold text-stone-dark mt-8">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar Kinnect, aceptas cumplir con estos Términos de Uso y todas las leyes aplicables.</p>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">2. Uso Apropiado</h2>
          <p>Kinnect es una herramienta para la gestión de relaciones personales. Aceptas no utilizar el servicio para actividades ilegales o no autorizadas.</p>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">3. Propiedad Intelectual</h2>
          <p>El diseño, logotipos y código de Kinnect son propiedad exclusiva de los desarrolladores. No está permitida la copia o reproducción sin permiso.</p>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">4. Limitación de Responsabilidad</h2>
          <p>Kinnect se proporciona "tal cual". No garantizamos que la aplicación esté libre de errores o que el servicio sea ininterrumpido.</p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
