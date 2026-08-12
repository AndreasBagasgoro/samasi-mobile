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
    status?: 'active' | 'inactive' | string;
    npwp?: string;
    email?: string;
    address?: string;
    billingAddress?: string;
    city?: string;
    onPress?: () => void;
}

export interface ContactPersonItem {
    id?: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatarBackgroundColor?: string;
    onPress?: () => void;
}

export interface DealItem {
    id?: string;
    title: string;
    amount: string;
    stage: string;
    date?: string;
    onPress?: () => void;
}