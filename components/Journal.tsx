
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { db, Interaction } from '../utils/db';

interface JournalProps {
  onNavigate: (view: View, contactId?: string) => void;
}

const Journal: React.FC<JournalProps> = ({ onNavigate }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await db.getAllInteractions();
      setInteractions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

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
            <button className="px-4 py-2 rounded-full text-sm font-bold text-sage-dark bg-soft-green/50">Diario</button>
            <button onClick={() => onNavigate(View.SETTINGS)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Ajustes</button>
         </nav>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <h1 className="text-4xl font-bold text-stone-dark mb-2">Diario de Recuerdos</h1>
        <p className="text-stone mb-10">Una colección cronológica de todos tus momentos compartidos.</p>

        {loading ? (
            <div className="flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
            </div>
        ) : interactions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-soft-green">
                <span className="material-symbols-outlined text-stone/30 text-6xl mb-4">menu_book</span>
                <p className="text-stone text-lg">Tu diario está vacío. ¡Empieza a conectar!</p>
            </div>
        ) : (
            <div className="flex flex-col gap-8">
                {interactions.map((interaction, idx) => {
                    const showYear = idx === 0 || new Date(interaction.date).getFullYear() !== new Date(interactions[idx-1].date).getFullYear();
                    const showMonth = idx === 0 || new Date(interaction.date).getMonth() !== new Date(interactions[idx-1].date).getMonth();
                    
                    return (
                        <div key={interaction.id}>
                            {(showYear || showMonth) && (
                                <div className="flex items-center gap-4 mb-6 mt-2">
                                    <div className="h-px bg-soft-green flex-1"></div>
                                    <span className="text-stone font-bold uppercase tracking-widest text-sm">
                                        {new Date(interaction.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className="h-px bg-soft-green flex-1"></div>
                                </div>
                            )}
                            
                            <div className="bg-white p-6 rounded-2xl border border-soft-green shadow-sm hover:shadow-md transition-shadow flex gap-6">
                                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                    <span className="text-2xl font-bold text-stone-dark leading-none">{new Date(interaction.date).getDate()}</span>
                                    <span className="text-xs font-bold text-stone uppercase">{new Date(interaction.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                    <div className={`mt-2 p-2 rounded-full ${interaction.type === 'meetup' ? 'bg-amber-100 text-amber-700' : interaction.type === 'call' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        <span className="material-symbols-outlined !text-lg">
                                            {interaction.type === 'meetup' ? 'local_cafe' : interaction.type === 'call' ? 'call' : 'sticky_note_2'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-stone-dark mb-1">{interaction.title}</h3>
                                        {interaction.isPrivate && <span className="material-symbols-outlined text-sage-dark !text-[18px]" title="Privado">lock</span>}
                                    </div>
                                    
                                    {interaction.contact && (
                                        <div 
                                            className="flex items-center gap-2 mb-3 cursor-pointer group w-fit"
                                            onClick={() => onNavigate(View.PROFILE, interaction.contactId)}
                                        >
                                            <div 
                                                className="size-6 rounded-full bg-cover bg-center border border-soft-green"
                                                style={{ backgroundImage: `url("${interaction.contact.avatar || 'https://via.placeholder.com/150'}")` }}
                                            ></div>
                                            <span className="text-sm font-medium text-stone group-hover:text-sage-dark transition-colors">con {interaction.contact.name}</span>
                                        </div>
                                    )}

                                    {interaction.notes && (
                                        <p className="text-stone text-sm leading-relaxed bg-soft-green-bg p-4 rounded-xl italic">
                                            "{interaction.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </main>
    </div>
  );
};

export default Journal;
