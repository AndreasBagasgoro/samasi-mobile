import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { ContactItem } from '../types';
import { getAvatarGradient } from '../utils';

export interface ContactCardProps {
  contact: ContactItem;
  onPress?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onPress, onCall, onMessage }) => {
  const hasPhone = Boolean(contact.phone);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.mainArea} onPress={onPress} activeOpacity={0.75}>
        <LinearGradient
          colors={getAvatarGradient(contact.name)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{contact.initials}</Text>
        </LinearGradient>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {contact.name}
          </Text>
          {contact.subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {contact.subtitle}
            </Text>
          ) : null}
          {contact.phone ? (
            <Text style={styles.phone} numberOfLines={1}>
              {contact.phone}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton, !hasPhone && styles.actionDisabled]}
          onPress={onCall}
          disabled={!hasPhone}
          activeOpacity={0.7}
          accessibilityLabel={`Call ${contact.name}`}
        >
          <Ionicons name="call-outline" size={17} color={Colors.semantic.success} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton, !hasPhone && styles.actionDisabled]}
          onPress={onMessage}
          disabled={!hasPhone}
          activeOpacity={0.7}
          accessibilityLabel={`Message ${contact.name}`}
        >
          <Ionicons name="chatbubble-outline" size={17} color="#0E7490" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    ...Shadows.sm,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  phone: {
    fontSize: 11,
    color: Colors.text.disabled,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: Colors.semanticBg.success,
  },
  messageButton: {
    backgroundColor: '#CFFAFE',
  },
  actionDisabled: {
    opacity: 0.4,
  },
});
