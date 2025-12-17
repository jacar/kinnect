import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { db, Contact, Interaction } from '../utils/db';
import AddInteractionModal from './AddInteractionModal';

interface ProfileProps {
  onNavigate: (view: View, contactId?: string) => void;
  contactId: string | null;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, contactId }) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meetup' | 'call' | 'note'>('all');

  const loadProfile = async () => {
    if (contactId) {
        if (!contact) setLoading(true);
        try {
            const foundContact = await db.getContact(contactId);
            const foundInteractions = await db.getInteractions(contactId);
            setContact(foundContact);
            setInteractions(foundInteractions);
        } catch (e) {
            console.error("Error loading profile", e);
        } finally {
            setLoading(false);
        }
    }
  };

  useEffect(() => {
    loadProfile();
  }, [contactId]);

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = interaction.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (interaction.notes && interaction.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || interaction.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-warm-white flex-col gap-4">
             <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
             <p className="text-sage-dark font-medium">Cargando perfil...</p>
          </div>
      )
  }

  if (!contact) {
      return (
          <div className="h-screen flex items-center justify-center bg-warm-white">
              <p>No se encontró el contacto.</p>
              <button onClick={() => onNavigate(View.DASHBOARD)} className="text-sage-dark ml-4 font-bold">Volver</button>
          </div>
      )
  }

  return (
    <div className="bg-warm-white text-stone font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-soft-green selection:text-text-dark">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-subtle px-10 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
          <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-8 w-auto" />
          <div className="flex flex-col">
              <h2 className="text-text-dark text-lg font-bold leading-none tracking-[-0.015em]">Kinnect</h2>
              <span className="text-[10px] font-medium text-stone tracking-wide">Porque la familia importa</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <button onClick={() => onNavigate(View.DASHBOARD)} className="text-stone text-sm font-medium leading-normal hover:text-sage-dark transition-colors">Inicio</button>
            <button onClick={() => onNavigate(View.CIRCLE)} className="text-sage-dark text-sm font-bold leading-normal">Contactos</button>
            <button onClick={() => onNavigate(View.JOURNAL)} className="text-stone text-sm font-medium leading-normal hover:text-sage-dark transition-colors">Diario</button>
            <button onClick={() => onNavigate(View.SETTINGS)} className="text-stone text-sm font-medium leading-normal hover:text-sage-dark transition-colors">Ajustes</button>
          </div>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-soft-green cursor-pointer" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOpb-WDDYtfd25SXv37nUWrzETcChXcJX1GmtRavb2AUzDoXFabfJPVyrt92wUMWZdz1kPk0N7tSHpLKS0RQ_Y9yHvfdY-CGM14kYkwvwUHxLw5KrpoDn-T7oQ0MckmQX8_6HAmDldy36Rx5eDTBDcZdxh5oe75Xxd9Op9c4_rRklO1VXtCcvmoDpPKvpKRh6dbLoemeMMIosTjZydeZdXhSoPsocWYC-ic7zKzRAFjfHsgkOTxTbw04hHFlTCWXJ5i9uRNBJK2anf")' }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-40 bg-warm-white">
        <div className="flex flex-col max-w-[960px] w-full flex-1 gap-8">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 px-1">
            <button onClick={() => onNavigate(View.DASHBOARD)} className="text-stone text-sm font-medium leading-normal hover:underline hover:text-sage-dark">Inicio</button>
            <span className="text-stone/60 text-sm font-medium leading-normal">/</span>
            <button onClick={() => onNavigate(View.CIRCLE)} className="text-stone text-sm font-medium leading-normal hover:underline hover:text-sage-dark">Contactos</button>
            <span className="text-stone/60 text-sm font-medium leading-normal">/</span>
            <span className="text-text-dark text-sm font-medium leading-normal">{contact.name}</span>
          </nav>

          {/* Profile Header Card */}
          <section className="bg-card-bg rounded-xl p-8 shadow-sm border border-border-subtle">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 md:size-32 ring-4 ring-soft-green shadow-sm" 
                  style={{ backgroundImage: `url("${contact.avatar || 'https://via.placeholder.com/150'}")` }}
                ></div>
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-soft-green/50">
                  <span className="material-symbols-outlined text-red-400 text-xl md:text-2xl leading-none">favorite</span>
                </div>
              </div>
              <div className="flex flex-col justify-center text-center md:text-left flex-1 pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <h1 className="text-text-dark text-3xl font-bold leading-tight tracking-tight font-display">{contact.name}</h1>
                  <span className="bg-soft-green text-text-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mx-auto md:mx-0 shadow-sm">{contact.relation}</span>
                </div>
                <p className="text-stone text-base mb-2">
                    {contact.interests.join(' • ')} 
                    {contact.location && ` • ${contact.location}`}
                </p>
                <p className="text-sage-dark text-sm italic font-medium flex items-center justify-center md:justify-start gap-1">
                  <span className="material-symbols-outlined !text-[16px]">schedule</span>
                  Última interacción: {contact.lastInteractionDate ? new Date(contact.lastInteractionDate).toLocaleDateString() : 'Ninguna registrada'}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-2">
                <button className="flex-1 md:flex-none h-11 px-6 bg-soft-green-bg text-text-dark rounded-full text-sm font-bold hover:bg-soft-green transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-sage/20">
                  <span className="material-symbols-outlined !text-[20px]">edit</span>
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 md:flex-none h-11 px-6 bg-sage-dark text-white rounded-full text-sm font-bold hover:bg-sage hover:text-sage-dark transition-colors shadow-md shadow-sage/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[20px]">add</span>
                  <span>Añadir Recuerdo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Timeline Filters */}
          <div className="flex flex-col sm:flex-row gap-4 py-2 sticky top-[72px] z-40 bg-warm-white/95 backdrop-blur-sm pt-4">
            <div className="flex-1 relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone group-focus-within:text-sage-dark transition-colors">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/50 text-text-dark placeholder-stone/70 shadow-sm transition-shadow" 
                placeholder="Buscar recuerdos..." 
                type="text"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar items-center">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                    filterType === 'all' 
                    ? 'bg-sage-dark text-white shadow-sage/30' 
                    : 'bg-white text-stone border border-border-subtle hover:bg-soft-green-bg hover:text-text-dark hover:border-soft-green'
                }`}
              >
                Todo
              </button>
              <button 
                onClick={() => setFilterType('meetup')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                    filterType === 'meetup' 
                    ? 'bg-sage-dark text-white shadow-sage/30' 
                    : 'bg-white text-stone border border-border-subtle hover:bg-soft-green-bg hover:text-text-dark hover:border-soft-green'
                }`}
              >
                Encuentros
              </button>
              <button 
                onClick={() => setFilterType('call')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                    filterType === 'call' 
                    ? 'bg-sage-dark text-white shadow-sage/30' 
                    : 'bg-white text-stone border border-border-subtle hover:bg-soft-green-bg hover:text-text-dark hover:border-soft-green'
                }`}
              >
                Llamadas
              </button>
              <button 
                onClick={() => setFilterType('note')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                    filterType === 'note' 
                    ? 'bg-sage-dark text-white shadow-sage/30' 
                    : 'bg-white text-stone border border-border-subtle hover:bg-soft-green-bg hover:text-text-dark hover:border-soft-green'
                }`}
              >
                Notas
              </button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex flex-col gap-8 relative px-2 pt-4">
            
            {interactions.length === 0 ? (
                <div className="text-center py-10 text-stone">
                    <p>No hay interacciones registradas aún.</p>
                </div>
            ) : filteredInteractions.length === 0 ? (
                <div className="text-center py-10 text-stone">
                    <p>No se encontraron recuerdos que coincidan con tu búsqueda.</p>
                    <button onClick={() => { setSearchTerm(''); setFilterType('all'); }} className="text-sage-dark font-bold mt-2 hover:underline">Limpiar filtros</button>
                </div>
            ) : filteredInteractions.map(interaction => (
                <div key={interaction.id} className="timeline-item relative pl-16 group animate-fade-in">
                <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col items-center timeline-line">
                  <div className="size-14 rounded-full bg-white border-2 border-soft-green flex items-center justify-center z-10 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <span className="material-symbols-outlined text-amber-700/70">
                        {interaction.type === 'meetup' ? 'local_cafe' : interaction.type === 'call' ? 'call' : interaction.type === 'message' ? 'chat' : 'sticky_note_2'}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm hover:shadow-lg hover:shadow-sage/5 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-dark font-display">{interaction.title}</h3>
                      <p className="text-xs text-stone font-medium mt-1 uppercase tracking-wide">
                          {new Date(interaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    {interaction.location && (
                        <div className="flex items-center gap-1 text-sage-dark bg-soft-green/30 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined !text-[16px]">location_on</span>
                        <span className="text-xs font-semibold">{interaction.location}</span>
                        </div>
                    )}
                  </div>
                  <div className="text-stone text-sm leading-relaxed mb-5 font-light">
                    {interaction.notes}
                  </div>
                  {interaction.isPrivate && (
                    <div className="bg-soft-green-bg rounded-lg p-5 border border-soft-green/50 flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage/40"></div>
                        <span className="material-symbols-outlined text-sage-dark !text-[20px] mt-0.5">lock</span>
                        <div className="flex-1">
                        <p className="text-xs font-bold text-sage-dark uppercase mb-1 tracking-wider">Reflexión Privada</p>
                        <p className="text-sm italic text-stone font-serif">
                            "Solo visible para ti."
                        </p>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredInteractions.length > 0 && interactions.length > filteredInteractions.length && (
                 <div className="text-center py-4 text-stone text-sm">
                     Mostrando {filteredInteractions.length} de {interactions.length} recuerdos
                 </div>
            )}

            {filteredInteractions.length > 0 && (
                <div className="flex justify-center mt-8 mb-12">
                <button className="text-stone text-sm font-medium hover:text-sage-dark flex items-center gap-2 transition-colors py-2 px-4 rounded-full hover:bg-white hover:shadow-sm">
                    <span className="material-symbols-outlined">history</span>
                    <span>Cargar recuerdos anteriores</span>
                </button>
                </div>
            )}

          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-sage-dark text-white rounded-full size-14 shadow-xl flex items-center justify-center hover:bg-sage hover:text-sage-dark transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Add Interaction Modal */}
      {isAddModalOpen && (
        <AddInteractionModal 
            contactId={contact.id}
            contactName={contact.name}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={loadProfile}
        />
      )}
    </div>
  );
};

export default Profile;