import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CustomerHeader, CustomerCard } from '../components';
import { Colors, Layout } from '@shared/constants';
import { CUSTOMER_ITEMS } from '../constants/customer.constants';

export const CustomerScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
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
              onPress={() => {
                if (item.id) {
                  router.push(`/home/customers/${item.id}`);
                }
              }}
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