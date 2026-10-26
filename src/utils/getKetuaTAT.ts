import { UserProfile, PermohonanAsesmen } from '../types';

export interface KetuaTATInfo {
  nama: string;
  nrp: string;
  pangkat: string;
  jabatan: string;
}

export const cleanStr = (s?: string) =>
  s ? s.replace(/\[TEST\]\s*/gi, '').replace(/\(Akun Uji\)/gi, '').trim() : '';

/**
 * Resolves Ketua Tim TAT data for document signatures dynamically.
 * Priority:
 * 1. Admin's configured namaKetuaTAT (set from Admin Profile)
 * 2. Saved custom users in localStorage (if another role is viewing but admin set it)
 * 3. Permohonan's sidangPleno.pimpinanPleno
 * 4. Permohonan's timAsesmen.disposisiKetua
 * 5. Logged-in Admin user profile (if role is Admin)
 * 6. Standard official fallback
 */
export const getKetuaTAT = (
  currentUser?: UserProfile | null,
  permohonan?: PermohonanAsesmen | null
): KetuaTATInfo => {
  // 1. Cek dari currentUser jika ada namaKetuaTAT yang diatur Admin
  if (currentUser?.namaKetuaTAT && currentUser.namaKetuaTAT.trim()) {
    return {
      nama: cleanStr(currentUser.namaKetuaTAT),
      nrp: currentUser.nipKetuaTAT || '79080512',
      pangkat: currentUser.pangkatKetuaTAT || 'Komisaris Polisi (Kompol)',
      jabatan: currentUser.jabatanKetuaTAT || 'Ketua Tim TAT Kaltim'
    };
  }

  // Cek localStorage jika user yang sedang login bukan admin, tapi admin pernah menyimpan setting ketua
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const customUsers = localStorage.getItem('etat_custom_users');
      if (customUsers) {
        const parsed = JSON.parse(customUsers);
        const adminUser = parsed.find(
          (u: any) => u.role?.toUpperCase() === 'ADMIN' || u.id === 'user-admin'
        );
        if (adminUser?.namaKetuaTAT?.trim()) {
          return {
            nama: cleanStr(adminUser.namaKetuaTAT),
            nrp: adminUser.nipKetuaTAT || '79080512',
            pangkat: adminUser.pangkatKetuaTAT || 'Komisaris Polisi (Kompol)',
            jabatan: adminUser.jabatanKetuaTAT || 'Ketua Tim TAT Kaltim'
          };
        }
      }
    }
  } catch {}

  // 2. Cek dari Sidang Pleno di permohonan
  if (permohonan?.sidangPleno?.pimpinanPleno && permohonan.sidangPleno.pimpinanPleno.trim()) {
    return {
      nama: cleanStr(permohonan.sidangPleno.pimpinanPleno),
      nrp: (permohonan.sidangPleno as any)?.nrpPimpinan || '79080512',
      pangkat: 'Komisaris Polisi (Kompol)',
      jabatan: 'Ketua Tim Asesmen Terpadu'
    };
  }

  // 3. Cek dari Disposisi Ketua
  const disposisiKetua = (permohonan?.timAsesmen as any)?.disposisiKetua;
  if (disposisiKetua && typeof disposisiKetua === 'string' && disposisiKetua.trim()) {
    return {
      nama: cleanStr(disposisiKetua),
      nrp: '79080512',
      pangkat: 'Komisaris Polisi (Kompol)',
      jabatan: 'Ketua Tim Asesmen Terpadu'
    };
  }

  // 4. Jika yang login adalah Admin, gunakan nama profil Admin
  if (
    currentUser &&
    (currentUser.role?.toUpperCase() === 'ADMIN' ||
      currentUser.role?.toLowerCase() === 'sekretariat')
  ) {
    return {
      nama: cleanStr(currentUser.name),
      nrp: currentUser.nip || '79080512',
      pangkat: currentUser.pangkat || 'Komisaris Polisi (Kompol)',
      jabatan: currentUser.position || 'Ketua Tim Asesmen Terpadu'
    };
  }

  // 5. Default nama ketua resmi kedinasan
  return {
    nama: 'Kompol Hendra Kusuma, S.I.K., M.Si.',
    nrp: '79080512',
    pangkat: 'Komisaris Polisi (Kompol)',
    jabatan: 'Ketua Tim TAT Kaltim'
  };
};
