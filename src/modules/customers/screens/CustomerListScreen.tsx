import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, ScrollView, StyleSheet, View } from 'react-native';
import { CustomerHeader, CustomerCard } from '../components';
import { Colors, Layout } from '@shared/constants';
import { CUSTOMER_ITEMS } from '../constants/customer.constants';

export const CustomerScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#031730"
        translucent={true}
      />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomerHeader />
        <View style={styles.contactCardContainer}>
          {CUSTOMER_ITEMS.map((item, index) => (
            <CustomerCard 
              key={item.id || index}
              profileInitial={item.profileInitial}
              name={item.name}
              customerType={item.customerType}
              totalContacts={item.totalContacts}
              lastActive={item.lastActive}
              avatarBackgroundColor={item.avatarBackgroundColor}
              avatarTextColor={item.avatarTextColor}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contactCardContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
  },
});