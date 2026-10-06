import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '@shared/constants';

export interface DealNavHeaderProps {
  title: string;
  onBack: () => void;
  actionLabel?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onActionPress?: () => void;
}

export const DealNavHeader: React.FC<DealNavHeaderProps> = ({
  title,
  onBack,
  actionLabel,
  actionIcon,
  onActionPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.decorCircle} />
      <TouchableOpacity
        style={styles.glassButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
      </TouchableOpacity>

      <View style={styles.titleContainer} pointerEvents="none">
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {actionLabel ? (
        <TouchableOpacity
          style={[styles.glassButton, styles.actionButton]}
          onPress={onActionPress}
          activeOpacity={0.7}
          accessibilityLabel={actionLabel}
        >
          {actionIcon && <Ionicons name={actionIcon} size={15} color={Colors.text.inverse} />}
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -70,
    right: -40,
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  glassButton: {
    minWidth: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    position: 'absolute',
    left: 110,
    right: 110,
    bottom: 18,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
