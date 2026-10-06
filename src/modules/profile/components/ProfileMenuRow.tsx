import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/constants';

interface ProfileMenuRowProps {
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}

/** Baris menu dengan chevron. Tanpa aksi untuk saat ini (lihat plan), kecuali `onPress` diberikan. */
export const ProfileMenuRow: React.FC<ProfileMenuRowProps> = ({ label, value, isLast, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.divider]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={Colors.text.disabled} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});

export default ProfileMenuRow;
