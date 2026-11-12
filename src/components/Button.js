import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const VARIANTS = {
  primary: { background: colors.primary, text: colors.white, border: colors.primary },
  secondary: { background: colors.primarySoft, text: colors.primary, border: colors.primarySoft },
  outline: { background: colors.surface, text: colors.primary, border: colors.primary },
  danger: { background: colors.dangerSoft, text: colors.danger, border: colors.dangerSoft },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const theme = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.background, borderColor: theme.border },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={theme.text} style={styles.icon} /> : null}
          <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  icon: {
    marginRight: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
