import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Colors, Layout } from '@shared/constants';
import { Dropdown } from '@shared/components';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCustomers, customerService, CustomerContactSummaryItem } from '@modules/customers';
import { useDiaryTypes } from '../hooks';
import {
  takeSelfieWithWatermark,
  pickImageFromGalleryWithWatermark,
  formatWatermarkDateTime,
} from '../utils';

export interface DiaryFormData {
  title: string;
  customer_id: string;
  customer_contact_id: string;
  interaction_type: string;
  interaction_type_id?: string;
  notes: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  photos: string[];
}

export interface DiaryFormProps {
  formData: DiaryFormData;
  setFormData: React.Dispatch<React.SetStateAction<DiaryFormData>>;
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmit?: () => void;
  isSaving?: boolean;
}

interface NativeWatermarkRequest {
  uri: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  capturedAt?: Date;
  companyTag?: string;
}

interface InteractionChip {
  id: string;
  label: string;
  iconType: 'feather' | 'ionicons';
  icon: string;
  color: string;
}

const INTERACTION_CHIPS_ROW_1: InteractionChip[] = [
  { id: 'VISIT', label: 'Visit', iconType: 'ionicons', icon: 'business-outline', color: '#2563EB' },
  { id: 'CALL', label: 'Call', iconType: 'feather', icon: 'phone-call', color: '#EF4444' },
  { id: 'CHAT', label: 'Chat', iconType: 'ionicons', icon: 'chatbubble-ellipses-outline', color: '#8B5CF6' },
  { id: 'EMAIL', label: 'Email', iconType: 'feather', icon: 'mail', color: '#3B82F6' },
];

const INTERACTION_CHIPS_ROW_2: InteractionChip[] = [
  { id: 'OTHER', label: 'Other', iconType: 'feather', icon: 'clipboard', color: '#F59E0B' },
];

export const DiaryForm: React.FC<DiaryFormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  isSaving = false,
}) => {
  const { formattedDiaryTypes } = useDiaryTypes();
  const { formattedCustomers, isLoading: isLoadingCustomers } = useCustomers({ autoFetch: true });

  const [contacts, setContacts] = useState<CustomerContactSummaryItem[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [previewPhotoUri, setPreviewPhotoUri] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const watermarkViewRef = useRef<View>(null);
  const watermarkResolverRef = useRef<{
    resolve: (uri: string) => void;
    reject: (error: unknown) => void;
  } | null>(null);
  const [nativeWatermarkRequest, setNativeWatermarkRequest] =
    useState<NativeWatermarkRequest | null>(null);
  const [watermarkImageSize, setWatermarkImageSize] = useState({
    width: 800,
    height: 600,
  });
  const [watermarkImageReady, setWatermarkImageReady] = useState(false);

  const captureNativeWatermark = (options: NativeWatermarkRequest): Promise<string> => {
    if (Platform.OS === 'web') {
      return Promise.resolve(options.uri);
    }

    return new Promise((resolve, reject) => {
      watermarkResolverRef.current = { resolve, reject };
      setWatermarkImageReady(false);
      setNativeWatermarkRequest(options);
    });
  };

  useEffect(() => {
    if (!nativeWatermarkRequest || !watermarkImageReady || !watermarkViewRef.current) {
      return;
    }

    const capture = async () => {
      try {
        const uri = await captureRef(watermarkViewRef, {
          format: 'jpg',
          quality: 0.92,
          result: 'tmpfile',
        });
        watermarkResolverRef.current?.resolve(uri);
      } catch (error) {
        watermarkResolverRef.current?.reject(error);
      } finally {
        watermarkResolverRef.current = null;
        setNativeWatermarkRequest(null);
        setWatermarkImageReady(false);
      }
    };

    capture();
  }, [nativeWatermarkRequest, watermarkImageReady]);

  useEffect(() => {
    if (!formData.customer_id) {
      setContacts([]);
      return;
    }

    let isMounted = true;
    const loadCustomerContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const data = await customerService.getCustomerContact(formData.customer_id);
        if (isMounted) {
          setContacts(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setContacts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingContacts(false);
        }
      }
    };

    loadCustomerContacts();
    return () => {
      isMounted = false;
    };
  }, [formData.customer_id]);

  const customerOptions = useMemo(() => {
    return formattedCustomers.map((cust) => ({
      label: cust.name,
      value: String(cust.id),
    }));
  }, [formattedCustomers]);

  const contactOptions = useMemo(() => {
    if (!formData.customer_id || contacts.length === 0) {
      return [];
    }
    return contacts.map((contact) => ({
      label: contact.job_title
        ? `${contact.contact_name} — ${contact.job_title}`
        : contact.contact_name,
      value: String(contact.customer_contact_id),
    }));
  }, [formData.customer_id, contacts]);

  const handleSelectCustomer = (val: string | number) => {
    const customerId = String(val);
    setFormData((prev) => ({
      ...prev,
      customer_id: customerId,
      customer_contact_id: '', // Reset kontak saat customer berganti
    }));
    if (errors?.customer_id) {
      setErrors?.((prev) => ({ ...prev, customer_id: '' }));
    }
  };

  const handleSelectContact = (val: string | number) => {
    const contactId = String(val);
    setFormData((prev) => ({
      ...prev,
      customer_contact_id: contactId,
    }));
    if (errors?.customer_contact_id) {
      setErrors?.((prev) => ({ ...prev, customer_contact_id: '' }));
    }
  };

  const handleSelectInteractionType = (typeId: string) => {
    const matched = formattedDiaryTypes.find((t) => {
      const typeName = (t.interaction_type_name || '').toUpperCase();
      if (typeId === 'VISIT') return typeName.includes('VISIT');
      if (typeId === 'CALL') return typeName.includes('CALL');
      if (typeId === 'EMAIL') return typeName.includes('EMAIL');
      if (typeId === 'CHAT') return typeName.includes('CHAT');
      return typeName.includes(typeId);
    });

    setFormData((prev) => ({
      ...prev,
      interaction_type: typeId,
      interaction_type_id: matched ? String(matched.interaction_type_id) : prev.interaction_type_id || '1',
    }));

    if (errors?.interaction_type) {
      setErrors?.((prev) => ({ ...prev, interaction_type: '' }));
    }
  };

  const handleVoicePress = () => {
    Alert.alert(
      'Voice Dictation',
      'Fitur voice-to-text siap digunakan. Tekan OK untuk mulai berbicara.',
      [{ text: 'OK' }]
    );
  };

  const handleTakeSelfie = async () => {
    setShowPhotoOptions(false);
    setIsProcessingPhoto(true);
    try {
      const result = await takeSelfieWithWatermark({
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationName: formData.location_name,
      }, captureNativeWatermark);

      if (result) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, result.uri],
          latitude: result.latitude,
          longitude: result.longitude,
          location_name: result.locationName,
        }));
      }
    } catch (err: any) {
      Alert.alert(
        'Gagal Mengambil Selfie',
        err?.message || 'Pastikan izin kamera dan lokasi diaktifkan pada perangkat Anda.'
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handlePickGallery = async () => {
    setShowPhotoOptions(false);
    setIsProcessingPhoto(true);
    try {
      const result = await pickImageFromGalleryWithWatermark({
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationName: formData.location_name,
      }, captureNativeWatermark);

      if (result) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, result.uri],
          latitude: result.latitude,
          longitude: result.longitude,
          location_name: result.locationName,
        }));
      }
    } catch (err: any) {
      Alert.alert(
        'Gagal Memilih Foto',
        err?.message || 'Pastikan izin galeri diaktifkan pada perangkat Anda.'
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index),
    }));
  };

  const renderChip = (chip: InteractionChip) => {
    const isSelected = formData.interaction_type === chip.id;

    return (
      <TouchableOpacity
        key={chip.id}
        style={[
          styles.chip,
          isSelected && styles.chipSelected,
        ]}
        onPress={() => handleSelectInteractionType(chip.id)}
        activeOpacity={0.7}
      >
        {chip.iconType === 'feather' ? (
          <Feather
            name={chip.icon as any}
            size={16}
            color={isSelected ? '#2563EB' : chip.color}
            style={styles.chipIcon}
          />
        ) : (
          <Ionicons
            name={chip.icon as any}
            size={16}
            color={isSelected ? '#2563EB' : chip.color}
            style={styles.chipIcon}
          />
        )}
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {chip.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {nativeWatermarkRequest && Platform.OS !== 'web' ? (
        <View
          ref={watermarkViewRef}
          collapsable={false}
          style={{
            position: 'absolute',
            left: -10000,
            top: 0,
            width: watermarkImageSize.width,
            height: watermarkImageSize.height,
            backgroundColor: '#000000',
          }}
        >
          <Image
            source={{ uri: nativeWatermarkRequest.uri } as ImageSourcePropType}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onLoad={(event) => {
              const { width, height } = event.nativeEvent.source;
              if (width && height) {
                setWatermarkImageSize({ width, height });
              }
              setWatermarkImageReady(true);
            }}
            onError={(event) => {
              watermarkResolverRef.current?.reject(
                new Error(`Gagal memuat foto untuk watermark: ${event.nativeEvent.error}`)
              );
              watermarkResolverRef.current = null;
              setNativeWatermarkRequest(null);
            }}
          />
          <View style={styles.nativeWatermarkCard}>
            <Text style={styles.nativeWatermarkCompany}>
              {(nativeWatermarkRequest.companyTag || 'PT SAMASI • SALES TRACKER').toUpperCase()}
            </Text>
            <Text style={styles.nativeWatermarkCoordinates}>
              GPS {Math.abs(nativeWatermarkRequest.latitude).toFixed(6)}°{' '}
              {nativeWatermarkRequest.latitude >= 0 ? 'N' : 'S'}, {Math.abs(nativeWatermarkRequest.longitude).toFixed(6)}°{' '}
              {nativeWatermarkRequest.longitude >= 0 ? 'E' : 'W'}
            </Text>
            {!!nativeWatermarkRequest.locationName && (
              <Text style={styles.nativeWatermarkLocation} numberOfLines={1}>
                {nativeWatermarkRequest.locationName}
              </Text>
            )}
            <Text style={styles.nativeWatermarkTime}>
              {formatWatermarkDateTime(nativeWatermarkRequest.capturedAt || new Date())}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>TITLE</Text>
        <TextInput
          style={[
            styles.titleInput,
            errors?.title ? styles.titleInputError : null,
          ]}
          placeholder="e.g. Follow-up meeting, Site visit..."
          placeholderTextColor="#94A3B8"
          value={formData.title}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, title: text }));
            if (errors?.title) {
              setErrors?.((prev) => ({ ...prev, title: '' }));
            }
          }}
        />
        {errors?.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>
          CUSTOMER <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Dropdown
          placeholder={isLoadingCustomers ? 'Memuat customer...' : 'Select Customer'}
          items={customerOptions}
          selectedValue={formData.customer_id}
          onValueChange={handleSelectCustomer}
          error={errors?.customer_id}
          showSearch={true}
          modalTitle="Pilih Customer"
        />
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>CONTACT (PIC)</Text>
        <Dropdown
          placeholder={
            !formData.customer_id
              ? 'Pilih Customer terlebih dahulu'
              : isLoadingContacts
              ? 'Memuat kontak...'
              : contacts.length === 0
              ? 'Customer belum memiliki kontak'
              : 'Select Contact (PIC)'
          }
          items={contactOptions}
          selectedValue={formData.customer_contact_id}
          onValueChange={handleSelectContact}
          disabled={!formData.customer_id || isLoadingContacts}
          error={errors?.customer_contact_id}
          modalTitle="Pilih Contact (PIC)"
        />
        {!formData.customer_id && (
          <Text style={styles.helperText}>
            Pilih customer di atas untuk menampilkan kontak yang tersedia.
          </Text>
        )}
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>
          INTERACTION TYPE <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <View style={styles.chipsRow}>
          {INTERACTION_CHIPS_ROW_1.map(renderChip)}
        </View>
        <View style={[styles.chipsRow, { marginTop: 8 }]}>
          {INTERACTION_CHIPS_ROW_2.map(renderChip)}
        </View>
        {errors?.interaction_type ? (
          <Text style={styles.errorText}>{errors.interaction_type}</Text>
        ) : null}
      </View>

      <View style={styles.fieldSection}>
        <View style={styles.notesLabelRow}>
          <Text style={styles.fieldTitle}>
            NOTES <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handleVoicePress}
            activeOpacity={0.7}
          >
            <Feather name="mic" size={13} color="#2563EB" />
            <Text style={styles.voiceButtonText}>Voice</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.notesInput,
            errors?.notes ? styles.notesInputError : null,
          ]}
          placeholder="Describe the interaction, key discussion points, next steps..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.notes}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, notes: text }));
            if (errors?.notes) {
              setErrors?.((prev) => ({ ...prev, notes: '' }));
            }
          }}
        />
        {errors?.notes ? <Text style={styles.errorText}>{errors.notes}</Text> : null}
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationIconBox}>
          <Feather name="crosshair" size={18} color="#16A34A" />
        </View>

        <View style={styles.locationTextBox}>
          <Text style={styles.locationTitle}>GPS Location Captured</Text>
          <Text style={styles.locationSubtitle}>
            {formData.latitude?.toFixed(4) || '1.3521'}° N,{' '}
            {formData.longitude?.toFixed(4) || '103.8198'}° E ·{' '}
            {formData.location_name || 'Raffles Place'}
          </Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.fieldSection}>
        <View style={styles.photosHeaderRow}>
          <Text style={styles.photosSectionTitle}>PHOTOS (SELFIE & EVIDENCE)</Text>
          <TouchableOpacity
            style={styles.selfieQuickButton}
            onPress={handleTakeSelfie}
            disabled={isProcessingPhoto}
            activeOpacity={0.7}
          >
            <Feather name="camera" size={13} color="#2563EB" />
            <Text style={styles.selfieQuickButtonText}>Ambil Selfie</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photosRow}>
          {formData.photos.map((photoUrl, index) => (
            <View key={`photo-${index}`} style={styles.photoThumbWrapper}>
              <TouchableOpacity
                style={styles.photoCard}
                onPress={() => setPreviewPhotoUri(photoUrl)}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.photoThumbImage}
                  resizeMode="cover"
                />
                <View style={styles.photoBadgeOverlay}>
                  <Feather name="map-pin" size={9} color="#FFFFFF" />
                  <Text style={styles.photoBadgeText}>GPS</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => handleRemovePhoto(index)}
                activeOpacity={0.8}
              >
                <Feather name="x" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}

          {isProcessingPhoto ? (
            <View style={styles.processingPhotoCard}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.processingPhotoText}>Watermark...</Text>
            </View>
          ) : null}

          {formData.photos.length === 0 && !isProcessingPhoto ? (
            <TouchableOpacity
              style={styles.mockPhotoCard}
              onPress={() => setShowPhotoOptions(true)}
              activeOpacity={0.8}
            >
              <View style={styles.mockPhotoIconWrapper}>
                <Feather name="camera" size={24} color="#2563EB" />
              </View>
            </TouchableOpacity>
          ) : null}

          {!isProcessingPhoto ? (
            <TouchableOpacity
              style={styles.addPhotoCard}
              onPress={() => setShowPhotoOptions(true)}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={18} color="#2563EB" />
              <Text style={styles.addPhotoText}>Add</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Modal Pilihan Sumber Foto */}
      <Modal
        visible={showPhotoOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>Tambah Foto Kunjungan</Text>
              <Text style={styles.actionSheetSubtitle}>
                Foto akan otomatis dibubuhi stempel koordinat GPS & waktu real-time
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionSheetItem}
              onPress={handleTakeSelfie}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="camera" size={20} color="#2563EB" />
              </View>
              <View style={styles.actionSheetTextBox}>
                <Text style={styles.actionSheetItemTitle}>Ambil Selfie (Kamera Depan)</Text>
                <Text style={styles.actionSheetItemSubtitle}>
                  Kamera depan + Stempel Koordinat GPS & Waktu
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItem}
              onPress={handlePickGallery}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Feather name="image" size={20} color="#16A34A" />
              </View>
              <View style={styles.actionSheetTextBox}>
                <Text style={styles.actionSheetItemTitle}>Pilih dari Galeri</Text>
                <Text style={styles.actionSheetItemSubtitle}>
                  Pilih foto dari perangkat + Watermark GPS
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetCancelButton}
              onPress={() => setShowPhotoOptions(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionSheetCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Preview Foto Full Screen */}
      <Modal
        visible={!!previewPhotoUri}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewPhotoUri(null)}
      >
        <View style={styles.previewModalBackdrop}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setPreviewPhotoUri(null)}
            activeOpacity={0.8}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {previewPhotoUri ? (
            <View style={styles.previewImageContainer}>
              <Image
                source={{ uri: previewPhotoUri }}
                style={styles.previewFullImage}
                resizeMode="contain"
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  fieldSection: {
    gap: 6,
  },
  fieldTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  requiredAsterisk: {
    color: Colors.semantic.error,
  },
  helperText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.semantic.error,
    marginTop: 2,
    marginLeft: 2,
  },
  titleInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: '#0F172A',
  },
  titleInputError: {
    borderColor: Colors.semantic.error,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextSelected: {
    color: '#2563EB',
  },
  notesLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  voiceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  notesInput: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 12,
    fontSize: 13.5,
    color: '#0F172A',
    lineHeight: 20,
  },
  notesInputError: {
    borderColor: Colors.semantic.error,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.04)',
    elevation: 1,
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locationTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },
  photosHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  photosSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  selfieQuickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  selfieQuickButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoThumbWrapper: {
    position: 'relative',
  },
  photoCard: {
    width: 76,
    height: 76,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#D1D5FA',
    position: 'relative',
  },
  photoThumbImage: {
    width: '100%',
    height: '100%',
  },
  photoBadgeOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '700',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  processingPhotoCard: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  processingPhotoText: {
    fontSize: 9.5,
    color: '#2563EB',
    fontWeight: '600',
  },
  mockPhotoCard: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockPhotoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoCard: {
    width: 76,
    height: 76,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  addPhotoText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
  },

  // Modal Sheet Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 12,
  },
  actionSheetHeader: {
    marginBottom: 4,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionSheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  actionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  actionSheetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetTextBox: {
    flex: 1,
  },
  actionSheetItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionSheetItemSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  actionSheetCancelButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  actionSheetCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },

  // Full Preview Modal
  previewModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewCloseButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  previewImageContainer: {
    width: '100%',
    height: '75%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewFullImage: {
    width: '100%',
    height: '100%',
  },
  nativeWatermarkCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(10, 22, 40, 0.90)',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#1666a3',
  },
  nativeWatermarkCompany: {
    fontSize: 18,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 8,
  },
  nativeWatermarkCoordinates: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 6,
  },
  nativeWatermarkLocation: {
    fontSize: 17,
    color: '#E2E8F0',
    marginBottom: 6,
  },
  nativeWatermarkTime: {
    fontSize: 16,
    color: '#CBD5E1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});