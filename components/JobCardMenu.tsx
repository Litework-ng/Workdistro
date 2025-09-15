import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Flag, ClipboardClose } from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';

interface JobCardMenuProps {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onNotBestFit: () => void;
}

const JobCardMenu = ({ visible, onClose, onReport, onNotBestFit }: JobCardMenuProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Pressable
            style={styles.menuItem}
            onPress={onReport}
          >
            <Flag size={20} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.menuText}>Report Task</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={onNotBestFit}
          >
            <ClipboardClose size={20} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.menuText}>Task not best for me</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    padding: SPACING.xs,
    width: '60%',
    maxWidth: 300,
    position:'relative',
    top:90,
    left:40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  menuText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
});

export default JobCardMenu;