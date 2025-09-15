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
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Input from '@/components/InputField';
import Button from '@/components/Button';
import { authService } from '@/services/auth';
import Header from '@/components/Header';
import ResetPasswordIcon from '@/assets/icons/Lock.svg';

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{4}$/, 'OTP must be 4 digits'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
interface ResetPasswordFormValues {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful',
        text2: 'You can now log in with your new password.',
        position: 'top',
        visibilityTime: 4000,
      });
      router.push('/(auth)/login');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Something went wrong. Try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    },
  });

 

  const handleResetPassword = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({
      email: values.email,
      otp: values.otp,
      password: values.password,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Header title="Reset Password" />
          <View style={styles.iconContainer}>
            <ResetPasswordIcon width={98} height={98}  />
          </View>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to your phone and create a new password.
          </Text>
        </View>

        <Formik
          initialValues={{ email: email || '', otp: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
          validateOnChange
          validateOnBlur
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
                label="OTP Code"
                placeholder="Enter 4-digit code"
                value={values.otp}
                onChangeText={handleChange('otp')}
                onBlur={() => {
                  setFieldTouched('otp', true);
                  handleBlur('otp');
                }}
                error={touched.otp ? errors.otp : undefined}
                keyboardType="number-pad"
                maxLength={4}
              />

              <Input
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => {
                  setFieldTouched('password', true);
                  handleBlur('password');
                }}
                error={touched.password ? errors.password : undefined}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={() => {
                  setFieldTouched('confirmPassword', true);
                  handleBlur('confirmPassword');
                }}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />
              <View style={styles.passwordHelperContainer}>
                <Text style={styles.passwordHelperText}>Password must contain:</Text>
                <Text style={styles.passwordRequirement}>• At least 8 characters</Text>
                <Text style={styles.passwordRequirement}>• One uppercase letter</Text>
                <Text style={styles.passwordRequirement}>• One lowercase letter</Text>
                <Text style={styles.passwordRequirement}>• One number</Text>
              </View>

              <View style={styles.footer}>
                <Button
                  text="Reset Password"
                  onPress={() => handleSubmit()}
                  loading={resetPasswordMutation.isPending}
                  disabled={resetPasswordMutation.isPending}
                  variant="secondary"
                  fullWidth
                />

                <Text style={styles.loginText}>
                    Need help?{' '}
                    <Text
                    style={styles.loginLink}
                    onPress={() => router.push('/(auth)/login')}
                    >
                    Contact support
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
    padding: SPACING.sm,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: SPACING.xl,
  },
  subtitle: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  form: {
    gap: SPACING.md,
    padding: SPACING.md,
  },
  footer: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  loginText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
  loginLink: {
    fontFamily: TEXT_STYLES.title.fontFamily,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  passwordHelperContainer: {
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  passwordHelperText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.xs,
  },
  passwordRequirement: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginLeft: SPACING.sm,
  },
});
