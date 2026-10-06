import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows, Layout } from '../constants';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface SaveResultBadge {
  label: string;
  bg: string;
  color: string;
}

export interface SaveResultRow {
  label: string;
  value?: string;
  /** Jika diisi, nilai ditampilkan sebagai badge */
  badge?: SaveResultBadge;
}

export interface SaveResultAction {
  label: string;
  onPress?: () => void;
  icon?: IoniconName;
}

export interface SaveResultProps {
  status: 'success' | 'error';
  title: string;
  message: React.ReactNode;
  /** Detail teknis error, mis. kode error dari server */
  errorDetail?: string;
  summaryTitle?: string;
  summaryRows?: SaveResultRow[];
  primaryAction: SaveResultAction;
  secondaryAction?: SaveResultAction;
  tertiaryAction?: SaveResultAction;
}

/** Halaman hasil simpan (sukses / gagal) yang seragam untuk semua modul */
export const SaveResult: React.FC<SaveResultProps> = ({
  status,
  title,
  message,
  errorDetail,
  summaryTitle = 'SUMMARY',
  summaryRows,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}) => {
  const isSuccess = status === 'success';
  const accentColor = isSuccess ? Colors.semantic.success : Colors.semantic.error;
  const accentBg = isSuccess ? Colors.semanticBg.success : Colors.semanticBg.error;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.iconOuter, { backgroundColor: accentBg }]}>
            <View style={[styles.iconInner, { backgroundColor: accentColor }]}>
              <Ionicons
                name={isSuccess ? 'checkmark' : 'alert'}
                size={32}
                color={Colors.text.inverse}
              />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {errorDetail ? <Text style={styles.errorDetail}>Error: {errorDetail}</Text> : null}

          {summaryRows && summaryRows.length > 0 ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{summaryTitle}</Text>
              <View>
                {summaryRows.map((row, idx) => (
                  <View
                    key={row.label}
                    style={[styles.summaryRow, idx === summaryRows.length - 1 && styles.summaryRowLast]}
                  >
                    <Text style={styles.summaryLabel}>{row.label}</Text>
                    {row.badge ? (
                      <View style={[styles.badge, { backgroundColor: row.badge.bg }]}>
                        <Text style={[styles.badgeText, { color: row.badge.color }]} numberOfLines={1}>
                          {row.badge.label}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.summaryValue} numberOfLines={1}>
                        {row.value || '-'}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={primaryAction.onPress}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Gradients.button.colors}
            start={Gradients.button.start}
            end={Gradients.button.end}
            style={StyleSheet.absoluteFill}
          />
          {primaryAction.icon ? (
            <Ionicons name={primaryAction.icon} size={17} color={Colors.text.inverse} />
          ) : null}
          <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
        </TouchableOpacity>

        {secondaryAction ? (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={secondaryAction.onPress}
            activeOpacity={0.75}
          >
            {secondaryAction.icon ? (
              <Ionicons name={secondaryAction.icon} size={17} color={Colors.primary} />
            ) : null}
            <Text style={styles.secondaryButtonText}>{secondaryAction.label}</Text>
          </TouchableOpacity>
        ) : null}

        {tertiaryAction ? (
          <TouchableOpacity
            style={styles.textButton}
            onPress={tertiaryAction.onPress}
            activeOpacity={0.6}
          >
            <Text style={styles.textButtonText}>{tertiaryAction.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  content: {
    alignItems: 'center',
  },

  // Icon
  iconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },

  // Text
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  errorDetail: {
    fontSize: 12.5,
    color: Colors.text.disabled,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: 10,
  },

  // Summary Card
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 24,
    gap: 6,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  summaryLabel: {
    fontSize: 13.5,
    color: Colors.text.secondary,
  },
  summaryValue: {
    flexShrink: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'right',
  },
  badge: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Buttons
  buttonsContainer: {
    gap: 12,
    paddingTop: 8,
  },
  button: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...Shadows.lg,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  secondaryButton: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  textButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});
