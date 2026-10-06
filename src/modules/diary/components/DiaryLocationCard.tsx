import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DiaryItem } from '../types';
import { formatCoordinates } from '../utils/diary.utils';
import { Colors, Gradients, Shadows } from '@shared/constants';

export interface DiaryLocationCardProps {
  diary: DiaryItem;
}

export const DiaryLocationCard: React.FC<DiaryLocationCardProps> = ({ diary }) => {
  const displayLocation = diary.locationName;

  const coordinatesText = formatCoordinates(diary.latitude, diary.longitude);

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={Gradients.accent.colors}
        start={Gradients.accent.start}
        end={Gradients.accent.end}
        style={styles.iconContainer}
      >
        <Ionicons name="location" size={20} color={Colors.text.inverse} />
      </LinearGradient>

      <View style={styles.textContainer}>
        <Text style={styles.locationTitle} numberOfLines={1}>
          {displayLocation}
        </Text>
        <View style={styles.coordinatesRow}>
          <Ionicons name="navigate-outline" size={11} color={Colors.text.secondary} />
          <Text style={styles.coordinatesText} numberOfLines={1}>
            {coordinatesText}
          </Text>
        </View>
      </View>
      <View style={styles.mapButton}>
        <Ionicons name="map-outline" size={16} color={Colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
