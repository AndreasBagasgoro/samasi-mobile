import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { ReminderItem } from '../types/home.types';

export const Reminder: React.FC<ReminderItem> = ({
  title,
  label,
  time,
  icon = 'time-outline',
  iconColor = Colors.primary,
  iconBackgroundColor = Colors.primarySoft,
  cardBackgroundColor = Colors.surface,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.container, { backgroundColor: cardBackgroundColor }]}
    >
      <View style={[styles.accentBar, { backgroundColor: iconColor }]} />
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
      {time && (
        <View style={styles.timePill}>
          <Ionicons name="time-outline" size={12} color={Colors.primary} />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  labelText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 3,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 8,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
});
