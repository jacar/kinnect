import React, { useState, useEffect } from 'react';
import { supabase } from './utils/db';
import Dashboard from './components/Dashboard';
import AddConnection from './components/AddConnection';
import Profile from './components/Profile';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LandingPage from './components/LandingPage';
import MyCircle from './components/MyCircle';
import Journal from './components/Journal';
import Settings from './components/Settings';
import Calendar from './components/Calendar';
import Guide from './components/Guide';
import About from './components/About';
import Footer from './components/Footer';
import type { Session } from '@supabase/supabase-js';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Handle Auth Session
  useEffect(() => {
    let mounted = true;

    // Safety timeout: If connection hangs, just stop loading and show LandingPage
    const timer = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 4000);

    const initSession = async () => {
      try {
        // Check for URL errors from provider (log only)
        const hash = window.location.hash;
        if (hash && hash.includes('error_description')) {
          console.warn("Auth error detected in URL");
          setLoading(false);
          return;
        }

        // Check active session
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(data.session);
          if (data.session) {
            setCurrentView(View.DASHBOARD);
          }
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Session Init Error:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          setCurrentView(View.DASHBOARD);
          setIsGuest(false);
        } else if (!isGuest) {
          // Only redirect to landing if not in guest mode
          setCurrentView(prev =>
            (prev === View.PRIVACY || prev === View.TERMS || prev === View.GUIDE || prev === View.ABOUT) ? prev : View.LANDING
          );
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [isGuest]);

  const handleNavigate = (view: View, contactId?: string) => {
    if (contactId) {
      setSelectedContactId(contactId);
    }

    // Enable guest mode if navigating to main app without session
    if (!session && view !== View.LANDING && view !== View.PRIVACY && view !== View.TERMS && view !== View.GUIDE && view !== View.ABOUT) {
      setIsGuest(true);
    }

    setCurrentView(view);
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-warm-white flex items-center justify-center flex-col gap-6 p-6 text-center">
          <span className="material-symbols-outlined animate-spin text-sage-dark text-4xl">progress_activity</span>
          <div className="flex flex-col gap-2">
            <p className="text-stone animate-pulse font-medium">Conectando con tu espacio...</p>
            <p className="text-stone/50 text-xs">Esto puede tardar unos segundos</p>
          </div>
        </div>
      );
    }

    // Show Landing if not logged in AND not in guest mode (except for static pages)
    if (!session && !isGuest) {
      if (currentView === View.PRIVACY) return <PrivacyPolicy onNavigate={handleNavigate} />;
      if (currentView === View.TERMS) return <TermsOfService onNavigate={handleNavigate} />;
      if (currentView === View.GUIDE) return <Guide onNavigate={handleNavigate} />;
      if (currentView === View.ABOUT) return <About onNavigate={handleNavigate} />;
      return <LandingPage onNavigate={handleNavigate} />;
    }

    switch (currentView) {
      case View.LANDING:
        return <Dashboard onNavigate={handleNavigate} />;
      case View.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case View.ADD_CONNECTION:
        return <AddConnection onNavigate={handleNavigate} onClose={() => handleNavigate(View.DASHBOARD)} />;
      case View.PROFILE:
        return <Profile onNavigate={handleNavigate} contactId={selectedContactId} />;
      case View.CIRCLE:
        return <MyCircle onNavigate={handleNavigate} />;
      case View.JOURNAL:
        return <Journal onNavigate={handleNavigate} />;
      case View.CALENDAR:
        return <Calendar onNavigate={handleNavigate} />;
      case View.SETTINGS:
        return <Settings onNavigate={handleNavigate} />;
      case View.PRIVACY:
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case View.TERMS:
        return <TermsOfService onNavigate={handleNavigate} />;
      case View.GUIDE:
        return <Guide onNavigate={handleNavigate} />;
      case View.ABOUT:
        return <About onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full font-display">
      {renderView()}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;