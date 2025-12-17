import React from 'react';
import { View } from '../types';

interface FooterProps {
    onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="border-t border-soft-green bg-white/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-2">
                        <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-kinred.svg" alt="Kinnect Logo" className="h-8 w-auto opacity-80" />
                        <span className="text-stone font-medium text-sm">© 2023 Kinnect</span>
                    </div>
                    <p className="text-stone/60 text-xs">
                        Desarrollado por <a href="https://www.jacomeovalle.com/" target="_blank" rel="noopener noreferrer" className="text-sage-dark hover:underline font-semibold">Webcincodev</a>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-stone font-medium">
                    <button onClick={() => onNavigate(View.ABOUT)} className="hover:text-sage-dark transition-colors">Sobre Nosotros</button>
                    <button onClick={() => onNavigate(View.GUIDE)} className="hover:text-sage-dark transition-colors">Ayuda</button>
                    <button onClick={() => onNavigate(View.PRIVACY)} className="hover:text-sage-dark transition-colors">Privacidad</button>
                    <button onClick={() => onNavigate(View.TERMS)} className="hover:text-sage-dark transition-colors">Términos</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
