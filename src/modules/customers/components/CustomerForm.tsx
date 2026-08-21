import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, Layout } from '@shared/constants';
import { Input, Dropdown, TextArea } from '@shared/components';
import { useCustomerTypes } from '../hooks';

export interface CustomerFormData {
    customer_name: string;
    customer_code: string;
    customer_type_id: string;
    npwp: string;
    address: string;
    city: string;
    document_category_id: string;
    payment_terms_day: string;
}

export interface CustomerFormProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
    errors?: Record<string, string>;
    setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    formData,
    setFormData,
    errors,
    setErrors,
}) => {
    const { formattedCustomerTypes } = useCustomerTypes();

    const customerTypeOptions = useMemo(() => {
        return formattedCustomerTypes.map((type) => ({
            label: type.customer_type_name,
            value: String(type.customer_type_id),
        }));
    }, [formattedCustomerTypes]);

    const documentTypeOptions = useMemo(() => {
        return [
            { label: 'Standard / Non-PKP', value: '1' },
            { label: 'PKP / Pajak', value: '2' },
            { label: 'Government / BUMN', value: '3' },
            { label: 'Corporate / Enterprise', value: '4' },
        ];
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.fieldTitle}>CUSTOMER NAME <Text style={{ color: Colors.semantic.error }}>*</Text> </Text>
                <Input
                    placeholder="Ex: Indra Herlambang"
                    value={formData.customer_name}
                    onChangeText={(text) => {
                        setFormData((prev) => ({ ...prev, customer_name: text }));
                        if (errors?.customer_name) {
                            setErrors?.((prev) => ({ ...prev, customer_name: '' }));
                        }
                    }}
                    inputContainerStyle={styles.inputContainerStyle}
                    error={errors?.customer_name}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>CUSTOMER CODE <Text style={{ color: Colors.semantic.error }}>*</Text></Text>
                <Input
                    placeholder="Ex: KAPAL-001"
                    value={formData.customer_code}
                    onChangeText={(text) => {
                        setFormData((prev) => ({ ...prev, customer_code: text }));
                        if (errors?.customer_code) {
                            setErrors?.((prev) => ({ ...prev, customer_code: '' }));
                        }
                    }}
                    inputContainerStyle={styles.inputContainerStyle}
                    error={errors?.customer_code}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>CUSTOMER TYPE <Text style={{ color: Colors.semantic.error }}>*</Text></Text>
                <Dropdown
                    placeholder="Select Customer Type"
                    items={customerTypeOptions}
                    selectedValue={formData.customer_type_id}
                    onValueChange={(val) => {
                        setFormData((prev) => ({ ...prev, customer_type_id: String(val) }));
                        if (errors?.customer_type_id) {
                            setErrors?.((prev) => ({ ...prev, customer_type_id: '' }));
                        }
                    }}
                    inputContainerStyle={styles.inputContainerStyle}
                    error={errors?.customer_type_id}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>NPWP</Text>
                <Input
                    placeholder="Ex: 01.234.567.8-901.000"
                    keyboardType='numeric'
                    value={formData.npwp}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, npwp: text }))}
                    inputContainerStyle={styles.inputContainerStyle}
                />
            </View>

            <View>
                <Text style={styles.fieldTitle}>ADDRESS</Text>
                <TextArea
                    placeholder="Ex: JL Raya Kembangan Selatan No. 10"
                    numberOfLines={3}
                    minHeight={90}
                    value={formData.address}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
                    inputContainerStyle={styles.inputContainerStyle}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>CITY</Text>
                <Input
                    placeholder="Ex: Jakarta"
                    value={formData.city}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
                    inputContainerStyle={styles.inputContainerStyle}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>DOCUMENT TYPE</Text>
                <Dropdown
                    placeholder="Select Document Type"
                    items={documentTypeOptions}
                    selectedValue={formData.document_category_id}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, document_category_id: String(val) }))}
                    inputContainerStyle={styles.inputContainerStyle}
                />
            </View>
            <View>
                <Text style={styles.fieldTitle}>PAYMENT TERMS DAY</Text>
                <Input
                    placeholder="Ex: 30"
                    keyboardType='numeric'
                    value={formData.payment_terms_day}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, payment_terms_day: text }))}
                    inputContainerStyle={styles.inputContainerStyle}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.surface,
        paddingHorizontal: Layout.containerPaddingHorizontal,
        paddingVertical: 36,
    },
    fieldTitle: {
        fontSize: 12,
        color: Colors.text.primary,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainerStyle: {
        borderRadius: 12,
        backgroundColor: Colors.background2,
        borderColor: Colors.border,
        borderWidth: 2,
    },
});