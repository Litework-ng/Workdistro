import React, { useState } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import { SPACING } from "@/constants/theme/Spacing";
import EyeOff from "@/assets/icons/EyeOff.svg"
import Eye from "@/assets/icons/Eye.svg"
interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  label?: string;
  error?: string;
  onBlur?: (e: any) => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  onBlur,
  rightIcon,
  leftIcon,
  secureTextEntry = false,
  multiline = false,
  maxLength,
  showCharacterCount = false,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            (isFocused || value) && styles.labelFocused,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.errorBorder,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : null]}
          placeholder={placeholder}
          placeholderTextColor={COLOR_VARIABLES.placeholderText}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          multiline={multiline}
          maxLength={maxLength}
          {...restProps}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye  />}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

     
      <View style={styles.bottomContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        {showCharacterCount && maxLength && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TEXT_STYLES.label,
    marginBottom: SPACING.xs,
    
  },
  labelFocused: {
    color: COLOR_VARIABLES.textSurfaceGen, 
    
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  input: {
    flex: 1,
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  inputWithLeftIcon: {
    marginLeft: SPACING.sm,
  },
  iconContainer: {
    padding:0,
    
  },
  placeholder:{
    fontSize: TEXT_STYLES.caption.fontSize,
  },
  focused: {
    borderColor: COLOR_VARIABLES.surfaceSecondary, // Highlight input when focused
  },
  errorBorder: {
    borderColor: COLOR_VARIABLES.dangerText,
    borderWidth: 1,
  },
  errorText: {
    color: COLOR_VARIABLES.dangerText,
   
    fontSize: 12,
    marginTop: SPACING.xs,
    minHeight: 16, // Keeps space reserved for error text
  },
  multilineContainer: {
    minHeight: 120,
    paddingVertical: SPACING.md,
  },
  multilineInput: {
    height: 'auto',
    textAlignVertical: 'top',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  characterCount: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  }
});

export default InputField;
