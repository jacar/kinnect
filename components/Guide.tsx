import React from 'react';
import { View } from '../types';


interface GuideProps {
    onNavigate: (view: View) => void;
}

const Guide: React.FC<GuideProps> = ({ onNavigate }) => {
    return (
        <div className="bg-warm-white text-text-dark font-display min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-soft-green/50">
                <div className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
                        <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-14 w-auto" />
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sage-dark leading-none">Kinnect</h1>
                    </div>
                    <button
                        onClick={() => onNavigate(View.DASHBOARD)}
                        className="flex items-center gap-2 text-stone hover:text-sage-dark transition-colors font-medium text-sm"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Volver al Inicio
                    </button>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
                <div className="max-w-4xl w-full flex flex-col gap-12">

                    {/* Header Section */}
                    <section className="text-center space-y-6 py-8">
                        <div className="inline-flex items-center justify-center p-3 bg-soft-green/30 rounded-full mb-2">
                            <span className="material-symbols-outlined text-sage-dark text-4xl">local_library</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-dark tracking-tight">
                            Bienvenido a <span className="text-sage-dark">Kinnect</span>
                        </h1>
                        <p className="text-xl text-stone max-w-2xl mx-auto leading-relaxed">
                            Tu espacio personal para cultivar relaciones significativas, recordar lo importante y reconectar con quienes más importan.
                        </p>
                    </section>

                    {/* Why Kinnect Section */}
                    <section className="bg-white rounded-3xl p-8 border border-soft-green shadow-sm grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-stone-dark">¿Por qué usar Kinnect?</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-amber-700">favorite</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-dark text-lg">Cultiva tus Relaciones</h3>
                                        <p className="text-stone text-sm">Más allá de los "likes", Kinnect te ayuda a mantener un contacto real y significativo con tu círculo cercano.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-700">notifications_active</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-dark text-lg">Nunca Olvides lo Importante</h3>
                                        <p className="text-stone text-sm">Configura recordatorios suaves para cumpleaños y momentos para reconectar, sin la presión de las redes sociales.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-purple-700">history_edu</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-dark text-lg">Diario de Recuerdos</h3>
                                        <p className="text-stone text-sm">Registra notas personales sobre tus interacciones. ¿Qué libro te recomendaron? ¿Cuál es su comida favorita? Todo en un solo lugar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-80 bg-soft-green/20 rounded-2xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2532&auto=format&fit=crop"
                                alt="Amigos riendo"
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="relative z-10 text-white text-center p-6">
                                <p className="font-medium text-lg italic">"Las relaciones son el jardín de la vida. Kinnect es tu agua y tu sol."</p>
                            </div>
                        </div>
                    </section>

                    {/* How to Use Section */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-bold text-stone-dark text-center">Cómo empezar paso a paso</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Step 1 */}
                            <div className="bg-white p-6 rounded-2xl border border-soft-green shadow-sm hover:shadow-md transition-all group">
                                <div className="size-12 rounded-full bg-sage text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">1</div>
                                <h3 className="font-bold text-lg text-stone-dark mb-2">Añade a tu Círculo</h3>
                                <p className="text-stone text-sm">Empieza agregando a tus amigos más cercanos y familiares. Incluye detalles como su cumpleaños e intereses.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-soft-green shadow-sm hover:shadow-md transition-all group">
                                <div className="size-12 rounded-full bg-sage text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">2</div>
                                <h3 className="font-bold text-lg text-stone-dark mb-2">Registra Interacciones</h3>
                                <p className="text-stone text-sm">Cada vez que hables con alguien, regístralo. Puede ser un café, una llamada o un mensaje. ¡Kinnect calculará cuándo volver a hablar!</p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white p-6 rounded-2xl border border-soft-green shadow-sm hover:shadow-md transition-all group">
                                <div className="size-12 rounded-full bg-sage text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">3</div>
                                <h3 className="font-bold text-lg text-stone-dark mb-2">Revisa tu Dashboard</h3>
                                <p className="text-stone text-sm">Tu inicio te mostrará recordatorios "suaves" de personas con las que hace tiempo que no conectas. ¡Dales un toque!</p>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="bg-sage-dark rounded-3xl p-10 text-center text-white shadow-lg shadow-sage/30 mt-4">
                        <h2 className="text-3xl font-bold mb-4">¿Listo para fortalecer tus conexiones?</h2>
                        <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">Comienza hoy mismo a construir un círculo más fuerte y significativo.</p>
                        <button
                            onClick={() => onNavigate(View.DASHBOARD)}
                            className="bg-white text-sage-dark hover:bg-soft-green font-bold py-3.5 px-8 rounded-full transition-all shadow-md transform hover:-translate-y-1"
                        >
                            Ir a mi Dashboard
                        </button>
                    </section>

                </div>
            </main>


        </div>
    );
};

export default Guide;
