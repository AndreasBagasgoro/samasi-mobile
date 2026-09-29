import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Filter as SharedFilter } from '@shared/components';
import { useCustomerTypes } from '../hooks/useCustomerTypes';
import { FilterItem } from '../types';

export interface CustomerFilterProps {
  selectedFilterId?: string;
  onFilterChange?: (filterId: string) => void;
}

export const Filter: React.FC<CustomerFilterProps> = ({
  selectedFilterId = 'all',
  onFilterChange,
}) => {
  const { formattedCustomerTypes } = useCustomerTypes();

  const filterItems = useMemo<FilterItem[]>(() => {
    const allItem: FilterItem = {
      id: 'all',
      label: 'All',
      value: 'all',
      selected: selectedFilterId === 'all',
    };

    const typeItems: FilterItem[] = formattedCustomerTypes.map((type) => {
      const id = String(type.customer_type_id);
      return {
        id,
        label: type.customer_type_name,
        value: id,
        selected: selectedFilterId === id,
      };
    });

    return [allItem, ...typeItems];
  }, [formattedCustomerTypes, selectedFilterId]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContent}
      style={styles.filterScrollView}
    >
      {filterItems.map((item) => {
        const itemId = item.id ?? item.value;
        const isSelected = selectedFilterId === itemId;
        return (
          <SharedFilter
            key={itemId}
            label={item.label}
            value={item.value}
            selected={isSelected}
            onPress={() => onFilterChange?.(itemId)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterScrollView: {
    flexGrow: 0,
  },
  filterContent: {
    flexDirection: 'row',
    gap: 8,
  },
});


