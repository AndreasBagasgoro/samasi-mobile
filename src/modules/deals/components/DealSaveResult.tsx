import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SaveResult } from '@shared/components';
import { Colors } from '@shared/constants';
import { DealItem, StageColor } from '../types';
import { formatCurrency, formatDealDate, getStageColor } from '../utils';

export interface DealSaveResultProps {
  status: 'success' | 'error';
  deal?: DealItem | null;
  stageColor?: StageColor;
  errorMessage?: string;
  onViewDeal?: () => void;
  onCreateAnother?: () => void;
  onGoToPipeline?: () => void;
  onTryAgain?: () => void;
  onGoBack?: () => void;
}

export const DealSaveResult: React.FC<DealSaveResultProps> = ({
  status,
  deal,
  stageColor = getStageColor(),
  errorMessage,
  onViewDeal,
  onCreateAnother,
  onGoToPipeline,
  onTryAgain,
  onGoBack,
}) => {
  if (status === 'success' && deal) {
    return (
      <SaveResult
        status="success"
        title="Deal Created!"
        message={
          <>
            <Text style={styles.messageBold}>{deal.title}</Text> for{' '}
            <Text style={styles.messageBold}>{deal.customerName}</Text> has been added to your
            pipeline.
          </>
        }
        summaryTitle="DEAL SUMMARY"
        summaryRows={[
          {
            label: 'Stage',
            badge: { label: deal.stageName || '-', bg: stageColor.bg, color: stageColor.text },
          },
          { label: 'Customer', value: deal.customerName },
          { label: 'Contact', value: deal.contactName },
          { label: 'Est. Value', value: formatCurrency(deal.value) },
          { label: 'Est. Close Date', value: formatDealDate(deal.expectedCloseDate) },
        ]}
        primaryAction={{ label: 'View Deal', icon: 'briefcase-outline', onPress: onViewDeal }}
        secondaryAction={{ label: 'Create Another', icon: 'add', onPress: onCreateAnother }}
        tertiaryAction={{ label: 'Go to Pipeline', onPress: onGoToPipeline }}
      />
    );
  }

  return (
    <SaveResult
      status="error"
      title="Something went wrong"
      message="We couldn't create your deal. This might be a temporary issue. Please try again."
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
