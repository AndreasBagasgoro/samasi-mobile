import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Colors } from '@shared/constants';

interface ProfileSettingRowProps {
  label: string;
  value: boolean;
  isLast?: boolean;
}

/** Baris pengaturan dengan toggle. Non-interaktif untuk saat ini (lihat plan). */
export const ProfileSettingRow: React.FC<ProfileSettingRowProps> = ({ label, value, isLast }) => {
  return (
    <View style={[styles.row, !isLast && styles.divider]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        disabled
        trackColor={{ true: Colors.primary, false: Colors.border }}
        thumbColor={Colors.surface}
      />
    </View>
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
});

export default ProfileSettingRow;
