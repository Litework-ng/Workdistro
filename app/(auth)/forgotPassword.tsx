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
import Input from '@/components/InputField';
import Button from '@/components/Button';
import { authService } from '@/services/auth';
import Lock from '@/assets/icons/Lock.svg';
import Header from '@/components/Header';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

interface ForgotPasswordFormValues {
  email: string;
}
export default function ForgotPasswordScreen() {
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, variables) => {
      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Check your email for reset instructions',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
       router.push({
        pathname: '/(auth)/resetPassword',
        params: { email: variables.email }
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Something went wrong. Try again.',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      
    },
  });


  const handleForgotPassword = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate({ email: values.email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
         <Header title='Forgot Password'/>
         <View style={styles.lockContainer}>
            <Lock />
         </View>
          <Text style={styles.subtitle}>
            Please enter your email below and we will send you a code.
          </Text>
        </View>

        <Formik
          initialValues={{email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleForgotPassword}
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
                label="Email"
                placeholder="Enter your email"
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

              <View style={styles.footer}>
                <Button
                  text="Send Code"
                  onPress={() => {
                    handleSubmit();
                  }}
                  loading={forgotPasswordMutation.isPending}
                  disabled={forgotPasswordMutation.isPending}
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
  lockContainer: {
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
});
