import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Layout } from '@shared/constants';
import { Input } from '@shared/components';
import { Filter } from './Filter';
import { FILTER_ITEMS } from '../constants/customer.constants';

interface CustomerHeaderProps {
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    totalCount?: number;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
    searchValue = '',
    onSearchChange,
    totalCount,
}) => {
    const [activeFilterId, setActiveFilterId] = useState('all');

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.customerText}>Customer</Text>
                <View style={styles.customerAmountContainer}>
                    <Text style={styles.customerAmount}>
                        {totalCount !== undefined ? `${totalCount} Customers` : 'Amount'}
                    </Text>
                </View>
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
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContent}
                style={styles.filterScrollView}
            >
                {FILTER_ITEMS.map((item) => {
                    const itemId = item.id ?? item.value;
                    const isSelected = activeFilterId === itemId;
                    return (
                        <Filter
                            key={itemId}
                            label={item.label}
                            value={item.value}
                            selected={isSelected}
                            onPress={() => {
                                setActiveFilterId(itemId);
                                item.onPress?.();
                            }}
                        />
                    );
                })}
            </ScrollView>
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
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: Colors.border,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    customerText: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    customerAmountContainer: {
        backgroundColor: Colors.background2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerAmount: {
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
    filterScrollView: {
        flexGrow: 0,
    },
    filterContent: {
        flexDirection: 'row',
        gap: 8,
    },
});