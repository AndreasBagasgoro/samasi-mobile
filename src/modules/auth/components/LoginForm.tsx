import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from '@shared/components';
import { Colors } from '@shared/constants';
import { useLoginForm } from '../hooks';
import { useAuth } from '../hooks';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.formHeading}>
        <Text style={styles.formTitle}>Sign in</Text>
        <Text style={styles.formSubtitle}>Use your company account credentials</Text>
      </View>

      {storeError && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={Colors.semantic.error} />
          <Text style={styles.errorText}>{storeError}</Text>
        </View>
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
          leftIcon={<Ionicons name="person-outline" size={18} color={Colors.primaryLight} />}
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
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.primaryLight} />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          }
        />
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPassword}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

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
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
  },
  formHeading: {
    marginBottom: 24,
    gap: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  formSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 15,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.semanticBg.error,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.semantic.error,
  },
  inputContainerStyle: {
    borderRadius: 14,
    backgroundColor: Colors.background,
  },
  fieldTitle: {
    fontSize: 11,
    color: Colors.text.label,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
});
