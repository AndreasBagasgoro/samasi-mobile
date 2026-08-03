import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader, LoginForm } from '@modules/auth';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AuthHeader
          title="PT. Samudera Makmur Agensi"
          subtitle="Shipping Agency Management System"
        />
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 2,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
    marginTop: 80
  },
});
