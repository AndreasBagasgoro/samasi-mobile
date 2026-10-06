import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { formatDealDate } from '../utils';

export interface DatePickerFieldProps {
  /** Format YYYY-MM-DD */
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (num: number) => String(num).padStart(2, '0');
const toIsoDate = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  error,
}) => {
  const today = new Date();
  const todayIso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const initial = value ? value.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial[0]);
  const [viewMonth, setViewMonth] = useState(initial[1] - 1);

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const handleOpen = () => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      setViewYear(year);
      setViewMonth(month - 1);
    }
    setIsOpen(true);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleSelectDay = (day: number) => {
    onChange(toIsoDate(viewYear, viewMonth, day));
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Feather name="calendar" size={16} color={value ? Colors.primary : Colors.text.disabled} />
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value ? formatDealDate(value) : placeholder}
        </Text>
        {value ? (
          <TouchableOpacity onPress={() => onChange(null)} hitSlop={8} accessibilityLabel="Clear date">
            <Feather name="x-circle" size={16} color={Colors.text.disabled} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.monthRow}>
                  <TouchableOpacity style={styles.navButton} onPress={() => shiftMonth(-1)}>
                    <Feather name="chevron-left" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.monthText}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </Text>
                  <TouchableOpacity style={styles.navButton} onPress={() => shiftMonth(1)}>
                    <Feather name="chevron-right" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                  {WEEKDAYS.map((weekday) => (
                    <View key={weekday} style={styles.cell}>
                      <Text style={styles.weekdayText}>{weekday}</Text>
                    </View>
                  ))}
                  {calendarCells.map((day, idx) => {
                    if (day === null) return <View key={`empty-${idx}`} style={styles.cell} />;
                    const iso = toIsoDate(viewYear, viewMonth, day);
                    const isSelected = iso === value;
                    const isToday = iso === todayIso;
                    return (
                      <TouchableOpacity
                        key={iso}
                        style={styles.cell}
                        onPress={() => handleSelectDay(day)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.dayCircle,
                            isToday && styles.dayToday,
                            isSelected && styles.daySelected,
                          ]}
                        >
                          <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                            {day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triggerError: {
    borderColor: Colors.semantic.error,
  },
  triggerText: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  errorText: {
    fontSize: 12,
    color: Colors.semantic.error,
    marginTop: 4,
    marginLeft: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 12,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.disabled,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  daySelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  dayTextSelected: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
});
