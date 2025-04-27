import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { useRoleStore } from '@/shared/stores/useRoleStore';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Button from '@/components/Button';
import Input from '@/components/InputField';
import See from '@/assets/icons/See.svg';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import Toast from "react-native-toast-message";


const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .matches(/^[a-zA-Z].*[a-zA-Z]$/, 'Name must start and end with letters')
    .matches(/^[a-zA-Z]+\s+[a-zA-Z]+/, 'Please enter both first and last name')
    .required('Name is required'),
  phone_number: Yup.string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 11 digits')
    .matches(/^[0-9]+$/, 'Phone number must only contain digits')
    .required('Phone is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen() {
  
 
// Update the registerMutation
const registerMutation = useMutation({
  mutationFn: authService.register,
  onSuccess: async (data) => {
    try {

      const phoneNumber = data.user.phone_number;
      console.log('Sending OTP to phone number:', phoneNumber);
      // Send OTP
      await authService.sendOtp({ email: phoneNumber });

      
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please verify your phone number',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });


      // Navigate to OTP screen with phone number
      router.push({
        pathname: '/(auth)/verifyOtp',
        params: { phone: phoneNumber.toString() }
      });
      
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send OTP',
        text2: error?.message || 'Please try again',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      console.log(data.user.phone_number)
      router.push({
        pathname: '/(auth)/verifyOtp',
        params: { phone: data.user.phone_number }
      });
    }
  },
  onError: (error: any) => {
    const errorMessage = error?.message || 'Registration failed';
    Toast.show({
      type: 'error',
      text1: 'Registration Failed',
      text2: errorMessage,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
    console.log('Registration failed:', error);
  },
});
  interface RegisterFormValues {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    confirmPassword: string;
  }
  
  const handleRegister = async (values: RegisterFormValues) => {
    const { confirmPassword, ...registrationData } = values;
    registerMutation.mutate(registrationData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <See style={styles.logo} width={230} height={48} />
          <Text style={styles.title}>Fill in your details</Text>
        </View>

        <Formik
          initialValues={{
            full_name: '',
            phone_number: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
            setFieldValue,
            setFieldTouched,
          }) => {
          
            return (
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => {
                    setFieldTouched('full_name', true);
                    handleBlur('full_name');
                  }}
                  error={touched.full_name ? errors.full_name : undefined}                />

                <Input
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    setFieldTouched('email', true);
                    handleBlur('email');
                    console.log('Email Blur - Error:', errors.email);
                  }}
                  error={touched.email ? errors.email : undefined}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={values.phone_number}
                  onChangeText={handleChange('phone_number')}
                  onBlur={() => {
                    setFieldTouched('phone_number', true);
                    handleBlur('phone_number');
                  }}
                  error={touched.phone_number ? errors.phone_number : undefined}
                  keyboardType="phone-pad"
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
                  error={touched.password ? errors.password: undefined}
                  secureTextEntry
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={() => {
                    setFieldTouched('confirmPassword', true);
                    handleBlur('confirmPassword');
                  }}
                  error={touched.confirmPassword ? errors.confirmPassword: undefined}
                  secureTextEntry
                />

                {/* Terms & Conditions */}
               

                  <Text style={styles.terms}>
                    By signing up you agree to our{' '}
                    <Text 
                      style={styles.termsLink} 
                      onPress={() => {
                        // TODO: Navigate to terms and conditions
                        router.push('/(legal)/terms');
                      }}
                      >
                      terms and conditions
                    </Text>
                  </Text>
                <View style={styles.footer}>
                  <Button
                    text="Create Account"
                    onPress={() => {
                      console.log('Submit Pressed - Current Errors:', errors);
                      handleSubmit();
                    }}
                    loading={registerMutation.isPending}
                    disabled={registerMutation.isPending}
                    variant="secondary"
                    fullWidth
                  />
                  <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text 
                      style={styles.loginLink} 
                      onPress={() => router.push('/(auth)/login')}
                      >
                      Login
                    </Text>
                  </Text>
                </View>
              </View>
            );
          }}
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
  },
  logo: {
    marginBottom: SPACING.alt,
    alignSelf: 'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.sm,
  },
  form: {
    gap: SPACING.md,
  },
  checkboxContainer: {
    marginTop: SPACING.sm,
  },
 
  errorText: {
    ...TEXT_STYLES.body,
    color: 'red',
    marginTop: 4,
  },
  footer: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    alignItems:'center',
  },
  loginText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
  loginLink: {
    fontFamily: TEXT_STYLES.title.fontFamily, 
    color: COLOR_VARIABLES.textsurfaceSecondary,
  },
  terms: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  termsLink: {
    fontFamily: TEXT_STYLES.title.fontFamily, 
    color: COLOR_VARIABLES.textsurfaceSecondary,
  },
  toast: {
    padding: SPACING.md,
    borderRadius: 8,
    marginHorizontal: SPACING.md,
  },
  errorToast: {
    backgroundColor: COLOR_VARIABLES.dangerText,
  },
  successToast: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  toastTitle: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.surfacePrimary,
    marginBottom: SPACING.xs,
  },
  toastMessage: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.surfacePrimary,
  },
});

