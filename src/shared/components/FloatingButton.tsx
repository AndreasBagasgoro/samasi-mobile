import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { Colors } from '../constants';
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
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Feather name="plus" size={20} color={Colors.text.inverse} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.semantic.info,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default FloatingButton;
