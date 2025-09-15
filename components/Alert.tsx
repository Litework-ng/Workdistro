import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import Button from '@/components/Button';
import ArrowBack from '@/assets/icons/ArrowBack.svg';

interface AlertProps {
  visible: boolean;
  onClose: () => void;
  variant: 'info' | 'action' | 'action2' | 'delete';
  icon?: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  showBackIcon?: boolean;
  primaryAction?: {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  onClose,
  variant,
  icon,
  title,
  description,
  showBackIcon = false,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} >
        <View style={styles.container}>
          <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
            {/* Header with optional back icon */}
            {showBackIcon && (
              <Pressable style={styles.backButton} onPress={onClose}>
                <ArrowBack />
              </Pressable>
            )}

            {/* Icon Section */}
            {icon && <View style={styles.iconContainer}>{icon}</View>}

            {/* Content Section */}
            <View style={styles.textContent}>
              <Text style={styles.title}>{title}</Text>
                {typeof description === "string" ? (
                    <Text style={styles.description}>{description}</Text>
                  ) : (
                    description
                  )}
            </View>

            {/* Actions Section */}
            {(variant === 'action' || variant === 'action2' || variant === 'delete') && (
              <View style={[
                styles.actions,
                (variant === 'action2' || variant === 'delete') && styles.actionsDouble,
              ]}>
                 {variant !== 'action' && secondaryAction && (
                  <Button
                    text={secondaryAction.label}
                    onPress={secondaryAction.onPress}
                    loading={secondaryAction.loading}
                    disabled={secondaryAction.disabled}
                    variant="outline"
                    fullWidth
                  />
                )}
                {primaryAction && (
                  <Button
                    text={primaryAction.label}
                    onPress={primaryAction.onPress}
                    loading={primaryAction.loading}
                    disabled={primaryAction.disabled}
                    variant={variant === 'delete' ? 'danger' : 'secondary'}
                    fullWidth={variant !== 'action2'}
                  />
                )}
              </View>
            )}
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
  container: {
    width: '90%',
    maxWidth: 340,
  },
  content: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderPrimary,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 1,
  },
  iconContainer: {
    marginVertical: SPACING.xl,
    alignItems: 'center',
  },
  textContent: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.subHeader,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  description: {
    ...TEXT_STYLES.description,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  actions: {
    gap: SPACING.md,
  },
  actionsDouble: {
    flexDirection: 'column-reverse', 
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
});