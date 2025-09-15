import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from './InputField';

type Props = {
  label?: string;
  value: string;
  onChange: (formattedDate: string) => void;
  maximumDate?: Date;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const DateInputField: React.FC<Props> = ({
  label,
  value,
  onChange,
  maximumDate = new Date(),
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      const formatted = formatDate(selectedDate);

      onChange(formatted);
    }
  };

  return (
    <>
      <Pressable onPress={() => setShowPicker(true)}>
        <InputField
          label={label}
          value={value}
          placeholder="YYYY-MM-DD"
          editable={false} // prevent keyboard
          pointerEvents="none" // disables interaction but preserves pressable wrapper
        />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date(2000, 0, 1)}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
};

export default DateInputField;
