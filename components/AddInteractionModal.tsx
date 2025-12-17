import React, { useState } from 'react';
import { db } from '../utils/db';

interface AddInteractionModalProps {
  contactId: string;
  contactName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddInteractionModal: React.FC<AddInteractionModalProps> = ({ contactId, contactName, onClose, onSuccess }) => {
  const [type, setType] = useState<'meetup' | 'call' | 'message' | 'note'>('meetup');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    try {
      await db.addInteraction({
        contactId,
        type,
        title,
        date: new Date(date).toISOString(),
        notes,
        location,
        isPrivate
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la interacción");
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: 'meetup', icon: 'local_cafe', label: 'Encuentro' },
    { id: 'call', icon: 'call', label: 'Llamada' },
    { id: 'message', icon: 'chat', label: 'Mensaje' },
    { id: 'note', icon: 'sticky_note_2', label: 'Nota' },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-dark/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-soft-green flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-soft-green/50 flex justify-between items-center bg-warm-white">
          <div>
            <h2 className="text-2xl font-bold text-stone-dark font-display">Nuevo Recuerdo</h2>
            <p className="text-stone text-sm">Con {contactName}</p>
          </div>
          <button onClick={onClose} className="text-stone hover:text-stone-dark p-2 hover:bg-soft-green/30 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="interaction-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Type Selector */}
            <div className="grid grid-cols-4 gap-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    type === t.id 
                      ? 'bg-sage-dark text-white border-sage-dark shadow-md' 
                      : 'bg-white text-stone border-soft-green hover:border-sage hover:bg-soft-green/20'
                  }`}
                >
                  <span className="material-symbols-outlined">{t.icon}</span>
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-stone-dark uppercase tracking-wide ml-1">Título</span>
                <input 
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'meetup' ? "Café en el centro..." : type === 'call' ? "Puesta al día..." : "Título del recuerdo"}
                  className="w-full bg-soft-green-bg border border-soft-green rounded-xl px-4 py-3 text-stone-dark placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all font-medium"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-stone-dark uppercase tracking-wide ml-1">Fecha</span>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-soft-green-bg border border-soft-green rounded-xl px-4 py-3 text-stone-dark focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all"
                  />
                </label>
                
                {type !== 'call' && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-stone-dark uppercase tracking-wide ml-1">Lugar</span>
                    <input 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="¿Dónde fue?"
                      className="w-full bg-soft-green-bg border border-soft-green rounded-xl px-4 py-3 text-stone-dark placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all"
                    />
                  </label>
                )}
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-stone-dark uppercase tracking-wide ml-1">Notas</span>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles importantes, temas de conversación, impresiones..."
                  rows={4}
                  className="w-full bg-soft-green-bg border border-soft-green rounded-xl px-4 py-3 text-stone-dark placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all resize-none leading-relaxed"
                />
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-soft-green hover:bg-soft-green/20 cursor-pointer transition-colors group">
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isPrivate ? 'bg-sage-dark' : 'bg-stone/30'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isPrivate ? 'left-5' : 'left-1'}`}></div>
                </div>
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="hidden"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-dark group-hover:text-sage-dark transition-colors">Recuerdo Privado</span>
                  <span className="text-xs text-stone">Solo visible para ti (encriptado visualmente)</span>
                </div>
              </label>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-soft-green/50 bg-warm-white flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-full font-bold text-stone hover:bg-stone/10 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="interaction-form"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full bg-sage-dark text-white font-bold shadow-lg shadow-sage/20 hover:bg-sage hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">check</span>
            )}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInteractionModal;