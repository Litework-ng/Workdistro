import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ArrowBack from '@/assets/icons/ArrowBack.svg';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <ArrowBack />
      </TouchableOpacity>

      <View style={styles.rightSpacer} />
      <Text style={styles.title}>{title}</Text>

      {/* Invisible spacer to center the title */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
     ...TEXT_STYLES.h1,
     color: COLOR_VARIABLES.textSurfaceGen,
     marginBottom: SPACING.xs,
     marginRight:80,
  },
  rightSpacer: {
    width: 50, // same width as the icon to keep title centered
    backgroundColor:'red'
  },
});
