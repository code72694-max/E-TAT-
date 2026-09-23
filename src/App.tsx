/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { UserProfile, PermohonanAsesmen, UserRole } from './types';
import { MOCK_USERS, INITIAL_PERMOHONAN } from './data/initialData';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { PermohonanList } from './components/PermohonanList';
import { PermohonanDetail } from './components/PermohonanDetail';
import { VerifikasiBerkasView } from './components/VerifikasiBerkasView';
import { PenugasanJadwalView } from './components/PenugasanJadwalView';
import { AsesmenMedisView } from './components/AsesmenMedisView';
import { AsesmenHukumView } from './components/AsesmenHukumView';
import { PlenoTATView } from './components/PlenoTATView';
import { DokumenPengesahanView } from './components/DokumenPengesahanView';
import { RujukanTindakLanjutView } from './components/RujukanTindakLanjutView';
import { MonitoringLaporanView } from './components/MonitoringLaporanView';
import { AdministrasiView } from './components/AdministrasiView';
import { ModalPengajuanBaru } from './components/ModalPengajuanBaru';
import { ModalVerifikasiQR } from './components/ModalVerifikasiQR';
import { AboutView } from './components/AboutView';
import { LandingPageView } from './components/LandingPageView';
import { LoginPage } from './components/LoginPage';

export default function App() {
  // Navigation / Auth mode: 'landing' (public), 'login' (role selection), or 'dashboard' (authenticated)
  const [appViewMode, setAppViewMode] = useState<'landing' | 'login' | 'dashboard'>('landing');

  // Current logged in user (defaults to Sekretariat for comprehensive overview)
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[1]); // Rina Marlina, S.H. (Sekretariat)
  const [currentTab, setCurrentTab] = useState<ActiveTab>('beranda');
  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string | null>(null);
  const [permohonanList, setPermohonanList] = useState<PermohonanAsesmen[]>(INITIAL_PERMOHONAN);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [qrModalPermohonan, setQrModalPermohonan] = useState<PermohonanAsesmen | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Selected permohonan object
  const selectedPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedPermohonanId) || null;
  }, [permohonanList, selectedPermohonanId]);

  // Badge calculations for sidebar
  const badgeCounts = useMemo(() => {
    return {
      perluPerbaikan: permohonanList.filter(p => p.statusProsesUtama === 'perlu_perbaikan').length,
      siapVerifikasi: permohonanList.filter(p => p.statusProsesUtama === 'verifikasi_berkas' || p.statusProsesUtama === 'diajukan').length,
      siapPleno: permohonanList.filter(p => p.statusProsesUtama === 'siap_pleno').length,
      menungguPengesahan: permohonanList.filter(p => p.statusProsesUtama === 'pengesahan_rekomendasi').length,
      tindakLanjutTerhambat: permohonanList.filter(p => p.statusTindakLanjut === 'terhambat').length
    };
  }, [permohonanList]);

  // Handle updates to an application dossier
  const handleUpdatePermohonan = (updated: PermohonanAsesmen) => {
    setPermohonanList(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Handle creating a new application
  const handleCreatePermohonan = (newPermohonan: PermohonanAsesmen) => {
    setPermohonanList(prev => [newPermohonan, ...prev]);
    setSelectedPermohonanId(newPermohonan.id);
  };

  // Open a specific application from anywhere
  const handleOpenPermohonan = (id: string) => {
    setSelectedPermohonanId(id);
  };

  // Switch tab and clear active detail view if user clicks navigation
  const handleSelectTab = (tab: ActiveTab) => {
    setCurrentTab(tab);
    setSelectedPermohonanId(null);
  };

  // Switch role / user with strict tab and detail view validation
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setSelectedPermohonanId(null);
    const roleAllowedTabs: Record<UserRole, ActiveTab[]> = {
      pengaju: ['beranda', 'permohonan', 'verifikasi', 'penugasan', 'dokumen', 'about'],
      sekretariat: ['beranda', 'permohonan', 'verifikasi', 'penugasan', 'pleno', 'dokumen', 'tindak_lanjut', 'about'],
      medis: ['beranda', 'medis', 'penugasan', 'pleno', 'about'],
      hukum: ['beranda', 'hukum', 'penugasan', 'pleno', 'about'],
      koordinator: ['beranda', 'permohonan', 'pleno', 'dokumen', 'tindak_lanjut', 'about'],
      pimpinan: ['beranda', 'monitoring', 'permohonan', 'tindak_lanjut', 'about'],
      rehabilitasi: ['beranda', 'tindak_lanjut', 'dokumen', 'about'],
      admin: ['beranda', 'administrasi', 'monitoring', 'about']
    };
    if (!roleAllowedTabs[user.role]?.includes(currentTab)) {
      setCurrentTab('beranda');
    }
  };

  // Render view
  const renderCurrentView = () => {
    if (selectedPermohonan) {
      return (
        <PermohonanDetail
          permohonan={selectedPermohonan}
          currentUser={currentUser}
          onBack={() => setSelectedPermohonanId(null)}
          onUpdatePermohonan={handleUpdatePermohonan}
          onOpenQrModal={(item) => setQrModalPermohonan(item)}
        />
      );
    }

    switch (currentTab) {
      case 'beranda':
        return (
          <DashboardHome
            currentUser={currentUser}
            permohonanList={permohonanList}
            onSelectPermohonan={handleOpenPermohonan}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
          />
        );

      case 'permohonan':
        return (
          <PermohonanList
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );

      case 'verifikasi':
        return (
          <VerifikasiBerkasView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'penugasan':
        return (
          <PenugasanJadwalView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'medis':
        return (
          <AsesmenMedisView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'hukum':
        return (
          <AsesmenHukumView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'pleno':
        return (
          <PlenoTATView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'dokumen':
        return (
          <DokumenPengesahanView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            onOpenQrModal={(item) => setQrModalPermohonan(item)}
          />
        );

      case 'tindak_lanjut':
        return (
          <RujukanTindakLanjutView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'monitoring':
        return (
          <MonitoringLaporanView
            permohonanList={permohonanList}
            currentUser={currentUser}
          />
        );

      case 'administrasi':
        return (
          <AdministrasiView
            currentUser={currentUser}
          />
        );

      case 'about':
        return (
          <AboutView
            currentUser={currentUser}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
          />
        );

      default:
        return (
          <DashboardHome
            currentUser={currentUser}
            permohonanList={permohonanList}
            onSelectPermohonan={handleOpenPermohonan}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
          />
        );
    }
  };

  // 1. PUBLIC LANDING PAGE
  if (appViewMode === 'landing') {
    return (
      <LandingPageView
        onGoToLogin={() => setAppViewMode('login')}
        permohonanList={permohonanList}
        onOpenPermohonanDetail={(id) => {
          setSelectedPermohonanId(id);
          setAppViewMode('dashboard');
        }}
      />
    );
  }

  // 2. ROLE SELECTION / BYPASS LOGIN PAGE
  if (appViewMode === 'login') {
    return (
      <LoginPage
        onLogin={(user) => {
          handleSelectUser(user);
          setAppViewMode('dashboard');
        }}
        onBackToLanding={() => setAppViewMode('landing')}
      />
    );
  }

  // 3. AUTHENTICATED ROLE WORKSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col text-slate-800 antialiased font-sans">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPermohonan={handleOpenPermohonan}
        pendingAlertsCount={badgeCounts.perluPerbaikan + (badgeCounts.tindakLanjutTerhambat > 0 ? 1 : 0) + (badgeCounts.menungguPengesahan > 0 ? 1 : 0)}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
        onLogout={() => setAppViewMode('login')}
        onGoToLanding={() => setAppViewMode('landing')}
        onGoToLogin={() => setAppViewMode('login')}
      />

      {/* Main Workspace Layout - Desktop: Clean sidebar docked at the far left */}
      <div className="flex-1 flex w-full">
        {/* Sidebar at desktop corner */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          userRole={currentUser.role}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          badgeCounts={badgeCounts}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          onLogout={() => setAppViewMode('login')}
          onGoToLanding={() => setAppViewMode('landing')}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Modal: Pengajuan Permohonan Asesmen Baru */}
      <ModalPengajuanBaru
        currentUser={currentUser}
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreatePermohonan}
      />

      {/* Modal: Verifikasi QR Publik */}
      <ModalVerifikasiQR
        permohonan={qrModalPermohonan}
        onClose={() => setQrModalPermohonan(null)}
      />
    </div>
  );
}
