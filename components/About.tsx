import React from 'react';
import { View } from '../types';


interface AboutProps {
    onNavigate: (view: View) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
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
                        Volver
                    </button>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-12 px-4 sm:px-6">
                <div className="max-w-3xl w-full flex flex-col gap-10">

                    {/* Intro Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold text-stone-dark tracking-tight">Sobre Nosotros</h1>
                        <p className="text-lg text-stone max-w-xl mx-auto">
                            Conectando corazones a través de la tecnología, una interacción a la vez.
                        </p>
                    </div>

                    {/* Author Card */}
                    <div className="bg-white rounded-3xl p-8 border border-soft-green shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start group hover:shadow-md transition-all">
                        <div className="size-32 rounded-full overflow-hidden border-4 border-soft-green/30 shrink-0">
                            <img
                                src="https://jacomeovalle.com/og-image.jpg"
                                alt="Armando Ovalle"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Armando+Ovalle&background=random';
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-dark">Armando Ovalle J.</h2>
                                <p className="text-sage-dark font-medium text-sm tracking-wide uppercase mt-1">Diseñador & Desarrollador Full Stack</p>
                            </div>
                            <p className="text-stone leading-relaxed text-sm">
                                Especialista en Desarrollo Web, Diseño UI/UX y Soluciones a Medida. Transformo ideas en experiencias digitales únicas y funcionales. Apasionado por crear herramientas que aporten valor real a la vida de las personas.
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start mt-2">
                                <a href="https://www.jacomeovalle.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-stone hover:text-sage-dark flex items-center gap-1 transition-colors">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                    Portafolio
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-sage-dark text-white rounded-2xl p-6 shadow-lg shadow-sage/20 flex flex-col items-center text-center gap-4">
                            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">support_agent</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Soporte y Ayuda</h3>
                                <p className="text-white/80 text-sm mt-1">¿Tienes alguna duda o reportar una falla? Escríbenos.</p>
                            </div>
                            <a
                                href="https://wa.me/573052891719"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-sage-dark hover:bg-soft-green font-bold py-2.5 px-6 rounded-full transition-all w-full flex items-center justify-center gap-2"
                            >
                                <i className="fa-brands fa-whatsapp text-lg"></i>
                                WhatsApp Soporte
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-soft-green flex flex-col items-center text-center gap-4">
                            <div className="size-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">bug_report</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-stone-dark">Reportar Bug</h3>
                                <p className="text-stone text-sm mt-1">Ayúdanos a mejorar Kinnect reportando errores.</p>
                            </div>
                            <a
                                href="https://wa.me/573052891719?text=Hola,%20quiero%20reportar%20una%20falla%20en%20Kinnect:"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-2 border-stone/20 hover:border-sage text-stone hover:text-sage-dark font-bold py-2.5 px-6 rounded-full transition-all w-full"
                            >
                                Reportar
                            </a>
                        </div>
                    </div>

                </div>
            </main>


        </div>
    );
};

export default About;
