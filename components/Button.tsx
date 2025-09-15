import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import  {COLOR_VARIABLES}  from "../constants/theme/ColorVariables";
import { TEXT_STYLES } from "../constants/theme/Typography";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text" | "danger";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({ text, onPress, variant = "primary", disabled, loading, fullWidth = false  }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled, fullWidth && styles.fullWidth ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLOR_VARIABLES.buttonText} />
      ) : (
        <Text
          style={[
            TEXT_STYLES.buttonText,
            variant === "text" && styles.textButton,
            variant === "outline" && styles.outlineText, // ← Add this line
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: COLOR_VARIABLES.surfaceGen, // Green
  },
  secondary: {
    backgroundColor: COLOR_VARIABLES.surfaceButton, // Blue
  },
  outline: {
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.surfaceSecondary,
    backgroundColor: "transparent",
   
  },
  outlineText: {
    color: COLOR_VARIABLES.surfaceSecondary, 
  },
  
  text: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: COLOR_VARIABLES.dangerText, // Red
  },
  textButton: {
    color: COLOR_VARIABLES.surfaceGen,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
