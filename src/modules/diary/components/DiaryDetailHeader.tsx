import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Back to Diary List"
      >
        <Feather name="chevron-left" size={22} color="#0F172A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.optionsButton}
        onPress={onOptionsPress}
        activeOpacity={0.7}
        accessibilityLabel="More Options"
      >
        <Feather name="more-horizontal" size={22} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
    minWidth: 70,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 2,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionsButton: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
  },
});
