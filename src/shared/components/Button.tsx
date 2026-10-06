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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows, Spacing, Typography } from '../constants';

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
        backgroundColor = Colors.primarySoft;
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

    if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
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

  const isGradient = variant === 'primary' && !disabled;

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), isGradient && styles.gradientContainer, style]}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...props}
    >
      {isGradient && (
        <LinearGradient
          colors={Gradients.button.colors}
          start={Gradients.button.start}
          end={Gradients.button.end}
          style={StyleSheet.absoluteFill}
        />
      )}
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.text.inverse : Colors.primary}
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
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  gradientContainer: {
    backgroundColor: Colors.primary,
    ...Shadows.lg,
  },
  text: {
    ...Typography.styles.button,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
