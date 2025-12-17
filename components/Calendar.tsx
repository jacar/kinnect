
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { db, Contact } from '../utils/db';

interface CalendarProps {
  onNavigate: (view: View, contactId?: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onNavigate }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await db.getContacts();
      setContacts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Helper to get next birthday
  const getNextBirthday = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let nextBirthDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthDate < today) {
      nextBirthDate.setFullYear(today.getFullYear() + 1);
    }
    return nextBirthDate;
  };

  const upcomingBirthdays = contacts
    .filter(c => c.birthday)
    .map(c => ({
      ...c,
      nextBirthday: getNextBirthday(c.birthday!)
    }))
    .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());

  return (
     <div className="bg-warm-white text-text-dark font-display min-h-screen flex flex-col">
       {/* Header */}
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
            <button className="px-4 py-2 rounded-full text-sm font-bold text-sage-dark bg-soft-green/50">Calendario</button>
            <button onClick={() => onNavigate(View.SETTINGS)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">Ajustes</button>
         </nav>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <h1 className="text-4xl font-bold text-stone-dark mb-2">Calendario</h1>
        <p className="text-stone mb-10">Próximas fechas importantes y celebraciones.</p>

        {loading ? (
           <div className="flex justify-center py-20">
               <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
           </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-stone-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sage-dark">cake</span>
                Próximos Cumpleaños
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(contact => (
                  <div key={contact.id} className="bg-white p-4 rounded-2xl border border-soft-green flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate(View.PROFILE, contact.id)}>
                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${contact.avatar || 'https://via.placeholder.com/150'}")` }}></div>
                    <div>
                      <h3 className="font-bold text-stone-dark">{contact.name}</h3>
                      <p className="text-sm text-stone">
                        {contact.nextBirthday.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                        {/* Calculate age if year is valid... skipped for brevity */}
                      </p>
                      <p className="text-xs text-sage-dark font-medium mt-1">
                         {Math.ceil((contact.nextBirthday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días restantes
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-soft-green">
                    <p className="text-stone italic">No hay cumpleaños próximos registrados.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
export default Calendar;
