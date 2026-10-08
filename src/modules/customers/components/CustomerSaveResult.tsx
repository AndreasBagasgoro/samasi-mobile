import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SaveResult } from '@shared/components';
import { Colors } from '@shared/constants';
import { CustomerDetailItem } from '../types';

export interface CustomerSaveResultProps {
  status: 'success' | 'error';
  customer?: CustomerDetailItem | null;
  errorMessage?: string;
  onViewCustomer?: () => void;
  onCreateAnother?: () => void;
  onGoToCustomers?: () => void;
  onTryAgain?: () => void;
  onGoBack?: () => void;
}

export const CustomerSaveResult: React.FC<CustomerSaveResultProps> = ({
  status,
  customer,
  errorMessage,
  onViewCustomer,
  onCreateAnother,
  onGoToCustomers,
  onTryAgain,
  onGoBack,
}) => {
  if (status === 'success' && customer) {
    return (
      <SaveResult
        status="success"
        title="Customer Created!"
        message={
          <>
            <Text style={styles.messageBold}>{customer.customer_name}</Text> has been added to your
            customers.
          </>
        }
        summaryTitle="CUSTOMER SUMMARY"
        summaryRows={[
          { label: 'Name', value: customer.customer_name },
          { label: 'Code', value: customer.customer_code },
          { label: 'Type', value: customer.customer_type_name },
        ]}
        primaryAction={{ label: 'View Customer', icon: 'business-outline', onPress: onViewCustomer }}
        secondaryAction={{ label: 'Create Another', icon: 'add', onPress: onCreateAnother }}
        tertiaryAction={{ label: 'Go to Customers', onPress: onGoToCustomers }}
      />
    );
  }

  return (
    <SaveResult
      status="error"
      title="Something went wrong"
      message="We couldn't create this customer. Please check the details and try again."
      errorDetail={errorMessage}
      primaryAction={{ label: 'Try Again', icon: 'refresh', onPress: onTryAgain }}
      secondaryAction={{ label: 'Go Back', onPress: onGoBack }}
    />
  );
};

const styles = StyleSheet.create({
  messageBold: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
