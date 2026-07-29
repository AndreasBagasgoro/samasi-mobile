import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    let backgroundColor = Colors.primary;
    let borderColor = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'secondary':
        backgroundColor = Colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = Colors.primary;
        borderWidth = 1;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
    }

    if (disabled) {
      backgroundColor = variant === 'outline' || variant === 'ghost' ? 'transparent' : Colors.border;
      borderColor = variant === 'outline' ? Colors.border : 'transparent';
    }

    let paddingVertical = Spacing.sm;
    let paddingHorizontal = Spacing.md;

    switch (size) {
      case 'sm':
        paddingVertical = Spacing.xs;
        paddingHorizontal = Spacing.sm;
        break;
      case 'lg':
        paddingVertical = Spacing.md;
        paddingHorizontal = Spacing.lg;
        break;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      paddingVertical,
      paddingHorizontal,
      width: fullWidth ? '100%' : 'auto',
    };
  };

  const getTextStyle = (): TextStyle => {
    let color = Colors.text.inverse;

    if (variant === 'outline' || variant === 'ghost') {
      color = Colors.primary;
    }

    if (disabled) {
      color = Colors.text.disabled;
    }

    let fontSize = Typography.fontSize.md;
    switch (size) {
      case 'sm':
        fontSize = Typography.fontSize.sm;
        break;
      case 'lg':
        fontSize = Typography.fontSize.lg;
        break;
    }

    return {
      color,
      fontSize,
    };
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.text.inverse}
          size="small"
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    ...Typography.styles.button,
    textAlign: 'center',
  },
});
