import React, { useState } from "react";
import { View, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { walletService } from "@/services/wallet";
import Header from "@/components/Header";
import Input from "@/components/InputField";
import DateInputField from "@/components/DateInputField"
import Button from "@/components/Button";
import { SPACING } from '@/constants/theme/Spacing';
import { date } from "yup";

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [bvn, setBvn] = useState("");
  const [nin, setNin] = useState("");
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyIdentity = async () => {
    setLoading(true);
    try {
      await walletService.createReservedAccount({
        BVN: bvn,
        NIN: nin,
        Name: fullName,
        mobileNo: phone,
        dateOfBirth: dob,
      });
      if (!user || !user.id) {
        Alert.alert("Error", "User data missing.");
        return;
      }
      setUser({
        ...user,
        id: user.id,
        is_verified: true,
      });
      router.replace("/profile/Verify/VerifiedSuccessScreen");
    } catch (error) {
      console.error("Identity verification failed:", error);
      Alert.alert("Error", "Verification or wallet activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Header title="Identity Verification" />
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
            Enter your details to activate your wallet
          </Text>

          <Input
            label="Full Name"
            placeholder="Official name on BVN"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Phone Number"
            placeholder="08000000000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="BVN"
            placeholder="Enter your BVN"
            value={bvn}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/\D/g, '').slice(0, 11);
              setBvn(digitsOnly);
            }}
            keyboardType="number-pad"
          />

          <Input
            label="NIN"
            placeholder="Enter your NIN"
            value={nin}
            onChangeText={(text) => {
              // Allow only alphanumeric characters, and max 11
              const formatted = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11);
              setNin(formatted);
            }}
            keyboardType="default"
          />

         <DateInputField
              label="Date of Birth"
              value={dob}
              onChange={setDob}
            />



          <View style={{ paddingVertical: SPACING.xxl }}>
            <Button
              text={loading ? "Verifying..." : "Verify & Activate Wallet"}
              onPress={handleVerifyIdentity}
              disabled={
                loading ||
                !bvn ||
                !nin ||
                !fullName ||
                !phone ||
                !dob
              }
              variant="secondary"
            />
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}