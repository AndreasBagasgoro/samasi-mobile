import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from '@shared/components';
import { Colors, Layout } from '@shared/constants';
import { useLoginForm } from '../hooks';
import { useAuth } from '../hooks';
import { Feather } from '@expo/vector-icons';

export const LoginForm = () => {
  const {
    username,
    password,
    errors,
    isLoading,
    setUsername,
    setPassword,
    handleSubmit
  } = useLoginForm();

  const { error: storeError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {storeError && (
        <Text style={styles.errorText}>{storeError}</Text>
      )}

      <View>
        <Text style={styles.fieldTitle}>
          USERNAME
        </Text>
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.username}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>

      <View>
        <Text style={styles.fieldTitle}>
          PASSWORD
        </Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          error={errors.password}
          inputContainerStyle={styles.inputContainerStyle}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          }
        />
      </View>

      <View>
        <Text style={styles.forgotPassword}>
          Forgot Password?
        </Text>
      </View>

      <Button
        title="Login"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Layout.containerPaddingHorizontal,
    paddingVertical: 48,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 12
  },
  toggleText: {
    color: Colors.primary,
    fontSize: 12,
  },
  errorText: {
    color: Colors.semantic.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainerStyle: {
    borderRadius: 12,
  },
  fieldTitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPassword: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
    alignSelf: 'flex-end',
  }
});
