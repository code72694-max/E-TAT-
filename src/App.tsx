import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, PermohonanAsesmen, UserRole, RegistrasiPengguna, PetugasLainnyaItem } from './types';
import { authApi, permohonanApi, registrasiApi, tokenStorage } from './services/api';
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
import { JadwalKlienView } from './components/JadwalKlienView';
import { AsesmenPemulihanView } from './components/AsesmenPemulihanView';
import { VerifikasiAkunView } from './components/VerifikasiAkunView';
import { MonitoringLaporanView } from './components/MonitoringLaporanView';
import { AdministrasiView } from './components/AdministrasiView';
import { AsesmenAktifView } from './components/AsesmenAktifView';
import { RiwayatView } from './components/RiwayatView';
import { PengajuanBaruView } from './components/PengajuanBaruView';
import { ModalVerifikasiQR } from './components/ModalVerifikasiQR';
import { AboutView } from './components/AboutView';
import { ProfileView } from './components/ProfileView';
import { LandingPageView } from './components/LandingPageView';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LacakBerkasPage } from './components/LacakBerkasPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { riwayatPermohonanSeedList } from './data/riwayatSeedData';

export const getRolePath = (role?: UserRole | string): string => {
  if (!role) return 'admin';
  const r = role.toLowerCase();
  if (r === 'sekretariat') return 'admin';
  return r;
};

export const sanitizeUserProfile = (user: UserProfile | null): UserProfile | null => {
  if (!user) return null;
  const r = user.role?.toUpperCase();
  let defaultPetugas: PetugasLainnyaItem[] = [];
  if (r === 'HUKUM') {
    defaultPetugas = [
      { nama: 'Kombes Pol. Andi Pratama, S.I.K., M.H.', tipeIdentitas: 'NRP', nomorIdentitas: '76090412' },
      { nama: 'Ipda Budi Santoso, S.H.', tipeIdentitas: 'NRP', nomorIdentitas: '85010234' }
    ];
  } else if (r === 'MEDIS') {
    defaultPetugas = [
      { nama: 'dr. Farhan Hidayat, M.Kes.', tipeIdentitas: 'NIP', nomorIdentitas: '198603152012011002' }
    ];
  }

  let cleanName = user.name ? user.name.replace(/\[TEST\]\s*/gi, '').replace(/\(Akun Uji\)/gi, '').trim() : '';
  if (!cleanName || cleanName === 'Dokter Asesor Medis TAT' || cleanName.toLowerCase().includes('dokter asesor medis')) {
    cleanName = 'dr. Sarah Amelia, Sp.KJ';
  } else if (!cleanName || cleanName === 'Jaksa Asesor Hukum TAT' || cleanName.toLowerCase().includes('jaksa asesor hukum')) {
    cleanName = 'Ahmad Fauzi, S.H., M.H.';
  } else if (!cleanName || cleanName === 'Admin Sekretariat TAT' || cleanName.toLowerCase().includes('admin sekretariat')) {
    cleanName = 'Kompol Hendra Kusuma, S.I.K., M.Si.';
  } else if (!cleanName || cleanName === 'Penyidik Pengaju Satresnarkoba' || cleanName.toLowerCase().includes('penyidik pengaju')) {
    cleanName = 'Ipda Budi Santoso, S.H.';
  }

  const rawList = Array.isArray(user.petugasLainnya) ? user.petugasLainnya : defaultPetugas;
  const resolvedPetugas: PetugasLainnyaItem[] = rawList.slice(0, 2).map(item => {
    if (typeof item === 'string') {
      const isPolice = item.includes('Pol') || item.includes('Kombes') || item.includes('Ipda') || item.includes('Kompol');
      return {
        nama: item,
        tipeIdentitas: isPolice ? 'NRP' : 'NIP',
        nomorIdentitas: item.includes('Andi Pratama') ? '76090412' : item.includes('Budi Santoso') ? '85010234' : item.includes('Farhan') ? '198603152012011002' : ''
      };
    }
    return item;
  });

  const defaultTipeIdentitas = r === 'PENGAJU' || cleanName.includes('Pol') ? 'NRP' : 'NIP';

  return {
    ...user,
    name: cleanName,
    tipeIdentitas: user.tipeIdentitas || defaultTipeIdentitas,
    position: user.position ? user.position.replace(/\(Akun Uji\)/gi, '').replace(/\[TEST\]\s*/gi, '').trim() : (
      r === 'HUKUM' ? 'Jaksa Penuntut Umum / Tim Asesor Hukum TAT' :
      r === 'MEDIS' ? 'Dokter Spesialis Kedokteran Jiwa / Asesor Medis TAT' :
      r === 'PENGAJU' ? 'Kanit Idik Satresnarkoba / Penyidik Pengaju' :
      'Ketua Tim Sekretariat TAT BNNP Kalimantan Timur'
    ),
    pangkat: user.pangkat || (
      r === 'HUKUM' ? 'Jaksa Muda / Penata Tk. I (III/d)' :
      r === 'MEDIS' ? 'Pembina / Penata Tk. I (IV/b)' :
      r === 'PENGAJU' ? 'Inspektur Polisi Dua (Ipda)' :
      'Komisaris Polisi (Kompol)'
    ),
    petugasLainnya: resolvedPetugas,
  };
};

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Kompol Hendra Kusuma, S.I.K., M.Si.',
    nip: '79080512',
    tipeIdentitas: 'NRP',
    role: 'ADMIN',
    agency: 'Sekretariat TAT BNNP Kalimantan Timur',
    email: 'admin@tat.polri.go.id',
    phone: '081234567890',
    position: 'Ketua Tim Sekretariat TAT BNNP Kalimantan Timur',
    pangkat: 'Komisaris Polisi (Kompol)',
  },
  {
    id: 'user-pengaju',
    name: 'Ipda Budi Santoso, S.H.',
    nip: '85010234',
    tipeIdentitas: 'NRP',
    role: 'PENGAJU',
    agency: 'Satresnarkoba Polresta Samarinda',
    email: 'penyidik.samarinda@polri.go.id',
    phone: '081298765432',
    position: 'Kanit Idik Satresnarkoba / Penyidik Pengaju',
    pangkat: 'Inspektur Polisi Dua (Ipda)',
  },
  {
    id: 'user-medis',
    name: 'dr. Sarah Amelia, Sp.KJ',
    nip: '198205122008012001',
    tipeIdentitas: 'NIP',
    role: 'MEDIS',
    agency: 'BNNP Kalimantan Timur / RSUD AW Sjahranie',
    email: 'medis.sarah@tat.bnn.go.id',
    phone: '081311223344',
    position: 'Dokter Spesialis Kedokteran Jiwa / Asesor Medis TAT',
    pangkat: 'Pembina / Penata Tk. I (IV/b)',
    petugasLainnya: [
      { nama: 'dr. Farhan Hidayat, M.Kes.', tipeIdentitas: 'NIP', nomorIdentitas: '198603152012011002' }
    ],
  },
  {
    id: 'user-hukum',
    name: 'Ahmad Fauzi, S.H., M.H.',
    nip: '197903152003121002',
    tipeIdentitas: 'NIP',
    role: 'HUKUM',
    agency: 'Kejaksaan Tinggi Kalimantan Timur',
    email: 'hukum.fauzi@kejaksaan.go.id',
    phone: '081399887766',
    position: 'Jaksa Penuntut Umum / Tim Asesor Hukum TAT',
    pangkat: 'Jaksa Muda / Penata Tk. I (III/d)',
    petugasLainnya: [
      { nama: 'Kombes Pol. Andi Pratama, S.I.K., M.H.', tipeIdentitas: 'NRP', nomorIdentitas: '76090412' },
      { nama: 'Ipda Budi Santoso, S.H.', tipeIdentitas: 'NRP', nomorIdentitas: '85010234' }
    ],
  },
];

const DEFAULT_USER: UserProfile = DEFAULT_USERS[0];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation / Auth mode: 'landing' (public), 'lacak' (public tracking), 'login' (role selection), 'register' (Satwil registration), or 'dashboard' (authenticated)
  const [appViewMode, setAppViewMode] = useState<'landing' | 'lacak' | 'login' | 'register' | 'dashboard'>('landing');

  // Active Users list (persisted with any custom profile edits)
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('etat_custom_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(u => sanitizeUserProfile(u)!);
        }
      }
    } catch {}
    return DEFAULT_USERS.map(u => sanitizeUserProfile(u)!);
  });

  // Registrations list
  const [registrations, setRegistrations] = useState<RegistrasiPengguna[]>([]);

  // Current logged in user (restored from localStorage if available)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => sanitizeUserProfile(tokenStorage.getUser()) || DEFAULT_USER);

  // Update current user handler (for profile edits and additional officers configuration)
  const handleUpdateCurrentUser = useCallback((updatedUser: UserProfile) => {
    const sanitized = sanitizeUserProfile(updatedUser) || updatedUser;
    setCurrentUser(sanitized);
    tokenStorage.setUser(sanitized);
    setUsers(prev => {
      const exists = prev.some(u => u.id === sanitized.id || u.role?.toLowerCase() === sanitized.role?.toLowerCase());
      const next = exists
        ? prev.map(u => (u.id === sanitized.id || u.role?.toLowerCase() === sanitized.role?.toLowerCase() ? sanitized : u))
        : [sanitized, ...prev];
      try {
        localStorage.setItem('etat_custom_users', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('beranda');
  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string | null>(null);
  const [selectedAsesmenId, setSelectedAsesmenId] = useState<string | null>(null);
  const [selectedHukumId, setSelectedHukumId] = useState<string | null>(null);
  const [selectedMedisId, setSelectedMedisId] = useState<string | null>(null);
  const [selectedRiwayatMedisId, setSelectedRiwayatMedisId] = useState<string | null>(null);
  const [selectedRiwayatHukumId, setSelectedRiwayatHukumId] = useState<string | null>(null);
  const [selectedTindakLanjutId, setSelectedTindakLanjutId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [selectedScheduleCaseId, setSelectedScheduleCaseId] = useState<string | null>(null);
  const [permohonanList, setPermohonanList] = useState<PermohonanAsesmen[]>(riwayatPermohonanSeedList);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackendLoading, setIsBackendLoading] = useState(false);

  // Fetch real data from backend API
  const fetchBackendData = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      return; // Hindari request 401 jika belum login / belum ada token
    }

    setIsBackendLoading(true);
    try {
      const savedUser = tokenStorage.getUser();
      const isAdmin = savedUser?.role?.toUpperCase() === 'ADMIN';

      const promises: [Promise<any>, Promise<any>?] = [permohonanApi.getAll({ limit: 100 })];
      if (isAdmin) {
        promises.push(registrasiApi.getAll());
      }

      const results = await Promise.allSettled(promises);
      const permohonanRes = results[0];
      const regRes = results[1];

      if (permohonanRes && permohonanRes.status === 'fulfilled' && permohonanRes.value?.data) {
        const fetchedData: PermohonanAsesmen[] = permohonanRes.value.data;
        const combined = [...fetchedData];
        for (const seedItem of riwayatPermohonanSeedList) {
          if (!combined.some(p => p.id === seedItem.id || p.nomorPermohonan === seedItem.nomorPermohonan)) {
            combined.push(seedItem);
          }
        }
        setPermohonanList(combined);
      }

      if (regRes && regRes.status === 'fulfilled' && regRes.value?.data) {
        setRegistrations(regRes.value.data);
      }
    } catch (e) {
      console.warn('Backend data load error:', e);
    } finally {
      setIsBackendLoading(false);
    }
  }, []);

  // Sync session on startup
  useEffect(() => {
    const savedUser = tokenStorage.getUser();
    const token = tokenStorage.getAccessToken();
    if (savedUser && token) {
      setCurrentUser(savedUser);
      fetchBackendData();
    }
  }, [fetchBackendData]);

  // Modals
  const [qrModalPermohonan, setQrModalPermohonan] = useState<PermohonanAsesmen | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedRegistrasiId, setSelectedRegistrasiId] = useState<string | null>(null);

  const navigateToDashboard = useCallback((subPath: string = '') => {
    const roleSlug = getRolePath(currentUser.role);
    const cleanSub = subPath ? (subPath.startsWith('/') ? subPath : `/${subPath}`) : '';
    navigate(`/${roleSlug}/dashboard${cleanSub}`);
  }, [currentUser.role, navigate]);

  // Sync state from URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/lacak' || path.startsWith('/lacak') || path === '/verifikasi' || path.startsWith('/verifikasi')) {
      setAppViewMode('lacak');
      return;
    }
    if (path === '/login') {
      setAppViewMode('login');
      return;
    }
    if (path === '/register') {
      setAppViewMode('register');
      return;
    }
    if (path === '/' || path === '') {
      setAppViewMode('landing');
      return;
    }

    const parts = path.split('/').filter(Boolean);
    const dashboardIndex = parts.indexOf('dashboard');

    // Handle root role paths like /pengaju, /admin, /medis, /hukum (redirecting to /:role/dashboard)
    const KNOWN_ROLES = ['pengaju', 'admin', 'sekretariat', 'medis', 'hukum', 'koordinator', 'rehabilitasi', 'pimpinan'];
    const isKnownRole = parts.length > 0 && (
      KNOWN_ROLES.includes(parts[0].toLowerCase()) ||
      users.some(u => getRolePath(u.role) === parts[0].toLowerCase())
    );

    if (isKnownRole && dashboardIndex === -1) {
      const roleSlug = parts[0].toLowerCase();
      const matchingUser = users.find(u => getRolePath(u.role) === roleSlug);
      if (matchingUser && getRolePath(currentUser.role) !== roleSlug) {
        setCurrentUser(matchingUser);
        tokenStorage.setUser(matchingUser);
      }
      const rest = parts.slice(1).join('/');
      const target = rest ? `/${roleSlug}/dashboard/${rest}` : `/${roleSlug}/dashboard`;
      navigate(target, { replace: true });
      return;
    }

    if (dashboardIndex !== -1) {
      setAppViewMode('dashboard');

      // Check if URL has role prefix before 'dashboard'
      // Example without role: /dashboard/... (parts = ['dashboard', ...])
      if (dashboardIndex === 0) {
        // Redirect legacy /dashboard/... to /:role/dashboard/...
        const roleSlug = getRolePath(currentUser.role);
        navigate(`/${roleSlug}${path}`, { replace: true });
        return;
      }

      // Role exists before 'dashboard': /:role/dashboard/...
      const roleInPath = parts[dashboardIndex - 1].toLowerCase();
      if (getRolePath(currentUser.role) !== roleInPath) {
        const matchingUser = users.find(u => getRolePath(u.role) === roleInPath);
        if (matchingUser) {
          setCurrentUser(matchingUser);
        }
      }

      const subParts = parts.slice(dashboardIndex + 1);
      const tabParam = subParts[0];

      if (tabParam === 'pengajuan_baru' || tabParam === 'pengajuan-baru' || (tabParam === 'pengajuan' && subParts[1] === 'baru')) {
        setCurrentTab('pengajuan_baru');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
      } else if (tabParam === 'detail' && subParts[1]) {
        setSelectedPermohonanId(subParts[1]);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
      } else if (tabParam === 'asesmen_aktif') {
        setCurrentTab('asesmen_aktif');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedAsesmenId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedAsesmenId(subParts[1]);
        } else {
          setSelectedAsesmenId(null);
        }
      } else if (tabParam === 'hukum') {
        setCurrentTab('hukum');
        setSelectedPermohonanId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedHukumId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedHukumId(subParts[1]);
        } else {
          setSelectedHukumId(null);
        }
      } else if (tabParam === 'medis') {
        setCurrentTab('medis');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedMedisId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedMedisId(subParts[1]);
        } else {
          setSelectedMedisId(null);
        }
      } else if (tabParam === 'riwayat_medis') {
        setCurrentTab('riwayat_medis');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedRiwayatMedisId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedRiwayatMedisId(subParts[1]);
        } else {
          setSelectedRiwayatMedisId(null);
        }
      } else if (tabParam === 'riwayat_hukum') {
        setCurrentTab('riwayat_hukum');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedRiwayatHukumId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedRiwayatHukumId(subParts[1]);
        } else {
          setSelectedRiwayatHukumId(null);
        }
      } else if (tabParam === 'tindak_lanjut_jadwal') {
        setCurrentTab('tindak_lanjut_jadwal');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedScheduleCaseId(subParts[2]);
          setSelectedScheduleId(subParts[3] || null);
        } else {
          setSelectedScheduleCaseId(null);
          setSelectedScheduleId(null);
        }
      } else if (tabParam && tabParam.startsWith('tindak_lanjut')) {
        setCurrentTab(tabParam as ActiveTab);
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedTindakLanjutId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedTindakLanjutId(subParts[1]);
        } else {
          setSelectedTindakLanjutId(null);
        }
      } else if (tabParam === 'verifikasi_akun') {
        setCurrentTab('verifikasi_akun');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        if (subParts[1] === 'detail' && subParts[2]) {
          setSelectedRegistrasiId(subParts[2]);
        } else if (subParts[1] && subParts[1] !== 'detail') {
          setSelectedRegistrasiId(subParts[1]);
        } else {
          setSelectedRegistrasiId(null);
        }
      } else if (tabParam) {
        setCurrentTab(tabParam as ActiveTab);
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
      } else {
        setCurrentTab('beranda');
        setSelectedPermohonanId(null);
        setSelectedHukumId(null);
        setSelectedMedisId(null);
        setSelectedRiwayatMedisId(null);
        setSelectedRiwayatHukumId(null);
        setSelectedTindakLanjutId(null);
        setSelectedScheduleCaseId(null);
        setSelectedScheduleId(null);
        setSelectedRegistrasiId(null);
      }
    } else {
      setAppViewMode('landing');
    }
  }, [location.pathname, currentUser.role, users, navigate]);

  const changeAppViewMode = (mode: 'landing' | 'lacak' | 'login' | 'register' | 'dashboard') => {
    setAppViewMode(mode);
    if (mode === 'landing') navigate('/');
    else if (mode === 'lacak') navigate('/lacak');
    else if (mode === 'login') navigate('/login');
    else if (mode === 'register') navigate('/register');
    else if (mode === 'dashboard') navigateToDashboard(`/${currentTab}`);
  };

  // Selected permohonan object
  const selectedPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedPermohonanId) || riwayatPermohonanSeedList.find(p => p.id === selectedPermohonanId) || null;
  }, [permohonanList, selectedPermohonanId]);

  const selectedAsesmenPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedAsesmenId) || riwayatPermohonanSeedList.find(p => p.id === selectedAsesmenId) || null;
  }, [permohonanList, selectedAsesmenId]);

  const selectedHukumPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedHukumId) || null;
  }, [permohonanList, selectedHukumId]);

  const selectedMedisPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedMedisId) || null;
  }, [permohonanList, selectedMedisId]);

  const selectedRiwayatMedisPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedRiwayatMedisId) || null;
  }, [permohonanList, selectedRiwayatMedisId]);

  const selectedRiwayatHukumPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedRiwayatHukumId) || null;
  }, [permohonanList, selectedRiwayatHukumId]);

  const selectedTindakLanjutPermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedTindakLanjutId) || null;
  }, [permohonanList, selectedTindakLanjutId]);

  const selectedSchedulePermohonan = useMemo(() => {
    return permohonanList.find(p => p.id === selectedScheduleCaseId) || null;
  }, [permohonanList, selectedScheduleCaseId]);

  const activeDetailPermohonan =
    selectedPermohonan ||
    (currentTab === 'asesmen_aktif' ? selectedAsesmenPermohonan : null) ||
    (currentTab === 'hukum' ? selectedHukumPermohonan : null) ||
    (currentTab === 'medis' ? selectedMedisPermohonan : null) ||
    (currentTab === 'riwayat_medis' ? selectedRiwayatMedisPermohonan : null) ||
    (currentTab === 'riwayat_hukum' ? selectedRiwayatHukumPermohonan : null) ||
    (currentTab === 'tindak_lanjut_jadwal' ? selectedSchedulePermohonan : null) ||
    (currentTab.startsWith('tindak_lanjut') ? selectedTindakLanjutPermohonan : null);

  const isViewingAnyDetail = Boolean(
    selectedPermohonan ||
    (currentTab === 'asesmen_aktif' && selectedAsesmenId) ||
    (currentTab === 'hukum' && selectedHukumId) ||
    (currentTab === 'medis' && selectedMedisId) ||
    (currentTab === 'riwayat_medis' && selectedRiwayatMedisId) ||
    (currentTab === 'riwayat_hukum' && selectedRiwayatHukumId) ||
    (currentTab === 'tindak_lanjut_jadwal' && selectedScheduleCaseId) ||
    (currentTab.startsWith('tindak_lanjut') && selectedTindakLanjutId) ||
    (currentTab === 'verifikasi_akun' && selectedRegistrasiId) ||
    currentTab === 'riwayat' ||
    currentTab === 'pengajuan_baru'
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
  const handleUpdatePermohonan = (arg1: any, arg2?: any) => {
    const updated = arg2 ? { ...arg2, id: arg1 } : arg1;
    if (!updated || !updated.id) return;
    setPermohonanList(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
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
    navigateToDashboard(`/detail/${id}`);
  };

  // Switch tab and clear active detail view if user clicks navigation
  const handleSelectTab = (tab: ActiveTab) => {
    setCurrentTab(tab);
    setSelectedPermohonanId(null);
    setSelectedAsesmenId(null);
    setSelectedHukumId(null);
    setSelectedMedisId(null);
    setSelectedRiwayatHukumId(null);
    setSelectedTindakLanjutId(null);
    navigateToDashboard(`/${tab}`);
  };

  // Switch role / user with strict tab and detail view validation
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    tokenStorage.setUser(user);
    if (user.email) {
      authApi.login(user.email, 'password123').catch(() => {});
    }
    setSelectedPermohonanId(null);
    setSelectedAsesmenId(null);
    setSelectedHukumId(null);
    setSelectedMedisId(null);
    setSelectedRiwayatHukumId(null);
    setSelectedTindakLanjutId(null);
    // 4 role kanonis + backward compat untuk role lama
    const roleAllowedTabs: Record<string, ActiveTab[]> = {
      PENGAJU: ['beranda', 'permohonan', 'pengajuan_baru', 'asesmen_aktif', 'dokumen', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'riwayat', 'about', 'profile'],
      ADMIN: ['beranda', 'permohonan', 'pengajuan_baru', 'asesmen_aktif', 'riwayat', 'verifikasi', 'penugasan', 'pleno', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'verifikasi_akun', 'monitoring', 'about', 'profile'],
      MEDIS: ['beranda', 'medis', 'riwayat_medis', 'tindak_lanjut', 'pleno', 'about', 'profile'],
      HUKUM: ['beranda', 'hukum', 'pleno', 'riwayat_hukum', 'about', 'profile'],
      // Backward compat
      pengaju: ['beranda', 'permohonan', 'pengajuan_baru', 'asesmen_aktif', 'verifikasi', 'dokumen', 'riwayat', 'about', 'profile'],
      sekretariat: ['beranda', 'permohonan', 'pengajuan_baru', 'verifikasi', 'penugasan', 'pleno', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'riwayat', 'verifikasi_akun', 'about', 'profile'],
      medis: ['beranda', 'medis', 'riwayat_medis', 'tindak_lanjut', 'pleno', 'about', 'profile'],
      hukum: ['beranda', 'hukum', 'pleno', 'riwayat_hukum', 'about', 'profile'],
      koordinator: ['beranda', 'permohonan', 'pengajuan_baru', 'pleno', 'dokumen', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'about', 'profile'],
      pimpinan: ['beranda', 'monitoring', 'permohonan', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'about', 'profile'],
      rehabilitasi: ['beranda', 'tindak_lanjut', 'tindak_lanjut_jadwal', 'dokumen', 'about', 'profile'],
      admin: ['beranda', 'administrasi', 'monitoring', 'about', 'profile']
    };
    const allowed = roleAllowedTabs[user.role] || ['beranda'];
    const isTabAllowed = allowed.includes(currentTab) || (currentTab.startsWith('tindak_lanjut') && allowed.includes('tindak_lanjut'));
    const nextTab = isTabAllowed ? currentTab : 'beranda';
    setCurrentTab(nextTab);
    const newRoleSlug = getRolePath(user.role);
    navigate(`/${newRoleSlug}/dashboard/${nextTab}`);
  };

  // Render view
  const renderCurrentView = () => {
    if (selectedPermohonan) {
      return (
        <PermohonanDetail
          permohonan={selectedPermohonan}
          currentUser={currentUser}
          onBack={() => {
            setSelectedPermohonanId(null);
            navigateToDashboard('/permohonan');
          }}
          onUpdatePermohonan={handleUpdatePermohonan}
          onOpenQrModal={(item) => setQrModalPermohonan(item)}
          isReadonly={currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU'}
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

      case 'pengajuan_baru':
        return (
          <PengajuanBaruView
            currentUser={currentUser}
            onBack={() => handleSelectTab('beranda')}
            onSubmit={handleCreatePermohonan}
          />
        );

      case 'permohonan':
        return (
          <PermohonanList
            permohonanList={permohonanList}
            currentUser={currentUser}
            onSelectPermohonan={handleOpenPermohonan}
            onOpenNewModal={() => handleSelectTab('pengajuan_baru')}
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
            onUpdatePermohonan={handleUpdatePermohonan}
            isDetailOpen={Boolean(selectedAsesmenId)}
            selectedActiveId={selectedAsesmenId}
            onSelectActiveCase={(id) => {
              setSelectedAsesmenId(id);
              if (id) {
                navigateToDashboard(`/asesmen_aktif/detail/${id}`);
              } else {
                navigateToDashboard('/asesmen_aktif');
              }
            }}
            onBackFromActiveCase={() => {
              setSelectedAsesmenId(null);
              navigateToDashboard('/asesmen_aktif');
            }}
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
            mode="active"
            onSelectCase={(id) => {
              setSelectedMedisId(id);
              if (id) {
                navigateToDashboard(`/medis/detail/${id}`);
              } else {
                navigateToDashboard('/medis');
              }
            }}
          />
        );

      case 'riwayat_medis':
        return (
          <AsesmenMedisView
            permohonanList={permohonanList}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdatePermohonan}
            onSelectPermohonan={handleOpenPermohonan}
            selectedCaseId={selectedRiwayatMedisId}
            mode="history"
            onSelectCase={(id) => {
              setSelectedRiwayatMedisId(id);
              if (id) {
                navigateToDashboard(`/riwayat_medis/detail/${id}`);
              } else {
                navigateToDashboard('/riwayat_medis');
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
                navigateToDashboard(`/hukum/detail/${id}`);
              } else {
                navigateToDashboard('/hukum');
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
                navigateToDashboard(`/riwayat_hukum/detail/${id}`);
              } else {
                navigateToDashboard('/riwayat_hukum');
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
            onUpdatePermohonan={handleUpdatePermohonan}
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

      case 'tindak_lanjut_jadwal':
        return (
          <JadwalKlienView
            permohonanList={permohonanList}
            onSelectPermohonan={handleOpenPermohonan}
            selectedScheduleId={selectedScheduleId}
            selectedCaseId={selectedScheduleCaseId}
            onSelectSchedule={(caseId, schedId) => {
              setSelectedScheduleCaseId(caseId);
              setSelectedScheduleId(schedId);
              if (caseId && schedId) {
                navigateToDashboard(`/tindak_lanjut_jadwal/detail/${caseId}/${schedId}`);
              } else {
                navigateToDashboard('/tindak_lanjut_jadwal');
              }
            }}
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
              navigateToDashboard(`/tindak_lanjut/detail/${caseId}`);
            }}
            onBack={() => {
              setCurrentTab('tindak_lanjut');
              navigateToDashboard('/tindak_lanjut');
            }}
          />
        );

      case 'tindak_lanjut':
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
                navigateToDashboard(`/tindak_lanjut/detail/${id}`);
              } else {
                navigateToDashboard('/tindak_lanjut');
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
            permohonanList={permohonanList}
            selectedRegistrasiId={selectedRegistrasiId}
            onSelectRegistrasi={(id) => {
              setSelectedRegistrasiId(id);
              if (id) {
                navigateToDashboard(`/verifikasi_akun/detail/${id}`);
              } else {
                navigateToDashboard('/verifikasi_akun');
              }
            }}
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
            users={users}
            onSelectUser={handleSelectUser}
            onGoToLogin={() => changeAppViewMode('login')}
            onGoToLanding={() => changeAppViewMode('landing')}
            onUpdateUser={handleUpdateCurrentUser}
          />
        );

      default:
        return (
          <DashboardHome
            currentUser={currentUser}
            permohonanList={permohonanList}
            onSelectPermohonan={handleOpenPermohonan}
            onNavigateToTab={(tab) => handleSelectTab(tab)}
            onOpenNewModal={() => handleSelectTab('pengajuan_baru')}
          />
        );
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setPermohonanList([]);
    setRegistrations([]);
    changeAppViewMode('login');
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
          navigateToDashboard(`/detail/${id}`);
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
        currentUser={currentUser}
        onUpdatePermohonan={handleUpdatePermohonan}
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
          navigateToDashboard(`/detail/${id}`);
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
          tokenStorage.setUser(user);
          fetchBackendData();
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
        onLogout={handleLogout}
        onGoToLanding={() => changeAppViewMode('landing')}
        onGoToLogin={() => changeAppViewMode('login')}
        selectedPermohonan={activeDetailPermohonan}
        isPengajuanBaru={currentTab === 'pengajuan_baru'}
        onBackFromDetail={() => {
          if (currentTab === 'pengajuan_baru') {
            handleSelectTab('beranda');
            return;
          }
          if (selectedPermohonanId) {
            setSelectedPermohonanId(null);
            navigateToDashboard(`/${currentTab}`);
          }
          if (selectedAsesmenId) {
            setSelectedAsesmenId(null);
            navigateToDashboard('/asesmen_aktif');
          }
          if (selectedHukumId) {
            setSelectedHukumId(null);
            navigateToDashboard('/hukum');
          }
          if (selectedMedisId) {
            setSelectedMedisId(null);
            navigateToDashboard('/medis');
          }
          if (selectedRiwayatMedisId) {
            setSelectedRiwayatMedisId(null);
            navigateToDashboard('/riwayat_medis');
          }
          if (selectedRiwayatHukumId) {
            setSelectedRiwayatHukumId(null);
            navigateToDashboard('/riwayat_hukum');
          }
          if (selectedTindakLanjutId) {
            setSelectedTindakLanjutId(null);
            navigateToDashboard('/tindak_lanjut');
          }
          if (selectedScheduleCaseId) {
            setSelectedScheduleCaseId(null);
            setSelectedScheduleId(null);
            navigateToDashboard('/tindak_lanjut_jadwal');
          }
          if (selectedRegistrasiId) {
            setSelectedRegistrasiId(null);
            navigateToDashboard('/verifikasi_akun');
          }
        }}
        onOpenQrModal={(item) => setQrModalPermohonan(item)}
      />

      {/* Main Workspace Layout - Desktop: Sidebar hidden when viewing detail page or pengajuan_baru */}
      <div className="flex-1 flex w-full bg-[#071326]">
        {/* Sidebar at desktop corner (Hidden on permohonan detail view and pengajuan_baru) */}
        {!activeDetailPermohonan && !selectedPermohonan && currentTab !== 'pengajuan_baru' && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            userRole={currentUser.role}
            currentUser={currentUser}
            users={users}
            onSelectUser={handleSelectUser}
            onOpenNewModal={() => handleSelectTab('pengajuan_baru')}
            badgeCounts={badgeCounts}
            isMobileOpen={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
            onLogout={handleLogout}
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
          onOpenNewModal={() => handleSelectTab('pengajuan_baru')}
          badgeCounts={badgeCounts}
        />
      )}

      {/* Modal: Verifikasi QR Publik */}
      <ModalVerifikasiQR
        permohonan={qrModalPermohonan}
        onClose={() => setQrModalPermohonan(null)}
      />
    </div>
  );
}
