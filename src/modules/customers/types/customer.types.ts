import React from 'react';

export interface FilterItem {
    id?: string;
    label: string;
    value: string;
    selected: boolean;
    onPress?: () => void;
}

export interface CustomerItem {
    id?: string;
    profileInitial: string;
    name: string;
    customerType: string;
    totalContacts: number;
    lastActive: string;
    avatarBackgroundColor?: string;
    avatarTextColor?: string;
    onPress?: () => void;
}