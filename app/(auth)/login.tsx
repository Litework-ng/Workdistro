import React from 'react';
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
import { useServiceStore } from '@/shared/stores/useServiceStore';
import { serviceService } from '@/services/services';
import { useWebSocketStore } from '@/shared/stores/useWebsocketStore';

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
  const { setServices } = useServiceStore();
  const { connect } = useWebSocketStore();
  const loginMutation = useMutation({
    mutationFn: authService.login,
   onSuccess: async (data) => {
  const { user } = data;
  setAuth(data.access_token, user);

  // Determine role
  const roleType = selectedRole === 'worker' ? 'worker' : 'customer';

  // Connect WebSocket immediately after login
  connect(data.access_token, roleType);

  Toast.show({
    type: 'success',
    text1: 'Login Successful',
    text2: 'Welcome back!',
    position: 'top',
    visibilityTime: 4000,
  });

  const services = await serviceService.getServices();
  setServices(services);

  if (selectedRole === 'worker') {
    if (user.is_worker) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/onboarding/selectService');
    }
  } else {
    router.replace('/(tabs)/home');
  }
},
    onError: async (error: any) => {


  let apiMessage = 'Please check your credentials';
  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      apiMessage = error.response.data;
    } else if (error.response.data.message) {
      apiMessage = error.response.data.message;
    } else if (error.response.data.detail) {
      apiMessage = error.response.data.detail;
    } else if (Array.isArray(error.response.data.errors) && error.response.data.errors[0]?.message) {
      apiMessage = error.response.data.errors[0].message;
    }
  }

  Toast.show({
    type: 'error',
    text1: 'Login Failed',
    text2: apiMessage,
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
        <Image source={require("../../assets/images/images/WordLogo.png")}  resizeMode="contain" style={styles.wordLogo}/>
          <Text style={styles.title}>Welcome Back!</Text>
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
    
  },
  wordLogo: {
    width: 230,
    height: 74,
    alignSelf:'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
    textAlign:'left',
   
  },

  form: {
    gap: SPACING.md,
  },
  forgotPassword: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
    textAlign: 'right',
    
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
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
});