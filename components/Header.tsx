import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ArrowBack from '@/assets/icons/ArrowBack.svg';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ title, showBackButton = true, onBackPress }: HeaderProps) {
  const handleGoBack = () => {
    console.log('Back button pressed'); // For debugging
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button (left side) */}
      {showBackButton ? (
        <TouchableOpacity style={styles.sideButton} onPress={handleGoBack}>
          <ArrowBack />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} /> // empty to balance layout
      )}

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right-side placeholder to balance flex space */}
      <View style={styles.sideButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingHorizontal: SPACING.xs,
  },
  sideButton: {
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TEXT_STYLES.header,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
});
