import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows, Layout } from '@shared/constants';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  body: {
    gap: 4,
  },
});

export default ProfileSection;
