
import React from 'react';
import { View } from '../types';

interface Props {
  onNavigate: (view: View) => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onNavigate }) => {
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
        <h1 className="text-4xl font-bold mb-8 text-sage-dark">Política de Privacidad</h1>
        
        <div className="space-y-6 text-stone leading-relaxed">
          <p>Última actualización: 24 de Octubre, 2023</p>
          
          <h2 className="text-2xl font-bold text-stone-dark mt-8">1. Introducción</h2>
          <p>En Kinnect, valoramos profundamente tu privacidad. Esta aplicación está diseñada para ser un espacio seguro para tus relaciones personales.</p>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">2. Recolección de Datos</h2>
          <p>Actualmente, Kinnect opera principalmente con almacenamiento local en tu dispositivo. Los datos que introduces (nombres, notas, fechas) se guardan en tu navegador.</p>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">3. Uso de la Información</h2>
          <p>Utilizamos tu información exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Recordarte fechas importantes.</li>
            <li>Organizar tu agenda de contactos.</li>
            <li>Mejorar tu experiencia dentro de la aplicación.</li>
          </ul>

          <h2 className="text-2xl font-bold text-stone-dark mt-8">4. Seguridad</h2>
          <p>Tus notas privadas son solo para tus ojos. No vendemos ni compartimos tus datos personales con terceros.</p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
