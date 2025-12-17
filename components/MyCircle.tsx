
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { db, Contact, formatRelativeTime } from '../utils/db';

interface MyCircleProps {
  onNavigate: (view: View, contactId?: string) => void;
}

const MyCircle: React.FC<MyCircleProps> = ({ onNavigate }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await db.getContacts();
      setContacts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.nickname && c.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <button className="px-4 py-2 rounded-full text-sm font-bold text-sage-dark bg-soft-green/50">Mi Círculo</button>
            <button onClick={() => onNavigate(View.JOURNAL)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Diario</button>
            <button onClick={() => onNavigate(View.SETTINGS)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Ajustes</button>
         </nav>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-bold text-stone-dark mb-2">Tu Círculo</h1>
                <p className="text-stone">Gestiona y cultiva tus relaciones más importantes.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone">search</span>
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..." 
                        className="w-full bg-white border border-soft-green rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/50"
                    />
                </div>
                <button 
                    onClick={() => onNavigate(View.ADD_CONNECTION)}
                    className="bg-sage-dark hover:bg-sage text-white px-4 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined !text-xl">add</span>
                    <span className="hidden sm:inline font-bold text-sm">Añadir</span>
                </button>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
            </div>
        ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-soft-green">
                <span className="material-symbols-outlined text-stone/30 text-6xl mb-4">group_off</span>
                <p className="text-stone text-lg">No se encontraron contactos.</p>
                {searchTerm && <button onClick={() => setSearchTerm('')} className="text-sage-dark font-bold mt-2">Limpiar búsqueda</button>}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map(contact => (
                    <div 
                        key={contact.id}
                        onClick={() => onNavigate(View.PROFILE, contact.id)}
                        className="bg-white p-6 rounded-2xl border border-soft-green hover:border-sage hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-soft-green group-hover:bg-sage transition-colors"></div>
                        <div 
                            className="size-24 rounded-full bg-cover bg-center mb-4 ring-4 ring-soft-green/30 group-hover:ring-sage/30 transition-all" 
                            style={{ backgroundImage: `url("${contact.avatar || 'https://via.placeholder.com/150'}")` }}
                        ></div>
                        <h3 className="text-lg font-bold text-stone-dark group-hover:text-sage-dark transition-colors">{contact.name}</h3>
                        <p className="text-xs text-stone uppercase tracking-wider font-semibold mb-3">{contact.relation}</p>
                        
                        <div className="flex flex-wrap justify-center gap-1 mb-4">
                            {contact.interests.slice(0, 3).map(i => (
                                <span key={i} className="text-[10px] bg-soft-green/30 text-stone-dark px-2 py-0.5 rounded-full">{i}</span>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 w-full border-t border-soft-green/30 flex justify-between items-center text-xs text-stone">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[14px]">history</span>
                                {formatRelativeTime(contact.lastInteractionDate)}
                            </span>
                            {contact.location && (
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                                    {contact.location.split(',')[0]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default MyCircle;
