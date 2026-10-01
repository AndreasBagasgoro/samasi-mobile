import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
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
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Feather name="check" size={32} color="#16A34A" />
            </View>
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>Diary Saved!</Text>
          <Text style={styles.message}>
            Your interaction with{' '}
            <Text style={styles.messageBold}>{data.customerName}</Text>{' '}
            has been recorded and will sync automatically.
          </Text>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{data.interactionType}</Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Customer</Text>
              <Text style={styles.summaryValue}>{data.customerName}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GPS</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onViewTimeline}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>View Timeline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onNewEntry}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>New Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textButton}
            onPress={onGoToDashboard}
            activeOpacity={0.6}
          >
            <Text style={styles.textButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Error State
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={styles.errorIconOuter}>
          <View style={styles.errorIconInner}>
            <Ionicons name="alert" size={28} color="#DC2626" />
          </View>
        </View>

        {/* Title & Message */}
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          We couldn't load this page. This might be a temporary issue. Please try again.
        </Text>
        {data.errorMessage && (
          <Text style={styles.errorCode}>
            Error: {data.errorMessage}
          </Text>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onTryAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onGoBack}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 32,
  },

  // Success Icon
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#BBF7D0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error Icon
  errorIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  messageBold: {
    fontWeight: '600',
    color: '#334155',
  },
  errorCode: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: 8,
  },

  // Summary Card
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
  },

  // Type Badge
  typeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Verified Badge
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },

  // Buttons
  buttonsContainer: {
    gap: 12,
    paddingTop: 8,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  textButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
});
