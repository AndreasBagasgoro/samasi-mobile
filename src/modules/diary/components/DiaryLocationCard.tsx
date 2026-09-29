import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DiaryItem } from '../types';
import { formatCoordinates } from '../utils/diary.utils';
import { Colors } from '@shared/constants';

export interface DiaryLocationCardProps {
  diary: DiaryItem;
}

export const DiaryLocationCard: React.FC<DiaryLocationCardProps> = ({ diary }) => {
  const displayLocation = diary.locationName;

  const coordinatesText = formatCoordinates(diary.latitude, diary.longitude);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.iconContainer}>
        <Feather name="map-pin" size={18} color="#10B981" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.locationTitle} numberOfLines={1}>
          {displayLocation}
        </Text>
        <Text style={styles.coordinatesText} numberOfLines={1}>
          {coordinatesText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.semantic.success,
    backgroundColor: Colors.surface,
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
  coordinatesText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
