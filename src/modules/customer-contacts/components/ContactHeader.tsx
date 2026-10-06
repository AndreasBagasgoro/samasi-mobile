import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { Input } from '@shared/components';

interface ContactHeaderProps {
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  totalCount?: number;
}

export const ContactHeader: React.FC<ContactHeaderProps> = ({
  searchValue = '',
  onSearchChange,
  totalCount,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <View style={styles.decorCircle} />
      <View style={styles.head}>
        <View>
          <Text style={styles.caption}>Directory</Text>
          <Text style={styles.title}>Contacts</Text>
        </View>
        <View style={styles.amountContainer}>
          <Ionicons name="people-outline" size={13} color={Colors.text.inverse} />
          <Text style={styles.amount}>
            {totalCount !== undefined ? `${totalCount} Total` : 'Amount'}
          </Text>
        </View>
      </View>
      <Input
        value={searchValue}
        onChangeText={onSearchChange}
        leftIcon={<Ionicons name="search-outline" size={18} color={Colors.primary} />}
        placeholder="Search contacts..."
        placeholderTextColor={Colors.text.disabled}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchBar}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 22,
    gap: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -90,
    right: -60,
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  head: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  caption: {
    fontSize: 12,
    color: Colors.text.inverseMuted,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  searchContainer: {
    marginBottom: 0,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 16,
  },
});
