import React, { useState, useEffect } from 'react';
import { WorkshopSettings, FieldConfig, Registration, PublicConfigResponse } from './types';
import { DEFAULT_WORKSHOP_SETTINGS, DEFAULT_FIELD_CONFIGS } from './lib/constants';
import { ApiService } from './services/api';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/public/Hero';
import { WorkshopInfo } from './components/public/WorkshopInfo';
import { RegistrationForm } from './components/public/RegistrationForm';
import { ConfirmationModal } from './components/public/ConfirmationModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const [settings, setSettings] = useState<WorkshopSettings>(DEFAULT_WORKSHOP_SETTINGS);
  const [fields, setFields] = useState<FieldConfig[]>(DEFAULT_FIELD_CONFIGS);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [spotsLeft, setSpotsLeft] = useState<number>(150);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(ApiService.isAdminLoggedIn());
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [viewAdminConsole, setViewAdminConsole] = useState<boolean>(false);
  const [adminRegistrations, setAdminRegistrations] = useState<Registration[]>([]);

  // Registration Ticket Confirmation State
  const [confirmationData, setConfirmationData] = useState<any | null>(null);

  // Fetch Public Config
  const loadPublicData = async () => {
    setIsLoading(true);
    try {
      const data: PublicConfigResponse = await ApiService.getPublicConfig();
      setSettings(data.settings);
      setFields(data.fields);
      setRegisteredCount(data.registered_count);
      setSpotsLeft(data.spots_left);
      setIsOpen(data.is_open);
    } catch (err) {
      console.error('Error loading config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Admin Data
  const loadAdminData = async () => {
    if (!isAdminLoggedIn) return;
    try {
      const { settings: s, fields: f } = await ApiService.getAdminConfig();
      setSettings(s);
      setFields(f);

      const regs = await ApiService.getRegistrations();
      setAdminRegistrations(regs);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
    setViewAdminConsole(true);
  };

  const handleAdminLogout = () => {
    ApiService.logoutAdmin();
    setIsAdminLoggedIn(false);
    setViewAdminConsole(false);
  };

  const scrollToForm = () => {
    const element = document.getElementById('registration-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (ticketData: any) => {
    setConfirmationData(ticketData);
    loadPublicData();
  };

  return (
    <div className="min-[#050811] text-slate-100 min-h-screen flex flex-col relative cyber-grid">
      
      {/* Top Header */}
      <Header
        settings={settings}
        isOpen={isOpen}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminModal={() => {
          if (isAdminLoggedIn) setViewAdminConsole(!viewAdminConsole);
          else setShowAdminLoginModal(true);
        }}
        onLogoutAdmin={handleAdminLogout}
        onNavigateToForm={scrollToForm}
      />

      {/* Main View Switcher (Admin Console vs Public Page) */}
      <main className="flex-grow">
        {isAdminLoggedIn && viewAdminConsole ? (
          <AdminDashboard
            settings={settings}
            fields={fields}
            registrations={adminRegistrations}
            onRefresh={() => {
              loadPublicData();
              loadAdminData();
            }}
            onLogout={handleAdminLogout}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              settings={settings}
              spotsLeft={spotsLeft}
              isOpen={isOpen}
              onRegisterClick={scrollToForm}
            />

            {/* Workshop Information Details Grid */}
            <WorkshopInfo settings={settings} />

            {/* Dynamic Registration Form */}
            <RegistrationForm
              fields={fields}
              settings={settings}
              isOpen={isOpen}
              spotsLeft={spotsLeft}
              onSuccess={handleRegistrationSuccess}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdminModal={() => {
          if (isAdminLoggedIn) setViewAdminConsole(true);
          else setShowAdminLoginModal(true);
        }}
      />

      {/* Modals */}
      {showAdminLoginModal && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLoginModal(false)}
        />
      )}

      {confirmationData && (
        <ConfirmationModal
          data={confirmationData}
          onClose={() => setConfirmationData(null)}
        />
      )}

    </div>
  );
}

export default App;
