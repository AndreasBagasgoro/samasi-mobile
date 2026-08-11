import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ReminderItem } from '../types/home.types';

export const Reminder: React.FC<ReminderItem> = ({
  title,
  label,
  time,
  iconColor = '#3B82F6',
  iconBackgroundColor = 'rgba(59, 130, 246, 0.12)',
  cardBackgroundColor = '#FFFFFF',
  onPress,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7} 
      style={[styles.container, { backgroundColor: cardBackgroundColor }]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
        <Feather name="clock" size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
      {time && <Text style={styles.timeText}>{time}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  labelText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
