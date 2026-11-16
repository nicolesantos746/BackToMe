import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const DURATION_MS = 3500;

const STYLES = {
  success: { background: colors.successSoft, color: colors.success, icon: 'checkmark-circle' },
  error: { background: colors.dangerSoft, color: colors.danger, icon: 'alert-circle' },
};

// feedback: { type: 'success' | 'error', message: string } | null
export default function FeedbackBanner({ feedback, onDismiss }) {
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => onDismiss && onDismiss(), DURATION_MS);
    return () => clearTimeout(timer);
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  const theme = STYLES[feedback.type] || STYLES.success;

  return (
    <Pressable
      onPress={onDismiss}
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: theme.background }]}
    >
      <Ionicons name={theme.icon} size={20} color={theme.color} />
      <Text style={[styles.message, { color: theme.color }]}>{feedback.message}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  message: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
});
