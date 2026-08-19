import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Layout, Colors } from "@shared/constants";
import { useRouter } from 'expo-router';

export interface FormHeaderProps {
  title?: string;
  onBack?: () => void;
  onSave?: () => void;
  saveText?: string;
  isSaving?: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title = 'Header Title',
  onBack,
  onSave,
  saveText = 'Save',
  isSaving = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* 1. Title Absolute Center (Selalu tepat di tengah layar) */}
      <View style={styles.titleContainer} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 2. Tombol Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Entypo name="chevron-left" size={22} color={Colors.text.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* 3. Tombol Save */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>{saveText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Preview Screen di Sandbox
export const SandboxScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <FormHeader
        title="Add Customer"
        onBack={() => console.log('Kembali')}
        onSave={() => alert('Data tersimpan!')}
      />
      <View style={styles.bodyContent}>
        <Text style={styles.previewText}>Konten form/halaman berada di sini.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 80,
  },
  backButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  titleContainer: {
    position: 'absolute',
    left: 80,
    right: 80,
    top: 28,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.semantic.info,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
    zIndex: 1,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
  bodyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  previewText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});

export default SandboxScreen;

