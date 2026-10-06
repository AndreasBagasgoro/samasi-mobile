import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '@shared/constants';

export interface DiaryDetailHeaderProps {
  title?: string;
  onBack: () => void;
  onOptionsPress?: () => void;
}

export const DiaryDetailHeader: React.FC<DiaryDetailHeaderProps> = ({
  title = 'Diary Entry',
  onBack,
  onOptionsPress,
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
        accessibilityLabel="Back to Diary List"
      >
        <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.glassButton}
        onPress={onOptionsPress}
        activeOpacity={0.7}
        accessibilityLabel="More Options"
      >
        <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text.inverse} />
      </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
