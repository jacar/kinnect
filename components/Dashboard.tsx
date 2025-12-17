import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { db, Contact, formatRelativeTime } from '../utils/db';

interface DashboardProps {
  onNavigate: (view: View, contactId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await db.getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Failed to load contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await db.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-warm-white text-text-dark font-display min-h-screen flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-soft-green/50">
        <div className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
            <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-14 w-auto" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sage-dark leading-none">Kinnect</h1>
              <span className="text-[10px] md:text-xs font-medium text-stone tracking-wide">Porque la familia importa</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => onNavigate(View.DASHBOARD)} className="px-4 py-2 rounded-full text-sm font-bold text-sage-dark bg-soft-green/50">
              Inicio
            </button>
            <button onClick={() => onNavigate(View.CIRCLE)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">
              Mi Círculo
            </button>
            <button onClick={() => onNavigate(View.CALENDAR)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">
              Calendario
            </button>
            <button onClick={() => onNavigate(View.SETTINGS)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all">
              Ajustes
            </button>
            <button onClick={() => onNavigate(View.GUIDE)} className="px-4 py-2 rounded-full text-sm font-medium text-stone hover:text-sage-dark hover:bg-soft-green/30 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined !text-lg">help</span>
              Guía
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate(View.ADD_CONNECTION)}
              className="hidden sm:flex items-center justify-center gap-2 h-11 px-6 bg-sage-dark hover:bg-sage hover:text-sage-dark text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg shadow-sage/20"
            >
              <span className="material-symbols-outlined !text-xl">add_circle</span>
              <span className="truncate">Registrar Interacción</span>
            </button>
            <div className="flex items-center gap-2">
              <div
                className="size-11 rounded-full bg-cover bg-center border-2 border-white cursor-pointer shadow-sm"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqqbRgv-AvIl_7H4YIe7oEsiTzfJBi4nFnxUlypXifIbwhP9wLb_sqP8-P9FWtSrdxVIV-UfCKUxwcQLgcld6BG8NPH_afIFwQM09CSp0ctuRUZsXH90Ih74jkhKp2BiMtOPxqNyuJnHwgexNNCwQeJr1W17tVshElWG3ZeRCkJhiFWjZK21nR0X2flXu2VG2rmUk3rKQ87XK5gHP_mYGySCoKwHHc9M_PpPqtI8cBEaVYEwna4zWkPoRHxcLdtH2Byx4ke4ufPKXq")' }}
              ></div>
              <button
                onClick={handleLogout}
                className="size-10 flex items-center justify-center rounded-full bg-gray-100 text-stone hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <span className="material-symbols-outlined !text-xl">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
        <div className="flex flex-col max-w-7xl w-full gap-12">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-dark">Buenas tardes, Alex.</h2>
              <p className="text-stone text-lg md:text-xl font-medium leading-relaxed">
                Tu círculo florece. ¿Con quién te gustaría conectar hoy?
              </p>
            </div>
            <div className="w-full lg:w-96">
              <label className="relative flex items-center w-full h-14 rounded-full bg-white shadow-sm border border-soft-green focus-within:ring-2 focus-within:ring-sage/50 transition-all group hover:shadow-md">
                <div className="absolute left-5 text-stone flex items-center pointer-events-none">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="w-full h-full bg-transparent border-none focus:ring-0 pl-14 pr-6 text-base placeholder:text-stone/60 rounded-full text-stone-dark"
                  placeholder="Buscar un amigo..."
                />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
            </div>
          ) : (
            <>
              {/* Gentle Nudges */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-stone-dark">
                    <span className="material-symbols-outlined text-sage-dark fill-1">spa</span>
                    Recordatorios Suaves
                  </h3>
                  <button onClick={() => onNavigate(View.CIRCLE)} className="text-sm font-semibold text-stone hover:text-sage-dark transition-colors">Ver todo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dynamic Nudge from Data */}
                  {contacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white p-6 rounded-2xl border border-soft-green shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate(View.PROFILE, contact.id)}
                    >
                      <div
                        className="size-16 rounded-full bg-cover bg-center shrink-0 border border-soft-green"
                        style={{ backgroundImage: `url("${contact.avatar || 'https://via.placeholder.com/150'}")` }}
                      ></div>
                      <div className="flex flex-col flex-1 gap-1.5 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-lg truncate text-stone-dark">{contact.nickname || contact.name}</p>
                          <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">Toca reconectar</span>
                        </div>
                        <p className="text-stone text-sm truncate">Hace tiempo que no habláis</p>
                        <div className="mt-2 flex gap-2">
                          <button className="bg-soft-green hover:bg-sage text-stone-dark hover:text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all flex-1">Contactar</button>
                          <button className="size-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-stone transition-colors">
                            <span className="material-symbols-outlined !text-base">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Lower Grid: Your Circle & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Your Circle */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-stone-dark">Tu Círculo</h3>
                    <button onClick={() => onNavigate(View.CIRCLE)} className="text-sm font-semibold text-stone hover:text-sage-dark transition-colors">Gestionar</button>
                  </div>
                  <div className="bg-white rounded-3xl border border-soft-green p-8 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8 gap-x-4">

                      {/* Dynamic Contacts */}
                      {contacts.slice(0, 7).map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => onNavigate(View.PROFILE, contact.id)}
                          className="group flex flex-col items-center gap-3 cursor-pointer"
                        >
                          <div className="relative">
                            <div
                              className="size-20 rounded-full bg-cover bg-center group-hover:ring-4 ring-soft-green transition-all duration-300"
                              style={{ backgroundImage: `url("${contact.avatar || 'https://via.placeholder.com/150'}")` }}
                            ></div>
                            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
                              <div className={`size-3.5 ${Math.random() > 0.5 ? 'bg-green-400' : 'bg-amber-400'} rounded-full border-2 border-white`}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-stone-dark text-sm">{contact.nickname || contact.name.split(' ')[0]}</p>
                            <p className="text-xs text-stone">{formatRelativeTime(contact.lastInteractionDate)}</p>
                          </div>
                        </div>
                      ))}

                      {/* Add New */}
                      <div
                        className="group flex flex-col items-center gap-3 cursor-pointer"
                        onClick={() => onNavigate(View.ADD_CONNECTION)}
                      >
                        <div className="size-20 rounded-full border-2 border-dashed border-stone/30 flex items-center justify-center group-hover:border-sage group-hover:text-sage group-hover:bg-soft-green/20 transition-all text-stone">
                          <span className="material-symbols-outlined !text-3xl">add</span>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm text-stone group-hover:text-sage-dark transition-colors">Añadir</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-stone-dark">Recuerdos Recientes</h3>
                    <button onClick={() => onNavigate(View.JOURNAL)} className="text-sm font-semibold text-stone hover:text-sage-dark transition-colors">Ver todo</button>
                  </div>
                  <div className="bg-white rounded-3xl border border-soft-green p-8 shadow-sm h-full">
                    <div className="flex flex-col gap-8 relative">
                      <div className="absolute left-6 top-4 bottom-4 w-px bg-soft-green"></div>

                      {/* Highlight 1 */}
                      <div className="relative flex gap-5 items-start group">
                        <div className="relative z-10 size-12 rounded-full bg-soft-green text-stone-dark flex items-center justify-center shrink-0 border-4 border-white group-hover:scale-110 transition-transform shadow-sm">
                          <span className="material-symbols-outlined !text-xl">local_cafe</span>
                        </div>
                        <div className="flex flex-col pt-1">
                          <p className="font-bold text-sm text-stone-dark">Café con Elena</p>
                          <p className="text-xs text-stone mt-1">12 Oct • Hablamos del nuevo trabajo</p>
                        </div>
                      </div>
                      {/* Highlight 2 */}
                      <div className="relative flex gap-5 items-start group">
                        <div className="relative z-10 size-12 rounded-full bg-soft-green text-stone-dark flex items-center justify-center shrink-0 border-4 border-white group-hover:scale-110 transition-transform shadow-sm">
                          <span className="material-symbols-outlined !text-xl">card_giftcard</span>
                        </div>
                        <div className="flex flex-col pt-1">
                          <p className="font-bold text-sm text-stone-dark">Regalo enviado a Miguel</p>
                          <p className="text-xs text-stone mt-1">10 Oct • Cumpleaños</p>
                        </div>
                      </div>
                      {/* Highlight 3 */}
                      <div className="relative flex gap-5 items-start group">
                        <div className="relative z-10 size-12 rounded-full bg-soft-green text-stone-dark flex items-center justify-center shrink-0 border-4 border-white group-hover:scale-110 transition-transform shadow-sm">
                          <span className="material-symbols-outlined !text-xl">call</span>
                        </div>
                        <div className="flex flex-col pt-1">
                          <p className="font-bold text-sm text-stone-dark">Llamada con la Abuela</p>
                          <p className="text-xs text-stone mt-1">08 Oct • 45 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;