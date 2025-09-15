// components/Chip.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';

type ChipProps = {
  label: string;
  onPress: () => void;
};

export default function Chip({ label, onPress }: ChipProps) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLOR_VARIABLES.surfaceGen,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.surfaceNeautral,
    alignSelf: 'flex-start',
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
});
