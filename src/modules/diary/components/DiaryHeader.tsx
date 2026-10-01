import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, Colors } from '@shared/constants';
import { Input } from '@shared/components';
import { Filter } from './Filter';

interface DiaryHeaderProps {
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    totalCount?: number;
    selectedFilterId?: string;
    onFilterChange?: (filterId: string) => void;
}

export const DiaryHeader: React.FC<DiaryHeaderProps> = ({
    searchValue = '',
    onSearchChange,
    totalCount,
    selectedFilterId,
    onFilterChange,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.diaryText}>My Diary</Text>
                {totalCount !== undefined && (
                    <View style={styles.diaryAmountContainer}>
                        <Text style={styles.diaryAmount}>
                            {totalCount} Entries
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.searchBarContainer}>
                <Input
                    value={searchValue}
                    onChangeText={onSearchChange}
                    leftIcon={
                        <Feather name="search" size={20} color={Colors.text.secondary} />
                    }
                    placeholder="Search customers..."
                    placeholderTextColor={Colors.text.secondary}
                    inputContainerStyle={styles.searchBarContainerStyle}
                />
            </View>
            <Filter
                selectedFilterId={selectedFilterId}
                onFilterChange={onFilterChange}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.screenPaddingHorizontal2,
        paddingTop: 28,
        paddingBottom: 20,
        gap: 16,
        borderBottomWidth: 2,
        borderBottomColor: Colors.border,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    diaryText: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    diaryAmountContainer: {
        backgroundColor: Colors.background2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    diaryAmount: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchBarContainerStyle: {
        backgroundColor: Colors.background2,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
    },
});
