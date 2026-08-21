import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../constants';

export interface DropdownItem<T = string | number> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface DropdownProps<T = string | number> {
  label?: string;
  placeholder?: string;
  items: DropdownItem<T>[];
  selectedValue?: T;
  onValueChange?: (value: T, item: DropdownItem<T>) => void;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  modalTitle?: string;
  showSearch?: boolean;
}

export const Dropdown = <T extends string | number>({
  label,
  placeholder = 'Pilih salah satu...',
  items = [],
  selectedValue,
  onValueChange,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputContainerStyle,
  modalTitle,
  showSearch = false,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedItem = useMemo(() => {
    return items.find((item) => String(item.value) === String(selectedValue));
  }, [items, selectedValue]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleSelect = (item: DropdownItem<T>) => {
    onValueChange?.(item.value, item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const shouldShowSearch = showSearch || items.length > 7;

  return (
    <View style={[styles.container, containerStyle]}>
      {Boolean(label) && <Text style={styles.label}>{label}</Text>}

      {/* Trigger Button */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          inputContainerStyle,
          isOpen && styles.inputFocused,
          error ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
        onPress={handleOpen}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <Text
          style={[
            styles.valueText,
            !selectedItem && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>

        <View style={styles.rightIcon}>
          {rightIcon ? (
            rightIcon
          ) : (
            <Feather
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={disabled ? Colors.text.disabled : Colors.text.secondary}
            />
          )}
        </View>
      </TouchableOpacity>

      {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}

      {/* Options Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {modalTitle || label || placeholder}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Feather name="x" size={20} color={Colors.text.primary} />
                  </TouchableOpacity>
                </View>

                {/* Search Bar (if enabled or items > 7) */}
                {shouldShowSearch && (
                  <View style={styles.searchContainer}>
                    <Feather
                      name="search"
                      size={16}
                      color={Colors.text.secondary}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Cari..."
                      placeholderTextColor={Colors.text.disabled}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Feather name="x-circle" size={16} color={Colors.text.disabled} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Items List */}
                <FlatList
                  data={filteredItems}
                  keyExtractor={(item, index) => String(item.value ?? index)}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    const isSelected = String(item.value) === String(selectedValue);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.itemRow,
                          isSelected && styles.itemRowSelected,
                        ]}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.7}
                      >
                        {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
                        <Text
                          style={[
                            styles.itemLabel,
                            isSelected && styles.itemLabelSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Feather
                            name="check"
                            size={18}
                            color={Colors.semantic.info}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Tidak ada pilihan yang cocok</Text>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  label: {
    ...Typography.styles.body,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: Colors.surface,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.text.disabled,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.semantic.error,
  },
  inputDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  valueText: {
    flex: 1,
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 14,
  },
  placeholderText: {
    color: Colors.text.disabled,
  },
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    marginTop: Spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: Colors.background2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    paddingVertical: 4,
    outlineStyle: 'none',
  } as any,
  list: {
    maxHeight: 350,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemRowSelected: {
    backgroundColor: Colors.semanticBg.info,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  itemLabelSelected: {
    fontWeight: '600',
    color: Colors.semantic.info,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});

export default Dropdown;
