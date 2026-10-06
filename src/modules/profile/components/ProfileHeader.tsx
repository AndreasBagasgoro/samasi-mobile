import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { getInitials } from '@shared/utils';

interface ProfileHeaderProps {
  fullName: string;
  positionName?: string;
  officeName?: string;
  divisionName?: string;
  onBack?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  positionName,
  officeName,
  divisionName,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const chips = [officeName, divisionName].filter(Boolean) as string[];

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={[styles.decorCircle, styles.decorCircleLarge]} />
      <View style={[styles.decorCircle, styles.decorCircleSmall]} />

      {onBack && (
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
        </TouchableOpacity>
      )}

      <LinearGradient colors={Gradients.button.colors} style={[styles.avatar, onBack && styles.avatarWithBack]}>
        <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
      </LinearGradient>

      <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
      {positionName ? <Text style={styles.position} numberOfLines={1}>{positionName}</Text> : null}

      {chips.length > 0 && (
        <View style={styles.chipRow}>
          {chips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(96, 165, 250, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorCircleLarge: {
    width: 240,
    height: 240,
    top: -110,
    right: -70,
  },
  decorCircleSmall: {
    width: 120,
    height: 120,
    bottom: -50,
    left: -30,
  },
  backButton: {
    position: 'absolute',
    left: Layout.screenPaddingHorizontal3,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarWithBack: {
    marginTop: 40,
  },
  avatarText: {
    color: Colors.text.inverse,
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  position: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.text.inverseMuted,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.inverseMuted,
  },
});

export default ProfileHeader;
