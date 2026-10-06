import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, getBlueGradient } from '../constants';

export interface ContactCardProps {
  id?: string | number;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarBackgroundColor?: string;
  onPress?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  role,
  email,
  phone,
  avatarBackgroundColor,
  onPress,
}) => {
  const initial = name ? name.substring(0, 2).toUpperCase() : 'CP';
  const avatarGradient = getBlueGradient(name);
  const avatarColors: [string, string] = avatarBackgroundColor
    ? [avatarBackgroundColor, avatarBackgroundColor]
    : avatarGradient;

  return (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={avatarColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarCircle}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </LinearGradient>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{name}</Text>
        {role ? <Text style={styles.contactRole}>{role}</Text> : null}
        <View style={styles.metaRow}>
          <Ionicons name="mail-outline" size={12} color={Colors.text.disabled} />
          <Text style={styles.contactMeta} numberOfLines={1}>{email || '-'}</Text>
        </View>
        {phone ? (
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={12} color={Colors.text.disabled} />
            <Text style={styles.contactMeta} numberOfLines={1}>{phone}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    borderColor: Colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.sm,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactMeta: {
    flexShrink: 1,
    fontSize: 11,
    color: Colors.text.secondary,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
