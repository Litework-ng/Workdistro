// shared/util/verificationUtils.ts

import { Platform, Linking } from "react-native";
import  api  from "@/lib/api"; // adjust to your api instance setup
import { DOJAHSdk } from "dojah-react-native"; // or your configured dojah import

/**
 * Send OTP to user's phone number
 * @param phone string
 * @returns Promise<boolean>
 */
export const sendOTP = async (phone: string): Promise<boolean> => {
  try {
    const response = await api.post("/otp/send/", { phone_number: phone });
    return response.status === 200;
  } catch (error) {
    console.error("sendOTP error:", error);
    return false;
  }
};

/**
 * Verify OTP code
 * @param otp string
 * @returns Promise<boolean>
 */
export const verifyOTP = async (otp: string): Promise<boolean> => {
  try {
    const response = await api.post("/otp/verify/", { otp });
    return response.status === 200;
  } catch (error) {
    console.error("verifyOTP error:", error);
    return false;
  }
};

/**
 * Launch Dojah verification widget
 * @returns Promise<any> Dojah response data or null
 */
export const launchDojah = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    DOJAHSdk.launch(
      {
        appId: process.env.DOJAH_APP_ID!,
        publicKey: process.env.DOJAH_PUBLIC_KEY!,
        type: "custom",
        config: {
          pages: ["nin", "bvn"], // Adjust based on your flow
        },
      },
      (response: any) => {
        if (response?.status === "success") {
          resolve(response.data);
        } else {
          console.error("Dojah failed:", response);
          reject(null);
        }
      }
    );
  });
};
