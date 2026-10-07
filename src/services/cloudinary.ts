import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'hsvutda8';

// Initialize Cloudinary instance for frontend URL transformations & optimizations
export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

/**
 * Generate an optimized Cloudinary image object with auto-format and auto-quality
 */
export const getOptimizedImage = (publicId: string, width?: number, height?: number) => {
  let img = cld.image(publicId).format('auto').quality('auto');
  if (width && height) {
    img = img.resize(auto().gravity(autoGravity()).width(width).height(height));
  }
  return img;
};

export interface UploadResponse {
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

/**
 * Upload a File, Blob, or base64 string to Cloudinary via backend API endpoint
 */
export const uploadToCloudinary = async (
  fileOrBase64: File | Blob | string,
  folder: string = 'dokumen'
): Promise<UploadResponse> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

  if (typeof fileOrBase64 === 'string') {
    // Base64 JSON upload
    const res = await fetch(`${baseUrl}/upload/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: fileOrBase64, folder }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengunggah foto ke Cloudinary.');
    }
    return json.data;
  } else {
    // Multipart FormData upload
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    formData.append('folder', folder);

    const res = await fetch(`${baseUrl}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengunggah berkas ke Cloudinary.');
    }
    return json.data;
  }
};
