import React from "react";
import { View, Text, StyleSheet } from "react-native";
import InputField from "./InputField";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  onBlur?: (e: any) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  label,
  onBlur
}) => {
  const handleTextChange = (text: string) => {
    // Remove all non-digits
    let digits = text.replace(/\D/g, "");

    // If the user starts with '0', drop it
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    // Limit to 10 digits
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }

    onChangeText(digits);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.prefixWrapper}>
        <Text style={styles.prefix}>+234</Text>
      </View>
      <View style={{ flex: 1 }}>
        <InputField
          placeholder="8012345678"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          error={error}
          label={label}
          onBlur={onBlur}
          maxLength={10}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  prefixWrapper: {
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    height: 56, // match InputField height
    marginRight: 8
  },
  prefix: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  }
});

export default PhoneInput;
