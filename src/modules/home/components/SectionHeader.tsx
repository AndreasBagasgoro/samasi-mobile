import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@shared/constants';

interface SectionHeaderProps {
  title: string;
  seeAllLabel?: string;
  onPressSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  seeAllLabel = 'See all',
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onPressSeeAll ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPressSeeAll}>
          <Text style={styles.seeAll}>{seeAllLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
