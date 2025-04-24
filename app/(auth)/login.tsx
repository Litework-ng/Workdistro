import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Button from '@/components/Button';
import Input from '@/components/InputField';
import See from '@/assets/icons/See.svg';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useRoleStore } from '@/shared/stores/useRoleStore';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const { selectedRole } = useRoleStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Set auth token
      setAuth(data.access_token);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
        position: 'top',
        visibilityTime: 4000,
      });

      // Navigate based on role
      if (selectedRole === 'worker') {
        router.replace('/(worker)/home');
      } else {
        router.replace('/(client)/home');
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.message || 'Please check your credentials',
        position: 'top',
        visibilityTime: 4000,
      });
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <See style={styles.logo} width={230} height={48} />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <View style={styles.form}>
              <Input
                label="Email Address"
                placeholder="Enter your email address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => {
                  setFieldTouched('email', true);
                  handleBlur('email');
                }}
                error={touched.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => {
                  setFieldTouched('password', true);
                  handleBlur('password');
                }}
                error={touched.password ? errors.password : undefined}
                secureTextEntry
              />

              <Text 
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/forgotPassword')}
              >
                Forgot Password?
              </Text>

              <View style={styles.footer}>
                <Button
                  text="Login"
                  onPress={() => handleSubmit()}
                  loading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  variant="secondary"
                  fullWidth
                />
                <Text style={styles.registerText}>
                  Don't have an account?{' '}
                  <Text 
                    style={styles.registerLink}
                    onPress={() => router.push('/(auth)/register')}
                  >
                    Create Account
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  logo: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textLight,
  },
  form: {
    gap: SPACING.md,
  },
  forgotPassword: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textsurfaceSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  footer: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  registerText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  registerLink: {
    fontFamily: TEXT_STYLES.title.fontFamily,
    color: COLOR_VARIABLES.textsurfaceSecondary,
  },
});