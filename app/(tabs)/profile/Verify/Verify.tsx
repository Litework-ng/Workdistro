import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { authService } from "@/services/auth";
import Header from "@/components/Header";
import Input from "@/components/InputField";
import Button from "@/components/Button";
import { SPACING } from '@/constants/theme/Spacing';

export default function VerifyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [phone, setPhone] = useState(user?.phone_number || "");
  const [otpSent, setOtpSent] = useState(true);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.is_verified) {
      router.replace("/VerifiedSuccessScreen");
    }
  }, [user]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await authService.sendPhoneOtp(phone);
      setOtpSent(true);
    } catch (error) {
      console.error("Send OTP failed:", error);
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      // Replace this with your real OTP verification logic
      const valid = true; // Replace with actual verification

      if (!valid) {
        Alert.alert("Invalid OTP");
        return;
      }

      // ✅ Proceed to Identity Verification Screen
      router.replace("/(tabs)/profile/Verify/IdentityVerification");
    } catch (error) {
      console.error("Verification failed:", error);
      Alert.alert("Error", "Verification process failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Verification" />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Verify your phone number
        </Text>

        <Input
          label="Phone Number"
          placeholder="08000000000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!otpSent}
        />

        {otpSent && (
          <Input
            label="Enter OTP"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
        )}
        <View style={{ paddingVertical: SPACING.xxl }}>
          <Button
            text={
              loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"
            }
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading || (!phone && !otpSent) || (otpSent && !otp)}
            variant="secondary"
          />
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      </View>
    </View>
  );
}
