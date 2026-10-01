import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export interface CapturedWatermarkPhoto {
  uri: string;
  latitude: number;
  longitude: number;
  locationName: string;
  capturedAt: Date;
}

export interface WatermarkOptions {
  uri: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  capturedAt?: Date;
  companyTag?: string;
  captureNativeView?: (options: WatermarkOptions) => Promise<string>;
}

export const getCurrentGPSLocation = async (fallback?: {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}): Promise<{ latitude: number; longitude: number; locationName: string }> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        latitude: fallback?.latitude ?? 1.3521,
        longitude: fallback?.longitude ?? 103.8198,
        locationName: fallback?.locationName ?? 'Lokasi GPS (Default)',
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    let locationName = fallback?.locationName || '';

    try {
      const places = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (places && places.length > 0) {
        const place = places[0];
        const parts = [
          place.name || place.street,
          place.subregion || place.city || place.district,
          place.region,
        ].filter(Boolean);

        if (parts.length > 0) {
          locationName = parts.join(', ');
        }
      }
    } catch {
      // Reverse geocoding optional, jika gagal tetap gunakan koordinat
    }

    if (!locationName) {
      locationName = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
    }

    return {
      latitude: lat,
      longitude: lng,
      locationName,
    };
  } catch {
    return {
      latitude: fallback?.latitude ?? 1.3521,
      longitude: fallback?.longitude ?? 103.8198,
      locationName: fallback?.locationName ?? 'Lokasi GPS',
    };
  }
};


export const formatWatermarkDateTime = (date: Date): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} WIB`;
};

/**
 * Membakar (burn-in) teks koordinat dan timestamp langsung ke gambar menggunakan HTML5 Canvas di Web / Data URL
 */
export const applyWatermarkToImage = async (
  options: WatermarkOptions
): Promise<string> => {
  const {
    uri,
    latitude,
    longitude,
    locationName = '',
    capturedAt = new Date(),
    companyTag = 'PT SAMASI • SALES TRACKER',
    captureNativeView,
  } = options;

  // Jika di lingkungan Web / Browser, gunakan HTML5 Canvas untuk watermarking permanen
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      
      // JANGAN set crossOrigin untuk blob: atau data: URL karena menyebabkan CORS security error di browser
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || img.width || 800;
          const height = img.naturalHeight || img.height || 600;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn('[Watermark] 2D canvas context tidak tersedia');
            resolve(uri);
            return;
          }

          // 1. Gambar foto utama
          ctx.drawImage(img, 0, 0, width, height);

          // 2. Skala ukuran font & layout dinamis mengikuti resolusi gambar
          const baseDim = Math.min(width, height);
          const scale = Math.max(1, baseDim / 650);

          const padding = Math.round(14 * scale);
          const cardHeight = Math.round(115 * scale);
          const cardWidth = width - padding * 2;
          const cardX = padding;
          const cardY = height - cardHeight - padding;
          const borderRadius = Math.round(12 * scale);

          // 3. Gambar background card gelap semi-transparan
          ctx.save();
          ctx.fillStyle = 'rgba(10, 22, 40, 0.88)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, borderRadius);
          } else {
            ctx.rect(cardX, cardY, cardWidth, cardHeight);
          }
          ctx.fill();

          // 4. Accent garis samping hijau (Verified GPS)
          ctx.fillStyle = '#16A34A';
          ctx.fillRect(cardX, cardY, Math.round(6 * scale), cardHeight);

          // 5. Teks informasi watermark
          const textStartX = cardX + Math.round(16 * scale);
          let currentY = cardY + Math.round(24 * scale);

          // Baris 1: Header / Tag Perusahaan + GPS Verified
          const tagFontSize = Math.max(12, Math.round(13 * scale));
          ctx.font = `bold ${tagFontSize}px sans-serif`;
          ctx.fillStyle = '#60A5FA'; // Biru muda
          ctx.fillText(companyTag.toUpperCase(), textStartX, currentY);

          // Baris 2: Titik Koordinat (Latitude, Longitude)
          currentY += Math.round(24 * scale);
          const coordFontSize = Math.max(13, Math.round(15 * scale));
          ctx.font = `bold ${coordFontSize}px monospace, sans-serif`;
          ctx.fillStyle = '#FFFFFF';
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lngDir = longitude >= 0 ? 'E' : 'W';
          const coordText = `📍 ${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lngDir}`;
          ctx.fillText(coordText, textStartX, currentY);

          // Baris 3: Nama Lokasi (jika ada)
          if (locationName) {
            currentY += Math.round(21 * scale);
            const locFontSize = Math.max(11, Math.round(13 * scale));
            ctx.font = `500 ${locFontSize}px sans-serif`;
            ctx.fillStyle = '#E2E8F0';
            const displayLoc =
              locationName.length > 55
                ? locationName.substring(0, 52) + '...'
                : locationName;
            ctx.fillText(`🏢 ${displayLoc}`, textStartX, currentY);
          }

          // Baris 4: Waktu Pengambilan (Timestamp)
          currentY += Math.round(21 * scale);
          const timeFontSize = Math.max(11, Math.round(12 * scale));
          ctx.font = `500 ${timeFontSize}px monospace, sans-serif`;
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(`🕒 ${formatWatermarkDateTime(capturedAt)}`, textStartX, currentY);

          ctx.restore();

          // Ekspor ke data URL JPEG kualitas tinggi
          const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve(watermarkedDataUrl);
        } catch (err) {
          console.error('[Watermark] Error saat menggambar watermark:', err);
          resolve(uri);
        }
      };

      img.onerror = (e) => {
        console.error('[Watermark] Gagal me-load gambar untuk watermark:', e);
        resolve(uri);
      };

      img.src = uri;
    });
  }

  if (captureNativeView) {
    return captureNativeView({
      uri,
      latitude,
      longitude,
      locationName,
      capturedAt,
      companyTag,
    });
  }

  // Fallback jika caller native tidak menyediakan view capture.
  return uri;
};

/**
 * Menjalankan alur lengkap: Buka Kamera Depan (Selfie) -> Ambil GPS -> Beri Watermark
 */
export const takeSelfieWithWatermark = async (fallbackCoords?: {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}, captureNativeView?: WatermarkOptions['captureNativeView']): Promise<CapturedWatermarkPhoto | null> => {
  // 1. Minta izin akses kamera
  const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
  if (!cameraPerm.granted) {
    throw new Error('Akses kamera diperlukan untuk mengambil foto selfie.');
  }

  // 2. Luncurkan kamera dengan kamera depan (Selfie)
  const result = await ImagePicker.launchCameraAsync({
    cameraType: ImagePicker.CameraType.front,
    allowsEditing: false,
    quality: 0.85,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const rawUri = result.assets[0].uri;
  const captureTime = new Date();

  // 3. Ambil koordinat GPS saat foto diambil
  const gpsLocation = await getCurrentGPSLocation(fallbackCoords);

  // 4. Bubuhkan watermark koordinat dan waktu ke gambar
  const watermarkedUri = await applyWatermarkToImage({
    uri: rawUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
    captureNativeView,
  });

  return {
    uri: watermarkedUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
  };
};

/**
 * Memilih foto dari Galeri dan membubuhkan watermark GPS & Waktu
 */
export const pickImageFromGalleryWithWatermark = async (fallbackCoords?: {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}, captureNativeView?: WatermarkOptions['captureNativeView']): Promise<CapturedWatermarkPhoto | null> => {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Akses galeri foto diperlukan untuk memilih gambar.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.85,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const rawUri = result.assets[0].uri;
  const captureTime = new Date();
  const gpsLocation = await getCurrentGPSLocation(fallbackCoords);

  const watermarkedUri = await applyWatermarkToImage({
    uri: rawUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
    captureNativeView,
  });

  return {
    uri: watermarkedUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
  };
};

