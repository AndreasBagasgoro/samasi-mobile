import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@shared/constants';
import { CustomerItem } from '../../types';
import { DealsCard } from '../../components';

interface DealsTabProps {
  customer?: CustomerItem;
}

const MOCK_DEALS = [
  { id: 'd1', title: 'Container Shipment 2026', amount: 'Rp 450.000.000', stage: 'Negotiation', date: 'Exp: 24 Aug 2026' },
  { id: 'd2', title: 'NVOCC Route Expansion', amount: 'Rp 1.200.000.000', stage: 'Proposal Sent', date: 'Exp: 10 Sep 2026' },
];

export const DealsTabScreen: React.FC<DealsTabProps> = () => {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.dealsList}>
        {MOCK_DEALS.map((deal) => (
          <DealsCard
            key={deal.id}
            title={deal.title}
            amount={deal.amount}
            stage={deal.stage}
            date={deal.date}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  dealsList: {
    gap: 12,
  },
});
