import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export interface CapturedWatermarkPhoto {
  uri: string;
  latitude: number;
  longitude: number;
  locationName: string;
  capturedAt: Date;
  accuracy: number | null;
  isMocked: boolean;
}

export interface WatermarkOptions {
  uri: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  capturedAt?: Date;
  companyTag?: string;
  accuracy?: number | null;
  isMocked?: boolean;
  captureNativeView?: (options: WatermarkOptions) => Promise<string>;
}

export type WatermarkLocationStatusType = 'verified' | 'mocked' | 'unverified';

export interface WatermarkLocationStatus {
  status: WatermarkLocationStatusType;
  label: string;
  color: string;
  background: string;
  accent: string;
}

export const getWatermarkLocationStatus = (
  isMocked?: boolean,
  accuracy?: number | null
): WatermarkLocationStatus => {
  if (isMocked) {
    return {
      status: 'mocked',
      label: '⚠ FAKE GPS TERDETEKSI',
      color: '#FFFFFF',
      background: '#DC2626',
      accent: '#DC2626',
    };
  }

  if (accuracy === null || accuracy === undefined) {
    return {
      status: 'unverified',
      label: 'GPS TIDAK TERVERIFIKASI',
      color: '#1F2937',
      background: '#F59E0B',
      accent: '#F59E0B',
    };
  }

  return {
    status: 'verified',
    label: `✓ GPS ASLI ±${Math.round(accuracy)} m`,
    color: '#FFFFFF',
    background: '#16A34A',
    accent: '#16A34A',
  };
};

export interface GPSLocationResult {
  latitude: number;
  longitude: number;
  locationName: string;
  accuracy: number | null;
  isMocked: boolean;
}

export const getCurrentGPSLocation = async (fallback?: {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}): Promise<GPSLocationResult> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        latitude: fallback?.latitude ?? 1.3521,
        longitude: fallback?.longitude ?? 103.8198,
        locationName: fallback?.locationName ?? 'Lokasi GPS (Default)',
        accuracy: null,
        isMocked: false,
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    console.log(`[GPS] Raw location object:`, JSON.stringify(location));

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    const accuracy = location.coords.accuracy ?? null;
    const isMocked = (location as any).mocked === true;

    const locationName = await reverseGeocodeCoordinates(lat, lng, fallback?.locationName);

    return {
      latitude: lat,
      longitude: lng,
      locationName,
      accuracy,
      isMocked,
    };
  } catch {
    return {
      latitude: fallback?.latitude ?? 1.3521,
      longitude: fallback?.longitude ?? 103.8198,
      locationName: fallback?.locationName ?? 'Lokasi GPS',
      accuracy: null,
      isMocked: false,
    };
  }
};

export interface EntryLocationResult extends GPSLocationResult {
  capturedAt: Date;
  geocodedAt: Date;
}

/**
 * Mengambil lokasi GPS untuk entri diary (di-capture manual, terpisah dari lokasi foto).
 * Berbeda dengan getCurrentGPSLocation, fungsi ini melempar error alih-alih memakai
 * koordinat fallback, karena lokasi entri dipakai untuk verifikasi.
 */
export const captureEntryLocation = async (): Promise<EntryLocationResult> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Izin lokasi diperlukan untuk mengambil lokasi entri.');
  }

  let location: Location.LocationObject;
  try {
    location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    throw new Error('Lokasi tidak tersedia. Pastikan GPS/layanan lokasi aktif lalu coba lagi.');
  }

  const capturedAt = new Date();
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;
  const locationName = await reverseGeocodeCoordinates(latitude, longitude);

  return {
    latitude,
    longitude,
    locationName,
    accuracy: location.coords.accuracy ?? null,
    isMocked: location.mocked === true,
    capturedAt,
    geocodedAt: new Date(),
  };
};

/**
 * Melakukan reverse geocoding dari koordinat (latitude, longitude) yang sudah dimiliki.
 * Berguna saat koordinat sudah tersedia (mis. dari foto yang sudah diambil) dan hanya
 * perlu mendapatkan nama lokasi tanpa perlu mengambil posisi GPS baru.
 *
 * @param latitude  - Nilai latitude
 * @param longitude - Nilai longitude
 * @param fallbackName - Nama lokasi fallback jika reverse geocoding gagal
 * @returns Nama lokasi hasil reverse geocoding, atau koordinat sebagai string jika gagal
 */
export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number,
  fallbackName?: string
): Promise<string> => {
  try {
    console.log(`[Geocoding] Starting reverse geocode for lat: ${latitude}, lng: ${longitude}`);
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    console.log(`[Geocoding] Result from reverseGeocodeAsync:`, JSON.stringify(places));

    if (places && places.length > 0) {
      const place = places[0];
      const parts = [
        place.name || place.street,
        place.subregion || place.city || place.district,
        place.region,
      ].filter(Boolean) as string[];

      if (parts.length > 0) {
        const resolvedName = parts.join(', ');
        console.log(`[Geocoding] Resolved location name:`, resolvedName);
        return resolvedName;
      } else {
        console.log(`[Geocoding] places array is valid but parts are empty. Place obj:`, JSON.stringify(place));
      }
    } else {
      console.log(`[Geocoding] places array is empty or null`);
    }
  } catch (error: any) {
    console.log(`[Geocoding] Error during reverseGeocodeAsync:`, error.message || error);
    // Reverse geocoding optional, tetap lanjutkan dengan fallback
  }

  const finalName = fallbackName || `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
  console.log(`[Geocoding] Returning fallback location name:`, finalName);
  return finalName;
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
    accuracy = null,
    isMocked = false,
    captureNativeView,
  } = options;
  const locationStatus = getWatermarkLocationStatus(isMocked, accuracy);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
 
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

          ctx.drawImage(img, 0, 0, width, height);

          const baseDim = Math.min(width, height);
          const scale = Math.max(1, baseDim / 650);

          const padding = Math.round(14 * scale);
          const cardHeight = Math.round(180 * scale);
          const cardWidth = width - padding * 2;
          const cardX = padding;
          const cardY = height - cardHeight - padding;

          // Latar tipis hanya di area kartu agar teks terbaca, foto tetap terang
          ctx.save();
          ctx.fillStyle = 'rgba(10, 22, 40, 0.45)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, Math.round(12 * scale));
          } else {
            ctx.rect(cardX, cardY, cardWidth, cardHeight);
          }
          ctx.fill();

          ctx.fillStyle = locationStatus.accent;
          ctx.fillRect(cardX, cardY, Math.round(6 * scale), cardHeight);

          // Badge status lokasi (Asli / Fake GPS / Tidak Terverifikasi) di pojok kanan atas kartu
          const badgeFontSize = Math.max(16, Math.round(17 * scale));
          ctx.font = `bold ${badgeFontSize}px sans-serif`;
          const badgePadX = Math.round(10 * scale);
          const badgeHeight = badgeFontSize + Math.round(12 * scale);
          const badgeWidth = ctx.measureText(locationStatus.label).width + badgePadX * 2;
          const badgeX = cardX + cardWidth - badgeWidth - Math.round(14 * scale);
          const badgeY = cardY + Math.round(14 * scale);
          ctx.fillStyle = locationStatus.background;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, Math.round(8 * scale));
          } else {
            ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
          }
          ctx.fill();
          ctx.fillStyle = locationStatus.color;
          ctx.textBaseline = 'middle';
          ctx.fillText(locationStatus.label, badgeX + badgePadX, badgeY + badgeHeight / 2);
          ctx.textBaseline = 'alphabetic';

          const textStartX = cardX + Math.round(16 * scale);
          let currentY = cardY + Math.round(36 * scale);

          // Bayangan teks agar tetap terbaca di atas foto terang
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = Math.round(4 * scale);
          ctx.shadowOffsetX = Math.round(1 * scale);
          ctx.shadowOffsetY = Math.round(1 * scale);

          // Baris 1: Header / Tag Perusahaan + GPS Verified
          const tagFontSize = Math.max(20, Math.round(21 * scale));
          ctx.font = `bold ${tagFontSize}px sans-serif`;
          ctx.fillStyle = '#60A5FA'; // Biru muda
          ctx.fillText(companyTag.toUpperCase(), textStartX, currentY);

          // Baris 2: Titik Koordinat (Latitude, Longitude)
          currentY += Math.round(32 * scale);
          const coordFontSize = Math.max(23, Math.round(25 * scale));
          ctx.font = `bold ${coordFontSize}px monospace, sans-serif`;
          ctx.fillStyle = '#FFFFFF';
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lngDir = longitude >= 0 ? 'E' : 'W';
          const coordText = `📍 ${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lngDir}`;
          ctx.fillText(coordText, textStartX, currentY);

          // Baris 3: Nama Lokasi (jika ada)
          if (locationName) {
            currentY += Math.round(30 * scale);
            const locFontSize = Math.max(18, Math.round(20 * scale));
            ctx.font = `500 ${locFontSize}px sans-serif`;
            ctx.fillStyle = '#E2E8F0';
            const displayLoc =
              locationName.length > 55
                ? locationName.substring(0, 52) + '...'
                : locationName;
            ctx.fillText(`🏢 ${displayLoc}`, textStartX, currentY);
          }

          // Baris 4: Waktu Pengambilan (Timestamp)
          currentY += Math.round(30 * scale);
          const timeFontSize = Math.max(18, Math.round(19 * scale));
          ctx.font = `500 ${timeFontSize}px monospace, sans-serif`;
          ctx.fillStyle = '#F1F5F9';
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
      accuracy,
      isMocked,
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
    accuracy: gpsLocation.accuracy,
    isMocked: gpsLocation.isMocked,
    captureNativeView,
  });

  return {
    uri: watermarkedUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
    accuracy: gpsLocation.accuracy,
    isMocked: gpsLocation.isMocked,
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
    accuracy: gpsLocation.accuracy,
    isMocked: gpsLocation.isMocked,
    captureNativeView,
  });

  return {
    uri: watermarkedUri,
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    locationName: gpsLocation.locationName,
    capturedAt: captureTime,
    accuracy: gpsLocation.accuracy,
    isMocked: gpsLocation.isMocked,
  };
};

