import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { DiaryPhotoItem } from '../types';

export interface DiaryPhotoSectionProps {
  photos?: DiaryPhotoItem[];
}

const PASTEL_COLORS = ['#DCE8FF', '#E0F2FE', '#E0E7FF', '#CFFAFE', '#EAF0FA'];

export const DiaryPhotoSection: React.FC<DiaryPhotoSectionProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const displayPhotos: (DiaryPhotoItem & { placeholderBg?: string })[] =
    photos && photos.length > 0
      ? photos.map((p, idx) => ({
          ...p,
          placeholderBg: PASTEL_COLORS[idx % PASTEL_COLORS.length],
        }))
      : [
          { sales_diary_photo_id: 'ph-1', placeholderBg: PASTEL_COLORS[0] },
          { sales_diary_photo_id: 'ph-2', placeholderBg: PASTEL_COLORS[1] },
          { sales_diary_photo_id: 'ph-3', placeholderBg: PASTEL_COLORS[2] },
        ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="images-outline" size={15} color={Colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>Photos</Text>
        <Text style={styles.sectionCount}>{photos?.length ?? 0}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosRow}
      >
        {displayPhotos.map((photo, index) => {
          const photoUrl = photo.photo_url || photo.url;
          const bg = photo.placeholderBg || PASTEL_COLORS[index % PASTEL_COLORS.length];

          return (
            <TouchableOpacity
              key={photo.sales_diary_photo_id || `photo-${index}`}
              style={[styles.photoCard, { backgroundColor: bg }]}
              activeOpacity={photoUrl ? 0.8 : 0.95}
              onPress={() => {
                if (photoUrl) {
                  setSelectedPhoto(photoUrl);
                }
              }}
            >
              {photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  {/* Photo frame placeholder icon matching mockup */}
                  <View style={styles.iconWrapper}>
                    <Ionicons name="image-outline" size={26} color={Colors.primaryLight} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal Preview saat foto diklik */}
      <Modal
        visible={Boolean(selectedPhoto)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedPhoto(null)}
            activeOpacity={0.8}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoCard: {
    width: 104,
    height: 104,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 26, 61, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
  },
});
