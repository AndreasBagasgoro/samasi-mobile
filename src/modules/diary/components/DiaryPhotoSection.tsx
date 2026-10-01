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
import { Feather } from '@expo/vector-icons';
import { DiaryPhotoItem } from '../types';

export interface DiaryPhotoSectionProps {
  photos?: DiaryPhotoItem[];
}

const PASTEL_COLORS = ['#D1D5FA', '#C1DEFE', '#A7F3D0', '#FDE68A', '#FED7AA'];

export const DiaryPhotoSection: React.FC<DiaryPhotoSectionProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const displayPhotos: (DiaryPhotoItem & { placeholderBg?: string })[] =
    photos && photos.length > 0
      ? photos.map((p, idx) => ({
          ...p,
          placeholderBg: PASTEL_COLORS[idx % PASTEL_COLORS.length],
        }))
      : [
          { sales_diary_photo_id: 'ph-1', placeholderBg: '#D1D5FA' },
          { sales_diary_photo_id: 'ph-2', placeholderBg: '#C1DEFE' },
          { sales_diary_photo_id: 'ph-3', placeholderBg: '#A7F3D0' },
        ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>PHOTOS</Text>

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
                    <Feather name="image" size={28} color="#3B82F6" />
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoCard: {
    width: 96,
    height: 96,
    borderRadius: 16,
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
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
