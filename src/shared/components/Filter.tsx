import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors } from '../constants';

export interface FilterProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  selected?: boolean;
  value?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  selectedStyle?: ViewStyle;
  selectedTextStyle?: TextStyle;
  activeOpacity?: number;
}

export const Filter: React.FC<FilterProps> = ({
  label,
  selected = false,
  value,
  onPress,
  style,
  textStyle,
  selectedStyle,
  selectedTextStyle,
  activeOpacity = 0.7,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterContainer,
        style,
        selected && styles.selectedContainer,
        selected && selectedStyle,
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      {...rest}
    >
      <Text
        style={[
          styles.filterText,
          textStyle,
          selected && styles.selectedText,
          selected && selectedTextStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.background2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Filter;
