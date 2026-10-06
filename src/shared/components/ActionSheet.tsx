import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface ActionSheetItem {
  key: string;
  label: string;
  icon: IoniconName;
  destructive?: boolean;
  onPress: () => void;
}

export interface ActionSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  items: ActionSheetItem[];
  onClose: () => void;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({ visible, title, subtitle, items, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                {Boolean(subtitle) && (
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityLabel="Tutup"
              >
                <Feather name="x" size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.list}>
              {items.map((item) => {
                const tint = item.destructive ? Colors.semantic.error : Colors.primary;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.row}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: item.destructive ? Colors.semanticBg.error : Colors.primarySoft },
                      ]}
                    >
                      <Ionicons name={item.icon} size={18} color={tint} />
                    </View>
                    <Text style={[styles.label, item.destructive && { color: Colors.semantic.error }]}>
                      {item.label}
                    </Text>
                    <Feather name="chevron-right" size={18} color={Colors.text.disabled} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
});

export default ActionSheet;
