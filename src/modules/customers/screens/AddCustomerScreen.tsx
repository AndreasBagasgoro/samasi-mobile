import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FormHeader, CustomerForm } from '@shared/components';
import { Colors } from '@shared/constants';

export const AddCustomerScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FormHeader
        title="Add Customer"
        description="New Data"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomerForm />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});