import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants';

export interface ErrorDialogProps {
  visible: boolean;
  title: string;
  message: React.ReactNode;
  closeLabel?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  onClose: () => void;
}

/** Dialog pesan error di tengah layar dengan gaya kartu yang sama seperti ConfirmDialog */
export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  visible,
  title,
  message,
  closeLabel = 'Mengerti',
  icon = 'alert-circle-outline',
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={26} color={Colors.semantic.error} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85} accessibilityRole="button">
          <Text style={styles.buttonText}>{closeLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    ...Shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: Colors.semanticBg.error,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.semantic.error,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});

export default ErrorDialog;
