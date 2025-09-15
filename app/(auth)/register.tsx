import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
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
import PhoneNumberInput from '@/components/PhoneNumberInput';
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
    .matches(/^[a-zA-Z]+\s+[a-zA-Z]+/, 'Please enter both first and last name'),

    phone_number: Yup.string()
    .matches(/^\+234[0-9]{10}$/, 'Phone number must start with +234 and be 13 digits in total')
    .required('Phone number is required'),
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
  mutationFn: authService.sendOtp,
  onSuccess: async (data, variables) => {
    try {
      const { email } = variables;
      console.log('Sending OTP to email:', email);

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your email for verification code',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });

      // Navigate to OTP screen with registration data
      router.push({
        pathname: '/(auth)/verifyOtp',
        params: {
          email,
          registrationData: JSON.stringify(variables.registrationData)
        }
      });
      
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send OTP',
        text2: error?.message || 'Please try again',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  },
  onError: (error: any) => {
    Toast.show({
      type: 'error',
      text1: 'Failed to Send OTP',
      text2: error?.message || 'Please try again',
      position: 'top',
      visibilityTime: 4000,
    });
  },
});

// Update handleRegister function
const handleRegister = async (values: RegisterFormValues) => {
  const { confirmPassword, ...registrationData } = values;
  
  // First send OTP to email
  registerMutation.mutate({ 
    email: values.email,
    registrationData // Pass registration data to be used after verification
  });
};
  interface RegisterFormValues {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    confirmPassword: string;
  }
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
        <Image source={require("../../assets/images/images/WordLogo.png")}  resizeMode="contain" style={styles.wordLogo}/>
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

                <PhoneNumberInput
                  label="Phone Number"
                  value={values.phone_number}
                  onChangeText={(text) => setFieldValue('phone_number', text)}
                  
                  error={touched.phone_number ? errors.phone_number : undefined}
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
  wordLogo: {
    width: 230,
    height: 74,
    alignSelf:'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginVertical: SPACING.sm,
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
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  terms: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  termsLink: {
    fontFamily: TEXT_STYLES.title.fontFamily, 
    color: COLOR_VARIABLES.textSurfaceSecondary,
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

