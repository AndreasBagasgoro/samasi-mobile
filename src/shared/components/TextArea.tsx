import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants';

export interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  minHeight?: number;
  showCharacterCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  leftIcon,
  containerStyle,
  inputContainerStyle,
  style,
  editable = true,
  numberOfLines = 4,
  minHeight = 110,
  maxLength,
  showCharacterCount = false,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { minHeight },
          inputContainerStyle,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.textArea,
            { minHeight: minHeight - 16 },
            style,
          ]}
          placeholderTextColor={Colors.text.disabled}
          editable={editable}
          multiline={true}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          value={value}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>

      <View style={styles.footerContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {showCharacterCount && maxLength && (
          <Text style={styles.charCountText}>
            {currentLength}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  label: {
    ...Typography.styles.body,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
  },
  inputFocused: {
    borderColor: Colors.text.disabled,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.semantic.error,
  },
  inputDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
    paddingTop: Spacing.sm,
  },
  textArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    ...Typography.styles.body,
    color: Colors.text.primary,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  } as any,
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    flex: 1,
  },
  charCountText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
});

export default TextArea;
