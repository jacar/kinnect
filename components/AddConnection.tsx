
import React, { useState } from 'react';
import { View } from '../types';
import { db } from '../utils/db';

interface AddConnectionProps {
  onNavigate: (view: View, contactId?: string) => void;
  onClose: () => void;
}

const AddConnection: React.FC<AddConnectionProps> = ({ onNavigate, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    relation: '',
    birthday: '',
    location: '',
    frequency: '25',
    privateNotes: '',
    avatar: ''
  });

  const [interests, setInterests] = useState<string[]>(['Café']);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // name in input must match keys in formData
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
      setShowInterestInput(false);
    }
  };

  const handleLogout = async () => {
    try {
        await db.signOut();
        // App.tsx auth listener will handle navigation
    } catch (e) { console.error(e) }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Canvas for resizing logic to avoid massive base64 strings
          // drastically reduced size to ensure DB persistence
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max size 250px (optimized for avatar circles)
          const MAX_SIZE = 250;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG 0.6 quality to save space
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => ({ ...prev, avatar: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        // Create new contact in DB
        const newContact = await db.addContact({
        name: formData.name,
        nickname: formData.nickname,
        relation: formData.relation,
        location: formData.location,
        birthday: formData.birthday,
        frequencyDays: parseInt(formData.frequency) || 14,
        privateNotes: formData.privateNotes,
        interests: interests,
        // Use uploaded avatar OR generate random one if empty
        avatar: formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=9CAF99&color=fff&size=128`
        });

        // Navigate to the new profile
        onNavigate(View.PROFILE, newContact.id);
    } catch (error) {
        console.error(error);
        alert("Hubo un error al guardar. Inténtalo de nuevo.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-white font-display text-stone-dark h-screen flex overflow-hidden selection:bg-sage selection:text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-soft-green h-full flex-shrink-0">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-center">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-soft-green" 
                data-alt="User profile picture abstract geometric pattern" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhY96PPcB_DXz6BDvAU5nQCw5W0DtNXkJbNmZlOS6W9F0Iltqa7p_4gIz_G_dQweT_U3kaJj_eVAuBgpXmqiOseoEmjzDgtmuu2ymAbA4PZmV1ZKyGtPC0qJLyxu7xpqu56_n-4c2ur3pK2Nes8xmh7MaSpq5eoBSRm29Sh9EuW02t_6eXnDwo8-_FWQcWuQXxQ6Lol-e0Q-25_MDABOZiMs4r03DXjFgCZl-7UB64ksMYXksJr4zhf10OhDxQxLySaISQI2u8tFVC")' }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-stone-dark text-lg font-bold leading-tight">Alex Morgan</h1>
                <p className="text-stone text-sm font-medium">Gestor de Relaciones</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <button onClick={() => onNavigate(View.DASHBOARD)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-soft-green/50 transition-colors group">
                <span className="material-symbols-outlined text-stone group-hover:text-stone-dark transition-colors">dashboard</span>
                <p className="text-stone group-hover:text-stone-dark text-base font-medium transition-colors">Inicio</p>
              </button>
              <button onClick={() => onNavigate(View.CIRCLE)} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-soft-green transition-colors">
                <span className="material-symbols-outlined text-stone-dark fill-1">group</span>
                <p className="text-stone-dark text-base font-bold">Relaciones</p>
              </button>
              <button onClick={() => onNavigate(View.CALENDAR)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-soft-green/50 transition-colors group">
                <span className="material-symbols-outlined text-stone group-hover:text-stone-dark transition-colors">calendar_month</span>
                <p className="text-stone group-hover:text-stone-dark text-base font-medium transition-colors">Calendario</p>
              </button>
              <button onClick={() => onNavigate(View.SETTINGS)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-soft-green/50 transition-colors group">
                <span className="material-symbols-outlined text-stone group-hover:text-stone-dark transition-colors">settings</span>
                <p className="text-stone group-hover:text-stone-dark text-base font-medium transition-colors">Ajustes</p>
              </button>
            </nav>
          </div>
          <div 
            className="flex items-center gap-4 px-4 py-3 cursor-pointer text-stone hover:text-stone-dark transition-colors"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Cerrar sesión</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-soft-green">
          <h1 className="text-stone-dark font-bold text-lg">Añadir Conexión</h1>
          <button className="text-stone p-2" onClick={onClose}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14">
          <div className="max-w-[1000px] mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-stone-dark text-4xl font-extrabold tracking-tight font-display">Añadir Nueva Conexión</h2>
                <p className="text-stone text-lg font-normal">Profundiza tu vínculo con un perfil personal</p>
              </div>
              <button 
                onClick={onClose}
                className="text-stone hover:text-stone-dark transition-colors bg-white p-2 rounded-full hover:bg-soft-green/30"
              >
                <span className="material-symbols-outlined !text-[32px]">close</span>
              </button>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" onSubmit={handleSubmit}>
              {/* Left Column */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="flex justify-center mb-4">
                  <label className="relative group cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div 
                        className="w-40 h-40 rounded-full bg-white border-2 border-dashed border-sage/50 flex items-center justify-center overflow-hidden hover:border-sage transition-colors bg-cover bg-center"
                        style={formData.avatar ? { backgroundImage: `url(${formData.avatar})`, borderStyle: 'solid' } : {}}
                    >
                      {!formData.avatar && (
                          <div className="flex flex-col items-center gap-2 text-stone group-hover:text-sage transition-colors">
                            <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                            <span className="text-xs font-medium">Subir Foto</span>
                          </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-sage-dark text-white rounded-full p-2 shadow-lg border-2 border-white">
                      <span className="material-symbols-outlined text-sm font-bold">edit</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-stone-dark text-sm font-semibold pl-1">Nombre Completo *</span>
                    <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-xl h-12 px-5 text-stone-dark placeholder-stone/40 transition-all shadow-sm outline-none" placeholder="ej. María García" type="text" />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-stone-dark text-sm font-semibold pl-1">Apodo</span>
                      <input name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-xl h-12 px-5 text-stone-dark placeholder-stone/40 transition-all shadow-sm outline-none" placeholder="ej. Mari" type="text" />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-stone-dark text-sm font-semibold pl-1">Cumpleaños</span>
                      <div className="relative">
                        <input name="birthday" value={formData.birthday} onChange={handleInputChange} className="w-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-xl h-12 px-5 text-stone-dark placeholder-stone/40 transition-all appearance-none shadow-sm outline-none" type="date" />
                        <span className="material-symbols-outlined absolute right-4 top-3 text-stone pointer-events-none">calendar_today</span>
                      </div>
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-stone-dark text-sm font-semibold pl-1">Tipo de Relación *</span>
                    <div className="relative">
                      <select name="relation" required value={formData.relation} onChange={handleInputChange} className="w-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-xl h-12 px-5 text-stone-dark appearance-none cursor-pointer transition-all shadow-sm outline-none">
                        <option disabled value="">Seleccionar tipo</option>
                        <option value="Amigo">Amigo</option>
                        <option value="Familia">Familia</option>
                        <option value="Pareja">Pareja</option>
                        <option value="Colega">Colega</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 text-stone pointer-events-none">expand_more</span>
                    </div>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-stone-dark text-sm font-semibold pl-1">Ubicación</span>
                    <div className="relative">
                      <input name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-xl h-12 px-5 pl-11 text-stone-dark placeholder-stone/40 transition-all shadow-sm outline-none" placeholder="Ciudad, País" type="text" />
                      <span className="material-symbols-outlined absolute left-4 top-3 text-stone">location_on</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="p-6 rounded-2xl bg-white border border-soft-green shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-soft-green p-2 rounded-full text-stone-dark">
                      <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <h3 className="text-stone-dark text-lg font-bold">Frecuencia de Contacto</h3>
                  </div>
                  <p className="text-stone text-sm mb-6">¿Con qué frecuencia quieres conectar para mantener el vínculo?</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['7', '14', '30', '90'].map((val) => {
                      const labels: Record<string, string> = {'7': 'Semanal', '14': 'Quincenal', '30': 'Mensual', '90': 'Trimestral'};
                      return (
                        <label key={val} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="frequency" 
                            value={val}
                            checked={formData.frequency === val}
                            onChange={handleInputChange}
                            className="peer sr-only" 
                          />
                          <div className="px-4 py-2 rounded-full border border-soft-green text-stone peer-checked:bg-sage peer-checked:text-white peer-checked:border-sage transition-all text-sm font-medium hover:bg-soft-green/30">
                            {labels[val]}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-stone px-1">
                    <span>Más Frecuente</span>
                    <span>Menos Frecuente</span>
                  </div>
                  <input name="frequency" value={formData.frequency} onChange={handleInputChange} className="w-full mt-2 h-1 bg-soft-green rounded-lg appearance-none cursor-pointer" type="range" min="1" max="100" />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-center pl-1">
                    <span className="text-stone-dark text-sm font-semibold">Notas Privadas</span>
                    <div className="flex items-center gap-1 text-xs text-stone bg-soft-green px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined !text-[14px]">lock</span>
                      <span>Solo visible para ti</span>
                    </div>
                  </div>
                  <div className="relative h-full min-h-[160px]">
                    <textarea name="privateNotes" value={formData.privateNotes} onChange={handleInputChange} className="w-full h-full bg-white border border-soft-green focus:border-sage focus:ring-1 focus:ring-sage rounded-2xl p-5 text-stone-dark placeholder-stone/40 resize-none transition-all leading-relaxed shadow-sm outline-none" placeholder="¿Cómo te hacen sentir? ¿Cuáles son sus valores? Anota cualquier cosa que ayude a conectar a un nivel más profundo..."></textarea>
                    <div className="absolute bottom-4 right-4 text-stone opacity-50">
                      <span className="material-symbols-outlined">edit_note</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-stone-dark text-sm font-semibold pl-1">Intereses Comunes</span>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <div key={interest} className="px-3 py-1.5 rounded-full bg-soft-green text-stone-dark text-sm flex items-center gap-2 border border-transparent hover:bg-sage/20 cursor-pointer transition-colors">
                        {interest} <button type="button" onClick={() => setInterests(interests.filter(i => i !== interest))} className="material-symbols-outlined !text-[14px] opacity-60 hover:opacity-100">close</button>
                      </div>
                    ))}
                    {!showInterestInput ? (
                        <button type="button" onClick={() => setShowInterestInput(true)} className="px-3 py-1.5 rounded-full border border-dashed border-sage text-stone text-sm flex items-center gap-1 hover:text-sage hover:border-sage transition-all">
                          <span className="material-symbols-outlined !text-[16px]">add</span> Añadir Interés
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input autoFocus className="border border-sage rounded-full px-3 py-1 text-sm outline-none" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()} />
                            <button type="button" onClick={handleAddInterest} className="text-sage font-bold text-sm">OK</button>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-12 mt-4 pt-6 border-t border-soft-green flex justify-end gap-4">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="px-8 py-3 rounded-full border border-stone/20 text-stone font-medium hover:bg-stone/5 transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-full bg-sage-dark hover:bg-sage hover:text-sage-dark text-white font-bold shadow-lg shadow-sage/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined">check</span>
                  )}
                  {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
                </button>
              </div>
            </form>
          </div>
          <div className="h-20"></div>
        </div>
      </main>
    </div>
  );
};

export default AddConnection;
