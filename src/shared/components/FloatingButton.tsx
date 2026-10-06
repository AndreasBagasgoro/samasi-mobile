import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { Colors, Gradients, Shadows } from '../constants';
import { Platform } from 'react-native';

export interface FloatingButtonProps {
  targetRoute: Href | string;
  accessibilityLabel?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  targetRoute,
  accessibilityLabel = 'Floating action button',
}) => {
  const router = useRouter();

  const handlePress = (e: any) => {
    if (Platform.OS === 'web') {
    e?.currentTarget?.blur?.();
  }
    router.push(targetRoute as any);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <LinearGradient
        colors={Gradients.button.colors}
        start={Gradients.button.start}
        end={Gradients.button.end}
        style={styles.gradient}
      >
        <Ionicons name="add" size={28} color={Colors.text.inverse} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    zIndex: 999,
    ...Shadows.lg,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default FloatingButton;
