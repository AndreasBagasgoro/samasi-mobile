import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SaveResult } from '@shared/components';
import { Colors } from '@shared/constants';

export interface DiarySaveResultData {
  customerName: string;
  interactionType: string;
  diaryId?: string;
  errorMessage?: string;
}

export interface DiarySaveResultProps {
  status: 'success' | 'error';
  data: DiarySaveResultData;
  onViewTimeline?: () => void;
  onNewEntry?: () => void;
  onGoToDashboard?: () => void;
  onTryAgain?: () => void;
  onGoBack?: () => void;
}

export const DiarySaveResult: React.FC<DiarySaveResultProps> = ({
  status,
  data,
  onViewTimeline,
  onNewEntry,
  onGoToDashboard,
  onTryAgain,
  onGoBack,
}) => {
  if (status === 'success') {
    return (
      <SaveResult
        status="success"
        title="Diary Saved!"
        message={
          <>
            Your interaction with <Text style={styles.messageBold}>{data.customerName}</Text> has
            been recorded and will sync automatically.
          </>
        }
        summaryTitle="DIARY SUMMARY"
        summaryRows={[
          {
            label: 'Type',
            badge: { label: data.interactionType, bg: Colors.primarySoft, color: Colors.primary },
          },
          { label: 'Customer', value: data.customerName },
          {
            label: 'GPS',
            badge: { label: 'Verified', bg: Colors.semanticBg.success, color: Colors.semantic.success },
          },
        ]}
        primaryAction={{ label: 'View Timeline', icon: 'time-outline', onPress: onViewTimeline }}
        secondaryAction={{ label: 'New Entry', icon: 'add', onPress: onNewEntry }}
        tertiaryAction={{ label: 'Go to Dashboard', onPress: onGoToDashboard }}
      />
    );
  }

  return (
    <SaveResult
      status="error"
      title="Something went wrong"
      message="We couldn't save your diary. This might be a temporary issue. Please try again."
      errorDetail={data.errorMessage}
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
