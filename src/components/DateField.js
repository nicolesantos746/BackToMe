import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { formatDate } from '../utils/format';

// Seletor de data nativo (recurso nativo: DateTimePicker).
// value: Date (à meia-noite, horário local) ou null | onChange recebe um Date ou null.
export default function DateField({
  label,
  value,
  onChange,
  error,
  minimumDate,
  placeholder = 'Selecionar data',
  disabled = false,
}) {
  const [showIosPicker, setShowIosPicker] = useState(false);
  const pickerValue = value || new Date();

  function handleChange(event, selectedDate) {
    if (event.type === 'set' && selectedDate) {
      // Guarda sempre a meia-noite do dia escolhido (horário local).
      onChange(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      );
    }
  }

  function openPicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickerValue,
        mode: 'date',
        minimumDate,
        onChange: handleChange,
      });
    } else {
      setShowIosPicker((visible) => !visible);
    }
  }

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.field, error ? styles.fieldError : null]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={openPicker}
          disabled={disabled}
          style={styles.pickButton}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={[styles.value, !value && styles.placeholder]}>
            {value ? formatDate(value.toISOString()) : placeholder}
          </Text>
        </Pressable>

        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar data"
            onPress={() => onChange(null)}
            disabled={disabled}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {Platform.OS === 'ios' && showIosPicker ? (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display="inline"
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  pickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  value: {
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
