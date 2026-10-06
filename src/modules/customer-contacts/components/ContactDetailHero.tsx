import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { ContactItem } from '../types';
import { getAvatarGradient } from '../utils';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface ContactDetailHeroProps {
  contact: ContactItem | null;
  onBack: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onEmail: () => void;
  onDiary: () => void;
  onOptionsPress?: () => void;
}

interface HeroAction {
  key: string;
  label: string;
  icon: IoniconName;
  enabled: boolean;
  onPress: () => void;
}

export const ContactDetailHero: React.FC<ContactDetailHeroProps> = ({
  contact,
  onBack,
  onCall,
  onWhatsApp,
  onEmail,
  onDiary,
  onOptionsPress,
}) => {
  const insets = useSafeAreaInsets();

  const actions: HeroAction[] = [
    { key: 'call', label: 'Call', icon: 'call-outline', enabled: Boolean(contact?.phone), onPress: onCall },
    { key: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', enabled: Boolean(contact?.phone), onPress: onWhatsApp },
    { key: 'email', label: 'Email', icon: 'mail-outline', enabled: Boolean(contact?.email), onPress: onEmail },
    { key: 'diary', label: 'Diary', icon: 'journal-outline', enabled: Boolean(contact), onPress: onDiary },
  ];

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={[styles.decorCircle, styles.decorCircleLarge]} />
      <View style={[styles.decorCircle, styles.decorCircleSmall]} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.glassButton} onPress={onBack} activeOpacity={0.7} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Contact Detail</Text>
        {onOptionsPress && contact ? (
          <TouchableOpacity
            style={styles.glassButton}
            onPress={onOptionsPress}
            activeOpacity={0.7}
            accessibilityLabel="More Options"
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text.inverse} />
          </TouchableOpacity>
        ) : (
          <View style={styles.topBarSpacer} />
        )}
      </View>

      <View style={styles.profile}>
        <View style={styles.avatarRing}>
          <LinearGradient
            colors={getAvatarGradient(contact?.name)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{contact?.initials || 'CT'}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {contact?.name || '-'}
        </Text>
        {contact?.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {contact.subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={[styles.actionButton, !action.enabled && styles.actionDisabled]}
            onPress={action.onPress}
            disabled={!action.enabled}
            activeOpacity={0.7}
            accessibilityLabel={action.label}
          >
            <Ionicons name={action.icon} size={20} color={Colors.text.inverse} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    gap: 20,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(96, 165, 250, 0.10)',
  },
  decorCircleLarge: {
    width: 220,
    height: 220,
    top: -80,
    right: -70,
  },
  decorCircleSmall: {
    width: 110,
    height: 110,
    bottom: -40,
    left: -30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  topBarSpacer: {
    width: 40,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'center',
    gap: 6,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: Colors.glass.strong,
    marginBottom: 6,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 26,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.inverseMuted,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 62,
    borderRadius: 16,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionDisabled: {
    opacity: 0.4,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});
