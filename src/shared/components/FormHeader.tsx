import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout, Colors, Gradients } from "@shared/constants";
import { useRouter } from 'expo-router';

export interface FormHeaderProps {
    title?: string;
    onBack?: () => void;
    onSave?: () => void;
    saveText?: string;
    isSaving?: boolean;
    /** Nonaktifkan tombol save (mis. karena data form belum valid) */
    saveDisabled?: boolean;
}
export const FormHeader: React.FC<FormHeaderProps> = ({
    title = 'Header Title',
    onBack,
    onSave,
    saveText = 'Save',
    isSaving = false,
    saveDisabled = false,
}) => {
    const isSaveDisabled = isSaving || saveDisabled;

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
                <View style={styles.backIcon}>
                    <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                </View>
            </TouchableOpacity>

            {/* 3. Tombol Save */}
            <TouchableOpacity
                style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
                onPress={onSave}
                disabled={isSaveDisabled}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={Gradients.button.colors}
                    start={Gradients.button.start}
                    end={Gradients.button.end}
                    style={styles.saveGradient}
                >
                    <Ionicons name="checkmark" size={14} color={Colors.text.inverse} />
                    <Text style={styles.saveButtonText}>{saveText}</Text>
                </LinearGradient>
            </TouchableOpacity>
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
    backIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        minWidth: 48,
        zIndex: 1,
        boxShadow: '0px 4px 10px rgba(29, 78, 216, 0.25)',
    },
    saveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 9,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 13,
        fontWeight: '600',
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