import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import Button from '@/components/Button';
import { authService } from '@/services/auth';
import ArrowBack from '@/assets/icons/ArrowBack.svg';
import { Alert } from '@/components/Alert';
import { useAuthStore } from '@/shared/stores/useAuthStore';

import { useRoleStore } from '@/shared/stores/useRoleStore';
import SuccessIcon from '@/assets/icons/Success.svg';

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState<string>('');
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { phone } = useLocalSearchParams();
  const formattedPhone = phone ? String(phone).replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3') : '';
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { selectedRole } = useRoleStore();
  const { setAuth } = useAuthStore();
  
  
  useEffect(() => {

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setIsResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { email, registrationData } = useLocalSearchParams<{ 
    email: string;
    registrationData: string;
  }>();
  const parsedRegistrationData = JSON.parse(registrationData);


  const verifyMutation = useMutation({
  mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
    console.log("🚀 Verifying OTP for email:", email, "with code:", otp);

    const otpResult = await authService.verifyOtp({ email, otp });
    console.log("📦 OTP verify response:", otpResult);

    const userData = JSON.parse(registrationData);
    const regResult = await authService.register(userData);

    console.log("📦 Registration response:", regResult);
    return regResult;
  },
  onSuccess: () => {
    Toast.show({
      type: 'success',
      text1: 'Registration Successful',
      text2: 'Please login with your credentials',
      position: 'top',
      visibilityTime: 4000,
    });
    router.replace('/(auth)/login');
  },
  onError: (error: any) => {
    console.error("❌ OTP verify failed:", error.response?.data || error.message);
    Toast.show({
      type: 'error',
      text1: 'Verification Failed',
      text2: error?.response?.data?.message || error?.message || 'Please try again',
      position: 'top',
      visibilityTime: 4000,
    });
  },
});


  const resendMutation = useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'OTP sent',
        text2: 'Please check your email',
        position: 'top',
        visibilityTime: 4000,
      });
      setCountdown(60);
      setIsResendDisabled(true);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to Resend',
        text2: error?.message || 'Please try again',
        position: 'top',
        visibilityTime: 4000,
      });
    },
  });

  const handleVerifyOtp = () => {
    if (otp.length !== 4) return;
    verifyMutation.mutate({ email, otp });
  };
  const handleResendOtp = () => {
    if (isResendDisabled) return;
    resendMutation.mutate({ email, registrationData: parsedRegistrationData });
  };

  const handleNavigation = () => {
    setShowSuccessAlert(false);
    if (selectedRole === 'worker') {
      router.push('/(auth)/login');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowBack width={24} height={24} color={COLOR_VARIABLES.textSurfaceGen} />   
            </Pressable>
            <Text style={styles.title}>Verification</Text>
          </View>
            <Text style={styles.subtitle}>
            Please enter the 4-digit code we sent to{' '}
            <Text style={styles.phoneText}>{formattedPhone}</Text>
          </Text>

          <OtpInput
            numberOfDigits={4}
            onTextChange={setOtp}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpDigit,
              focusStickStyle: styles.focusStick,
              filledPinCodeContainerStyle: styles.otpFilled,
              focusedPinCodeContainerStyle: styles.otpFocused,
            }}
          />

          <View style={styles.footer}>
            <Button
              text="Verify"
              onPress={handleVerifyOtp}
              loading={verifyMutation.isPending}
              disabled={otp.length !== 4 || verifyMutation.isPending}
              variant="secondary"
              fullWidth
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={isResendDisabled || resendMutation.isPending}
              >
                <Text style={[styles.resendLink, isResendDisabled && styles.disabledText]}>
                  Resend Code {isResendDisabled ? `(${countdown}s)` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Alert
        visible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        variant="action"
        icon={<SuccessIcon width={48} height={48} />}
        title="Verification Successful"
        description={
          selectedRole === 'worker' 
            ? "Great! Let's set up your worker profile"
            : "You're all set! Please login to continue"
        }
        primaryAction={{
          label: selectedRole === 'worker' ? "Continue" : "Login",
          onPress: handleNavigation,
          loading: false
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  content: {
    flex: 1,
    paddingVertical:SPACING.xl,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"flex-start",
    gap:"20%",
    marginVertical: SPACING.xl,
    
  },
  backButton:{
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.sm,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLOR_VARIABLES.textSurfaceGen,
   
  },
  subtitle: {
    ...TEXT_STYLES.label,
    textAlign:'center',
    width:290,
    alignSelf: 'center',
  },
  phoneText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  otpContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    marginVertical: SPACING.xl,
    marginTop:100,
  },
  otpDigit: {
    width: 48,
    height: 48,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
  },
  otpFilled: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderColor: COLOR_VARIABLES.surfaceSecondary,
  },
  otpFocused: {
    borderColor: COLOR_VARIABLES.surfaceSecondary,
  },
  focusStick: {
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
  },
  footer: {
    gap: SPACING.xl,
    alignItems: 'center', 
    marginTop:20,
    
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  resendLink: {
    fontFamily:TEXT_STYLES.title.fontFamily,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  disabledText: {
    opacity: 0.5,
  },
});