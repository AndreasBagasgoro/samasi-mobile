import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '@shared/constants';

interface SignOutButtonProps {
  onPress: () => void;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.semanticBg.error,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.semantic.error,
  },
});

export default SignOutButton;
