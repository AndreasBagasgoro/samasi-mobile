import { View, Text, StyleSheet } from 'react-native';

export const MainCard = ({ value, label }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, // Supaya 3 card membagi lebar layar secara rata
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Warna semi-transparan
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  labelText: {
    color: '#94A3B8', // Warna teks agak muted/gray
    fontSize: 12,
    textAlign: 'center',
  },
});