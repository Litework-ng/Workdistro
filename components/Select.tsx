import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable
} from 'react-native';
import { ArrowDown2, ArrowUp2, TickSquare } from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function Select({ 
  label, 
  options, 
  value, 
  onValueChange,
  error,
  placeholder = 'Select an option'
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.selectButtonError
        ]}
        onPress={() => setIsOpen(true)}
      >
        <Text 
          style={[
            styles.selectButtonText,
            !selectedOption && styles.placeholderText
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        {isOpen ? (
          <ArrowUp2 size={20} color={COLOR_VARIABLES.textShade} />
        ) : (
          <ArrowDown2 size={20} color={COLOR_VARIABLES.textShade} />
        )}
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {item.value === value && (
                    <TickSquare 
                      size={20} 
                      color={COLOR_VARIABLES.surfaceSecondary}
                      variant="Bold"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  selectButtonError: {
    borderColor: COLOR_VARIABLES.error,
  },
  selectButtonText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  placeholderText: {
    color: COLOR_VARIABLES.textShade,
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.error,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    maxHeight: '80%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  optionText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
});