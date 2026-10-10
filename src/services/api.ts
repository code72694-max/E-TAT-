import { PermohonanAsesmen, RegistrasiPengguna, UserProfile, UserRole, PrasyaratPemeriksaan } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: string[];
}

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

// Token & Session Storage Management
const TOKEN_KEY = 'etat_access_token';
const REFRESH_TOKEN_KEY = 'etat_refresh_token';
const USER_KEY = 'etat_current_user';

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getUser: (): UserProfile | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: UserProfile) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Generic HTTP fetch wrapper
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = tokenStorage.getAccessToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Koneksi ke server gagal. Pastikan backend aktif.', 503);
  }
}

// =====================================================================
// AUTHENTICATION API
// =====================================================================
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await request<{
      user: { id: string; email: string; role: UserRole; name: string };
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.data) {
      tokenStorage.setAccessToken(res.data.accessToken);
      tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res;
  },

  getMe: async () => {
    const res = await request<UserProfile>('/auth/me');
    if (res.data) {
      tokenStorage.setUser(res.data);
    }
    return res;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors during logout
    } finally {
      tokenStorage.clear();
    }
  },

  getAllUsers: async (role?: string) => {
    const qs = role ? `?role=${role}` : '';
    return request<UserProfile[]>(`/auth/users${qs}`);
  },

  createUser: async (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    nip?: string;
    agency?: string;
    position?: string;
    phone?: string;
  }) => {
    return request<UserProfile>('/auth/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// =====================================================================
// PERMOHONAN ASESMEN API
// =====================================================================
export const permohonanApi = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<PermohonanAsesmen[]>(`/permohonan${qs}`);
  },

  getById: async (id: string) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}`);
  },

  create: async (payload: {
    satuanKerjaTujuan?: string;
    jenisPengajuan?: string;
    metodePelaksanaan?: string;
    terperiksa: any;
    perkara: any;
    dokumenList?: any[];
  }) => {
    return request<PermohonanAsesmen>('/permohonan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  submit: async (id: string) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}/submit`, {
      method: 'POST',
    });
  },

  verifikasi: async (id: string, payload?: any) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}/verifikasi`, {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  },

  mintaPerbaikan: async (id: string, catatanKoreksi: string) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}/minta-perbaikan`, {
      method: 'POST',
      body: JSON.stringify({ catatanKoreksi }),
    });
  },

  disposisi: async (id: string, payload: {
    disposisiHasil: string;
    disposisiAlasan?: string;
    disposisiKetua?: string;
    disposisiJabatan?: string;
    disposisiBuktiUrl?: string;
  }) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}/disposisi`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  tugaskan: async (id: string, payload: {
    asesorMedisId?: string;
    asesorHukumId?: string;
    jadwalPemeriksaanMedis?: string;
    jadwalPemeriksaanHukum?: string;
    lokasiPemeriksaan?: string;
    jadwalPleno?: string;
  }) => {
    return request<PermohonanAsesmen>(`/permohonan/${id}/tugaskan`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  lacak: async (trackingNumber: string) => {
    return request<any>(`/permohonan/lacak/${encodeURIComponent(trackingNumber)}`);
  },
};

// =====================================================================
// REGISTRASI PENGGUNA (SATWIL) API
// =====================================================================
export const registrasiApi = {
  getAll: async () => {
    return request<RegistrasiPengguna[]>('/registrasi');
  },

  getById: async (id: string) => {
    return request<RegistrasiPengguna>(`/registrasi/${id}`);
  },

  submit: async (payload: any) => {
    return request<RegistrasiPengguna>('/registrasi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  approve: async (id: string, catatanAdmin?: string) => {
    return request<RegistrasiPengguna>(`/registrasi/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ catatanAdmin: catatanAdmin || 'Disetujui oleh Administrator TAT' }),
    });
  },

  reject: async (id: string, catatanAdmin: string) => {
    return request<RegistrasiPengguna>(`/registrasi/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ catatanAdmin }),
    });
  },
};

// =====================================================================
// ASESMEN MEDIS API
// =====================================================================
export const asesmenMedisApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any>(`/asesmen-medis/${permohonanId}`);
  },

  saveDraft: async (permohonanId: string, payload: any) => {
    return request<any>(`/asesmen-medis/${permohonanId}/draft`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  finalisasi: async (permohonanId: string, payload?: any) => {
    return request<any>(`/asesmen-medis/${permohonanId}/finalisasi`, {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  },

  amandemen: async (permohonanId: string, payload: { note: string }) => {
    return request<any>(`/asesmen-medis/${permohonanId}/amandemen`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  saveKriteriaPlasemen: async (permohonanId: string, payload: any) => {
    return request<any>(`/asesmen-medis/${permohonanId}/kriteria-penempatan`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// =====================================================================
// ASESMEN HUKUM API
// =====================================================================
export const asesmenHukumApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any>(`/asesmen-hukum/${permohonanId}`);
  },

  saveDraft: async (permohonanId: string, payload: any) => {
    return request<any>(`/asesmen-hukum/${permohonanId}/draft`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  finalisasi: async (permohonanId: string, payload?: any) => {
    return request<any>(`/asesmen-hukum/${permohonanId}/finalisasi`, {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  },

  amandemen: async (permohonanId: string, payload: { note: string }) => {
    return request<any>(`/asesmen-hukum/${permohonanId}/amandemen`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// =====================================================================
// SIDANG PLENO TAT API
// =====================================================================
export const sidangPlenoApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any>(`/sidang-pleno/${permohonanId}`);
  },

  jadwalkan: async (permohonanId: string, payload: any) => {
    return request<any>(`/sidang-pleno/${permohonanId}/jadwal`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  simpanHasil: async (permohonanId: string, payload: any) => {
    return request<any>(`/sidang-pleno/${permohonanId}/hasil`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  uploadBeritaAcara: async (permohonanId: string, formData: FormData) => {
    return request<any>(`/sidang-pleno/${permohonanId}/upload-ba`, {
      method: 'POST',
      body: formData,
    });
  },
};

// =====================================================================
// REKOMENDASI RESMI API
// =====================================================================
export const rekomendasiApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any>(`/rekomendasi/${permohonanId}`);
  },

  createDraft: async (permohonanId: string, payload: any) => {
    return request<any>(`/rekomendasi/${permohonanId}/draft`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  prosesTandaTangan: async (permohonanId: string, payload?: any) => {
    return request<any>(`/rekomendasi/${permohonanId}/tanda-tangan`, {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
  },

  konfirmasiTandaTerima: async (permohonanId: string, payload: {
    diterimaOleh: string;
    nomorTandaTerima?: string;
  }) => {
    return request<any>(`/rekomendasi/${permohonanId}/tanda-terima`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  verifikasiQr: async (qrCode: string) => {
    return request<any>(`/rekomendasi/verifikasi/${encodeURIComponent(qrCode)}`);
  },
};

// =====================================================================
// TINDAK LANJUT & MONITORING API
// =====================================================================
export const tindakLanjutApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any>(`/tindak-lanjut/${permohonanId}`);
  },

  save: async (permohonanId: string, payload: any) => {
    return request<any>(`/tindak-lanjut/${permohonanId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePelaksanaan: async (permohonanId: string, payload: any) => {
    return request<any>(`/tindak-lanjut/${permohonanId}/pelaksanaan`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addLaporanKontrol: async (permohonanId: string, formData: FormData) => {
    return request<any>(`/tindak-lanjut/${permohonanId}/laporan-kontrol`, {
      method: 'POST',
      body: formData,
    });
  },
};

// =====================================================================
// KLARIFIKASI API
// =====================================================================
export const klarifikasiApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<any[]>(`/klarifikasi/${permohonanId}`);
  },

  create: async (permohonanId: string, payload: {
    judul: string;
    pertanyaan: string;
    targetRole?: string;
  }) => {
    return request<any>(`/klarifikasi/${permohonanId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  jawab: async (id: string, jawaban: string) => {
    return request<any>(`/klarifikasi/${id}/jawab`, {
      method: 'PUT',
      body: JSON.stringify({ jawaban }),
    });
  },
};

// =====================================================================
// DASHBOARD & ANALYTICS API
// =====================================================================
export const dashboardApi = {
  getSummary: async () => {
    return request<any>('/dashboard/summary');
  },

  getAnalytics: async () => {
    return request<any>('/dashboard/analytics');
  },
};

// =====================================================================
// PRASYARAT PEMERIKSAAN API
// =====================================================================
export const prasyaratApi = {
  getByPermohonan: async (permohonanId: string) => {
    return request<{ permohonan: any; prasyarat: PrasyaratPemeriksaan | null }>(`/prasyarat-pemeriksaan/${permohonanId}`);
  },

  save: async (permohonanId: string, payload: Partial<PrasyaratPemeriksaan>) => {
    return request<PrasyaratPemeriksaan>(`/prasyarat-pemeriksaan/${permohonanId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
