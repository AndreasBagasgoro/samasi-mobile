import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  style?: ViewStyle;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading = false,
  onPageChange,
  style,
  maxVisiblePages = 10,
}) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const getPageNumbers = useCallback((): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxVisiblePages]);

  if (totalPages <= 1 && !isLoading) return null;

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

  // Info teks: "Showing 1-10 of 11"
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <View style={[styles.container, style]}>
      {/* Info teks opsional */}
      {totalItems !== undefined && startItem && endItem && (
        <Text style={styles.infoText}>
          {startItem}–{endItem} dari {totalItems}
        </Text>
      )}

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.navButton, isFirstPage && styles.navButtonDisabled]}
          onPress={() => !isFirstPage && onPageChange(currentPage - 1)}
          disabled={isFirstPage || isLoading}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={16} color={isFirstPage ? Colors.text.disabled : Colors.primary} />
        </TouchableOpacity>
        {showStartEllipsis && (
          <>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => onPageChange(1)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.pageText}>1</Text>
            </TouchableOpacity>
            <View style={styles.ellipsis}>
              <Text style={styles.ellipsisText}>…</Text>
            </View>
          </>
        )}

        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          return (
            <TouchableOpacity
              key={page}
              style={[styles.pageButton, isActive && styles.pageButtonActive]}
              onPress={() => !isActive && onPageChange(page)}
              disabled={isActive || isLoading}
              activeOpacity={0.7}
            >
              {isLoading && isActive ? (
                <ActivityIndicator size="small" color={Colors.text.inverse} />
              ) : (
                <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
                  {page}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        {showEndEllipsis && (
          <>
            <View style={styles.ellipsis}>
              <Text style={styles.ellipsisText}>…</Text>
            </View>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => onPageChange(totalPages)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.pageText}>{totalPages}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.navButton, isLastPage && styles.navButtonDisabled]}
          onPress={() => !isLastPage && onPageChange(currentPage + 1)}
          disabled={isLastPage || isLoading}
          activeOpacity={0.7}
        >
          <Feather name="chevron-right" size={16} color={isLastPage ? Colors.text.disabled : Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.background2,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  pageTextActive: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  ellipsis: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});
