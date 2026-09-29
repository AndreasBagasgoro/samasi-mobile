import React, { useMemo } from 'react';
import { Filter as SharedFilter } from '@shared/components/Filter';
import { FilterItem } from '../types';
import { ScrollView, StyleSheet } from 'react-native';
import { useDiaryTypes } from '../hooks/useDiaryTypes';

export interface DiaryFilterProps {
    selectedFilterId?: string;
    onFilterChange?: (filterId: string) => void;
}

export const Filter: React.FC<DiaryFilterProps> = ({
    selectedFilterId = 'all',
    onFilterChange
}) => {
    const { formattedDiaryTypes } = useDiaryTypes();

    const filterItems = useMemo<FilterItem[]>(() => {
        const allItem: FilterItem = {
            id: 'all',
            label: 'All',
            value: 'all',
            selected: selectedFilterId === 'all',
        }

        const typeItems: FilterItem[] = formattedDiaryTypes.map((type, index) => {
            const raw = type as any;
            const rawId = type.interaction_type_id ?? raw.id;
            const id = rawId && rawId !== 'undefined' ? String(rawId) : `type-${index}`;
            return {
                id,
                label: type.interaction_type_name || raw.name || 'General',
                value: id,
                selected: selectedFilterId === id,
            };
        });
        return [allItem, ...typeItems];
    }, [selectedFilterId, formattedDiaryTypes]);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
            style={styles.filterScrollView}>

            {filterItems.map((item, index) => {
                const itemId = (item.id && item.id !== 'undefined') ? item.id : (item.value || `filter-${index}`);
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
    )

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