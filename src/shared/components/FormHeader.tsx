import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors, Layout } from '../constants';

export interface FormHeaderProps {
    title: string;
    description?: string;
    onCancel?: () => void;
    onSave?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    actionContainerStyle?: StyleProp<ViewStyle>;
    actionStyle?: StyleProp<TextStyle>;
    titleStyle?: StyleProp<TextStyle>;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
    title,
    description,
    onCancel,
    onSave,
    containerStyle,
    actionContainerStyle,
    actionStyle,
    titleStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.head}>
                <Text style={[styles.title, titleStyle]}>{title}</Text>
                {description ? (
                    <View style={[styles.actionContainer, actionContainerStyle]}>
                        <Text style={[styles.action, actionStyle]}>{description}</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.screenPaddingHorizontal2,
        paddingTop: 28,
        paddingBottom: 20,
        gap: 16,
        borderBottomWidth: 2,
        borderBottomColor: Colors.border,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    actionContainer: {
        backgroundColor: Colors.background2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    action: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
});