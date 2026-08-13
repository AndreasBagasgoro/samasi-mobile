import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants';

export interface ContactCardProps {
  id?: string | number;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarBackgroundColor?: string;
  onPress?: () => void;
}

// Generator warna avatar sederhana untuk shared component
const VIBRANT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#EF4444', '#14B8A6',
];

const getAvatarBg = (str: string = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return VIBRANT_COLORS[Math.abs(hash) % VIBRANT_COLORS.length];
};

export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  role,
  email,
  phone,
  avatarBackgroundColor,
  onPress,
}) => {
  const initial = name ? name.substring(0, 2).toUpperCase() : 'CP';
  const avatarBg = avatarBackgroundColor || getAvatarBg(name);

  return (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatarCircle, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{name}</Text>
        {role ? <Text style={styles.contactRole}>{role}</Text> : null}
        <Text style={styles.contactMeta}>
          {email || '-'}{phone ? ` · ${phone}` : ''}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.moreButton}>
        <Feather name="more-vertical" size={18} color={Colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderColor: Colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  contactRole: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  contactMeta: {
    fontSize: 11,
    color: Colors.text.disabled,
  },
  moreButton: {
    padding: 4,
  },
});
