import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, PermohonanAsesmen, UserRole, RegistrasiPengguna } from './types';
import { MOCK_USERS, INITIAL_PERMOHONAN, INITIAL_REGISTRATIONS } from './data/initialData';
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
import { InputJadwalKontrolView } from './components/InputJadwalKontrolView';
import { AsesmenPemulihanView } from './components/AsesmenPemulihanView';
import { VerifikasiAkunView } from './components/VerifikasiAkunView';
import { MonitoringLaporanView } from './components/MonitoringLaporanView';
import { AdministrasiView } from './components/AdministrasiView';
import { AsesmenAktifView } from './components/AsesmenAktifView';
import { RiwayatView } from './components/RiwayatView';
import { ModalPengajuanBaru } from './components/ModalPengajuanBaru';
import { ModalVerifikasiQR } from './components/ModalVerifikasiQR';
import { AboutView } from './components/AboutView';
import { ProfileView } from './components/ProfileView';
import { LandingPageView } from './components/LandingPageView';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LacakBerkasPage } from './components/LacakBerkasPage';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation / Auth mode: 'landing' (public), 'lacak' (public tracking), 'login' (role selection), 'register' (Satwil registration), or 'dashboard' (authenticated)
  const [appViewMode, setAppViewMode] = useState<'landing' | 'lacak' | 'login' | 'register' | 'dashboard'>('landing');

  // Active Users list (can expand when admin approves new registrations)
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);

  // Registrations list
  const [registrations, setRegistrations] = useState<RegistrasiPengguna[]>(INITIAL_REGISTRATIONS);

  // Current logged in user (defaults to ADMIN for comprehensive overview)
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Rina Marlina, S.H. (ADMIN/Sekretariat)
  const [currentTab, setCurrentTab] = useState<ActiveTab>('beranda');
  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string | null>(null);
  const [selectedAsesmenId, setSelectedAsesmenId] = useState<string | null>(null);
  const [selectedHukumId, setSelectedHukumId] = useState<string | null>(null);
  const [selectedMedisId, setSelectedMedisId] = useState<string | null>(null);
  const [selectedRiwayatHukumId, setSelectedRiwayatHukumId] = useState<string | null>(null);
  const [selectedTindakLanjutId, setSelectedTindakLanjutId] = useState<string | null>(null);
  const [permohonanList, setPermohonanList] = useState<PermohonanAsesmen[]>(INITIAL_PERMOHONAN);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [qrModalPermohonan, setQrModalPermohonan] = useState<PermohonanAsesmen | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Sync state from URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/lacak') {
      setAppViewMode('lacak');
    } else if (path === '/login') {
      setAppViewMode('login');
    } else if (path === '/register') {
      setAppViewMode('register');
    } else if (path.startsWith('/dashboard')) {
      setAppViewMode('dashboard');
      const parts = path.split('/').filter(Boolean);
      if (parts[1] === 'detail' && parts[2]) {
        setSelectedPermohonanId(parts[2]);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatHukumId(null);
      } else if (parts[1] === 'hukum') {
        setCurrentTab('hukum');
        setSelectedPermohonanId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatHukumId(null);
        if (parts[2] === 'detail' && parts[3]) {
          setSelectedHukumId(parts[3]);
        } else if (parts[2] && parts[2] !== 'detail') {
          setSelectedHukumId(parts[2]);
        } else {
          setSelectedHukumId(null);
        }
      } else if (parts[1] === 'medis') {
        setCurrentTab('medis');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedRiwayatHukumId(null);
        if (parts[2] === 'detail' && parts[3]) {
          setSelectedMedisId(parts[3]);
        } else if (parts[2] && parts[2] !== 'detail') {
          setSelectedMedisId(parts[2]);
        } else {
          setSelectedMedisId(null);
        }
      } else if (parts[1] === 'riwayat_hukum') {
        setCurrentTab('riwayat_hukum');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedTindakLanjutId(null);
        if (parts[2] === 'detail' && parts[3]) {
          setSelectedRiwayatHukumId(parts[3]);
        } else if (parts[2] && parts[2] !== 'detail') {
          setSelectedRiwayatHukumId(parts[2]);
        } else {
          setSelectedRiwayatHukumId(null);
        }
      } else if (parts[1] === 'tindak_lanjut') {
        setCurrentTab('tindak_lanjut');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatHukumId(null);
        if (parts[2] === 'detail' && parts[3]) {
          setSelectedTindakLanjutId(parts[3]);
        } else if (parts[2] && parts[2] !== 'detail') {
          setSelectedTindakLanjutId(parts[2]);
        } else {
          setSelectedTindakLanjutId(null);
        }
      } else if (parts[1]) {
        setCurrentTab(parts[1] as ActiveTab);
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
      } else {
        setCurrentTab('beranda');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
      }
    } else {
      setAppViewMode('landing');
    }
  }, [location.pathname]);


  const changeAppViewMode = (mode: 'landing' | 'lacak' | 'login' | 'register' | 'dashboard') => {
    setAppViewMode(mode);
    if (mode === 'landing') navigate('/');
    else if (mode === 'lacak') navigate('/lacak');
    else if (mode === 'login') navigate('/login');
    else if (mode === 'register') navigate('/register');
    else if (mode === 'dashboard') navigate(`/dashboard/${currentTab}`);
  };

  // Selected permohonan object
  const selectedPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedPermohonanId) || null;
  }, [permohonanList, selectedPermohonanId]);

  const selectedAsesmenPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedAsesmenId) || null;
  }, [permohonanList, selectedAsesmenId]);

  const selectedHukumPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedHukumId) || null;
  }, [permohonanList, selectedHukumId]);

  const selectedMedisPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedMedisId) || null;
  }, [permohonanList, selectedMedisId]);

  const selectedRiwayatHukumPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedRiwayatHukumId) || null;
  }, [permohonanList, selectedRiwayatHukumId]);

  const selectedTindakLanjutPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedTindakLanjutId) || null;
  }, [permohonanList, selectedTindakLanjutId]);

  const activeDetailPermohonan =
    selectedPermohonan ||
    (currentTab === 'asesmen_aktif' ? selectedAsesmenPermohonan : null) ||
    (currentTab === 'hukum' ? selectedHukumPermohonan : null) ||
    (currentTab === 'medis' ? selectedMedisPermohonan : null) ||
    (currentTab === 'riwayat_hukum' ? selectedRiwayatHukumPermohonan : null) ||
    (currentTab.startsWith('tindak_lanjut') ? selectedTindakLanjutPermohonan : null);

  const isViewingAnyDetail = Boolean(
    selectedPermohonan ||
    (currentTab === 'asesmen_aktif' && selectedAsesmenId) ||
    (currentTab === 'hukum' && selectedHukumId) ||
    (currentTab === 'medis' && selectedMedisId) ||
    (currentTab === 'riwayat_hukum' && selectedRiwayatHukumId) ||
    (currentTab.startsWith('tindak_lanjut') && selectedTindakLanjutId) ||
    currentTab === 'riwayat'
  );

  // Badge calculations for sidebar (menggunakan applicationStatus kanonis)
  const badgeCounts = useMemo(() => {
    return {
      perluPerbaikan: permohonanList.filter(p =>
        p.applicationStatus === 'NEEDS_CORRECTION' ||
        p.statusProsesUtama === 'perlu_perbaikan'
      ).length,
      siapVerifikasi: permohonanList.filter(p =>
        p.applicationStatus === 'SUBMITTED' ||
        p.applicationStatus === 'ADMIN_REVIEW' ||
        p.statusProsesUtama === 'verifikasi_berkas' ||
        p.statusProsesUtama === 'diajukan'
      ).length,
      siapPleno: permohonanList.filter(p =>
        p.applicationStatus === 'READY_FOR_CONFERENCE' ||
        p.statusProsesUtama === 'siap_pleno'
      ).length,
      menungguPengesahan: permohonanList.filter(p =>
        p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
        p.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
        p.statusProsesUtama === 'pengesahan_rekomendasi'
      ).length,
      tindakLanjutTerhambat: permohonanList.filter(p =>
        p.followupStatus === 'NOT_YET_REPORTED' ||
        p.followupStatus === 'CLARIFICATION_REQUIRED' ||
        p.statusTindakLanjut === 'terhambat'
      ).length,
      akunPending: registrations.filter(r => r.status === 'pending').length
    };
  }, [permohonanList, registrations]);

  // Handle updates to an application dossier
  const handleUpdatePermohonan = (updated: PermohonanAsesmen) => {
    setPermohonanList(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Handle creating a new application
  const handleCreatePermohonan = (newPermohonan: PermohonanAsesmen) => {
    setPermohonanList(prev => [newPermohonan, ...prev]);
    setSelectedPermohonanId(newPermohonan.id);
  };

  // Handle User Registrations (Satwil / Kapolres)
  const handleRegisterSubmit = (newReg: RegistrasiPengguna) => {
    setRegistrations(prev => [newReg, ...prev]);
  };

  const handleUpdateRegistration = (updatedReg: RegistrasiPengguna) => {
    setRegistrations(prev => prev.map(r => r.id === updatedReg.id ? updatedReg : r));
  };

  const handleApproveRegistration = (reg: RegistrasiPengguna) => {
    // 1. Update registration status
    setRegistrations(prev =>
      prev.map(r => (r.id === reg.id ? { ...reg, status: 'approved' } : r))
    );

    // 2. Add as active user if not existing yet
    const existing = users.find(u => u.email.toLowerCase() === reg.email.toLowerCase());
    if (!existing) {
      const newUser: UserProfile = {
        id: `user-${reg.id}`,
        name: `${reg.pangkat} ${reg.namaLengkap}`,
        nip: reg.nrp,
        role: 'pengaju',
        agency: reg.instansi,
        email: reg.email,
        phone: reg.phone,
        avatar: reg.fotoKtaUrl || undefined
      };
      setUsers(prev => [newUser, ...prev]);
    }
  };

  // Open a specific application from anywhere
  const handleOpenPermohonan = (id: string) => {
    setSelectedPermohonanId(id);
    navigate(`/dashboard/detail/${id}`);
  };

  // Switch tab and clear active detail view if user clicks navigation
  const handleSelectTab = (tab: ActiveTab) => {
    setCurrentTab(tab);
    setSelectedPermohonanId(null);
    setSelectedAsesmenId(null);
    setSelectedHukumId(null);
    setSelectedMedisId(null);
    setSelectedRiwayatHukumId(null);
    navigate(`/dashboard/${tab}`);
  };

  // Switch role / user with strict tab and detail view validation
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setSelectedPermohonanId(null);
    setSelectedAsesmenId(null);
    setSelectedHukumId(null);
    setSelectedMedisId(null);
    setSelectedRiwayatHukumId(null);
    // 4 role kanonis + backward compat untuk role lama
    const roleAllowedTabs: Record<string, ActiveTab[]> = {
      PENGAJU: ['beranda', 'permohonan', 'penugasan', 'dokumen', 'tindak_lanjut', 'about', 'profile'],
      ADMIN: ['beranda', 'permohonan', 'asesmen_aktif', 'riwayat', 'verifikasi', 'penugasan', 'pleno', 'tindak_lanjut', 'verifikasi_akun', 'monitoring', 'about', 'profile'],
      MEDIS: ['beranda', 'medis', 'pemulihan', 'pleno', 'about', 'profile'],
      HUKUM: ['beranda', 'hukum', 'pleno', 'riwayat_hukum', 'about', 'profile'],
      // Backward compat
      pengaju: ['beranda', 'permohonan', 'verifikasi', 'penugasan', 'dokumen', 'about', 'profile'],
      sekretariat: ['beranda', 'permohonan', 'verifikasi', 'penugasan', 'pleno', 'tindak_lanjut', 'verifikasi_akun', 'about', 'profile'],
      medis: ['beranda', 'medis', 'pemulihan', 'pleno', 'about', 'profile'],
      hukum: ['beranda', 'hukum', 'pleno', 'riwayat_hukum', 'about', 'profile'],
      koordinator: ['beranda', 'permohonan', 'pleno', 'dokumen', 'tindak_lanjut', 'about', 'profile'],
      pimpinan: ['beranda', 'monitoring', 'permohonan', 'tindak_lanjut', 'about', 'profile'],
      rehabilitasi: ['beranda', 'tindak_lanjut', 'dokumen', 'about', 'profile'],
      admin: ['beranda', 'administrasi', 'monitoring', 'about', 'profile']
    };
    const allowed = roleAllowedTabs[user.role] || ['beranda'];
    const isTabAllowed = allowed.includes(currentTab) || (currentTab.startsWith('tindak_lanjut') && allowed.includes('tindak_lanjut'));
    if (!isTabAllowed) {
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
            onNavigateToRiwayat={() => handleSelectTab('riwayat')}
          />
        );

      case 'asesmen_aktif':
        return (
          <AsesmenAktifView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            isDetailOpen={Boolean(selectedAsesmenId)}
            selectedActiveId={selectedAsesmenId}
            onSelectActiveCase={(id) => setSelectedAsesmenId(id)}
            onBackFromActiveCase={() => setSelectedAsesmenId(null)}
          />
        );

      case 'riwayat':
        return (
          <RiwayatView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            onBack={() => handleSelectTab('permohonan')}
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
            onUpdatePermohonan={handleUpdatePermohonan}
            onSelectPermohonan={handleOpenPermohonan}
            selectedCaseId={selectedMedisId}
            onSelectCase={(id) => {
              setSelectedMedisId(id);
              if (id) {
                navigate(`/dashboard/medis/detail/${id}`);
              } else {
                navigate('/dashboard/medis');
              }
            }}
          />
        );

      case 'hukum':
        return (
          <AsesmenHukumView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdatePermohonan}
            onSelectPermohonan={handleOpenPermohonan}
            selectedCaseId={selectedHukumId}
            mode="active"
            onSelectCase={(id) => {
              setSelectedHukumId(id);
              if (id) {
                navigate(`/dashboard/hukum/detail/${id}`);
              } else {
                navigate('/dashboard/hukum');
              }
            }}
          />
        );

      case 'riwayat_hukum':
        return (
          <AsesmenHukumView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdatePermohonan}
            onSelectPermohonan={handleOpenPermohonan}
            selectedCaseId={selectedRiwayatHukumId}
            mode="history"
            onSelectCase={(id) => {
              setSelectedRiwayatHukumId(id);
              if (id) {
                navigate(`/dashboard/riwayat_hukum/detail/${id}`);
              } else {
                navigate('/dashboard/riwayat_hukum');
              }
            }}
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

      case 'pemulihan':
        return (
          <AsesmenPemulihanView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
          />
        );

      case 'tindak_lanjut_input_jadwal':
        return (
          <InputJadwalKontrolView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdatePermohonan}
            onNavigateToMonitoring={(caseId) => {
              setSelectedTindakLanjutId(caseId);
              setCurrentTab('tindak_lanjut_monitoring');
              navigate(`/dashboard/tindak_lanjut/detail/${caseId}`);
            }}
            onBack={() => {
              setCurrentTab('tindak_lanjut');
              navigate('/dashboard/tindak_lanjut');
            }}
          />
        );

      case 'tindak_lanjut':
      case 'tindak_lanjut_ceklis':
      case 'tindak_lanjut_monitoring':
      case 'tindak_lanjut_wajib_lapor':
      case 'tindak_lanjut_rujukan':
        return (
          <RujukanTindakLanjutView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            onUpdatePermohonan={handleUpdatePermohonan}
            selectedCaseId={selectedTindakLanjutId}
            currentTab={currentTab}
            onSelectCase={(id) => {
              setSelectedTindakLanjutId(id);
              if (id) {
                navigate(`/dashboard/tindak_lanjut/detail/${id}`);
              } else {
                navigate('/dashboard/tindak_lanjut');
              }
            }}
          />
        );

      case 'verifikasi_akun':
        return (
          <VerifikasiAkunView
            registrations={registrations}
            onUpdateRegistration={handleUpdateRegistration}
            onApproveRegistration={handleApproveRegistration}
            currentUser={currentUser}
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
            registrations={registrations}
            onUpdateRegistration={handleUpdateRegistration}
            onApproveRegistration={handleApproveRegistration}
          />
        );

      case 'about':
        return (
          <AboutView
            currentUser={currentUser}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
          />
        );

      case 'profile':
        return (
          <ProfileView
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
            onGoToLogin={() => changeAppViewMode('login')}
            onGoToLanding={() => changeAppViewMode('landing')}
          />
        );

      default:
        return (
          <DashboardHome
            currentUser={currentUser}
            permohonanList={permohonanList}
            onSelectPermohonan={handleOpenPermohonan}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
            onOpenNewModal={() => setIsNewModalOpen(true)}
          />
        );
    }
  };

  // 1. PUBLIC LANDING PAGE
  if (appViewMode === 'landing') {
    return (
      <LandingPageView
        onGoToLogin={() => changeAppViewMode('login')}
        onGoToRegister={() => changeAppViewMode('register')}
        onGoToLacak={() => changeAppViewMode('lacak')}
        permohonanList={permohonanList}
        onOpenPermohonanDetail={(id) => {
          setSelectedPermohonanId(id);
          changeAppViewMode('dashboard');
        }}
      />
    );
  }

  // 1.2 STANDALONE SATWIL REGISTRATION PAGE
  if (appViewMode === 'register') {
    return (
      <RegisterPage
        onRegisterSubmit={handleRegisterSubmit}
        onBackToLanding={() => changeAppViewMode('landing')}
        onGoToLogin={() => changeAppViewMode('login')}
      />
    );
  }

  // 1.5 STANDALONE LACAK BERKAS PAGE
  if (appViewMode === 'lacak') {
    return (
      <LacakBerkasPage
        permohonanList={permohonanList}
        onGoToLanding={(sectionId) => {
          changeAppViewMode('landing');
          if (sectionId) {
            setTimeout(() => {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }}
        onGoToLogin={() => changeAppViewMode('login')}
        onGoToRegister={() => changeAppViewMode('register')}
        onOpenPermohonanDetail={(id) => {
          setSelectedPermohonanId(id);
          changeAppViewMode('dashboard');
        }}
      />
    );
  }

  // 2. ROLE SELECTION / BYPASS LOGIN PAGE
  if (appViewMode === 'login') {
    return (
      <LoginPage
        users={users}
        registrations={registrations}
        onLogin={(user) => {
          handleSelectUser(user);
          changeAppViewMode('dashboard');
        }}
        onBackToLanding={() => changeAppViewMode('landing')}
        onGoToRegister={() => changeAppViewMode('register')}
      />
    );
  }

  // 3. AUTHENTICATED ROLE WORKSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-[#071326] flex flex-col text-slate-100 antialiased font-roboto dashboard-workspace selection:bg-[#38bdf8]/30 selection:text-white" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Top Application Header - Sticky Bar (Adapts content when viewing detail page) */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPermohonan={handleOpenPermohonan}
        pendingAlertsCount={badgeCounts.perluPerbaikan + (badgeCounts.tindakLanjutTerhambat > 0 ? 1 : 0) + (badgeCounts.menungguPengesahan > 0 ? 1 : 0)}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
        onLogout={() => changeAppViewMode('login')}
        onGoToLanding={() => changeAppViewMode('landing')}
        onGoToLogin={() => changeAppViewMode('login')}
        selectedPermohonan={activeDetailPermohonan}
        onBackFromDetail={() => {
          if (selectedPermohonanId) {
            setSelectedPermohonanId(null);
            navigate(`/dashboard/${currentTab}`);
          }
          if (selectedAsesmenId) {
            setSelectedAsesmenId(null);
          }
          if (selectedHukumId) {
            setSelectedHukumId(null);
            navigate('/dashboard/hukum');
          }
          if (selectedMedisId) {
            setSelectedMedisId(null);
            navigate('/dashboard/medis');
          }
          if (selectedRiwayatHukumId) {
            setSelectedRiwayatHukumId(null);
            navigate('/dashboard/riwayat_hukum');
          }
        }}
        onOpenQrModal={(item) => setQrModalPermohonan(item)}
      />

      {/* Main Workspace Layout - Desktop: Sidebar hidden on Detail Page */}
      <div className="flex-1 flex w-full bg-[#071326]">
        {/* Sidebar at desktop corner - Hidden on Detail View for full focus */}
        {!isViewingAnyDetail && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            userRole={currentUser.role}
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            badgeCounts={badgeCounts}
            isMobileOpen={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
            onLogout={() => setAppViewMode('login')}
            onGoToLanding={() => setAppViewMode('landing')}
            hasTopHeader={true}
          />
        )}

        {/* Content Viewport */}
        <main className={`flex-1 min-w-0 p-3 sm:p-6 lg:p-8 ${isViewingAnyDetail ? 'pb-6 md:pb-8' : 'pb-20 md:pb-8'} overflow-x-hidden bg-[#071326]`}>
          <div className="max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Mobile Native App Bottom Navigation Bar - Hidden on Detail View */}
      {!isViewingAnyDetail && (
        <MobileBottomNav
          userRole={currentUser.role}
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          badgeCounts={badgeCounts}
        />
      )}

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
