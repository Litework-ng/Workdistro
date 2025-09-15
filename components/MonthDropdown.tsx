import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList } from "react-native";
import { ArrowDown2 } from "iconsax-react-native";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import { SPACING } from "@/constants/theme/Spacing";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthDropdownProps {
  selectedMonth: string;
  onSelect: (month: string) => void;
}

const MonthDropdown = ({ selectedMonth, onSelect }: MonthDropdownProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (month: string) => {
    onSelect(month);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedMonth}</Text>
        <ArrowDown2 size={18} color={COLOR_VARIABLES.textSurfaceGen}  />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  dropdownText: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: SPACING.md,
  },
  itemContainer: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  itemText: {
    ...TEXT_STYLES.body,
    color:COLOR_VARIABLES.textSurfaceGen,
  },
});

export default MonthDropdown;
