import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';

interface ClientFeedbackProps {
  visible: boolean;
  image: any;
  title: string;
  subtext: string;
  onClose: () => void;
  onNext: () => void;
  isJobAccepted?: boolean;
}
const ClientFeedback: React.FC<ClientFeedbackProps> = ({
  visible,
  image,
  title,
  subtext,
  onClose,
  onNext,
  isJobAccepted,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Image source={image} style={styles.image} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtext}>{subtext}</Text>
          <TouchableOpacity
            onPress={isJobAccepted ? onNext : onClose}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{isJobAccepted ? 'Next' : 'Ok'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ClientFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 335,
    padding: SPACING.lg,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 14,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: SPACING.lg,
    resizeMode: 'contain',
  },
  title: {
    ...TEXT_STYLES.body,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
  subtext: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    width: 224,
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_VARIABLES.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    ...TEXT_STYLES.buttonText,
    color: COLOR_VARIABLES.onPrimary,
    fontWeight: '700',
  },
});

