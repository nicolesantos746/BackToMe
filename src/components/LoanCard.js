import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLoanType } from '../constants/loanTypes';
import { formatCurrency, formatDate, isOverdue } from '../utils/format';
import { colors, radius, shadow, spacing, typography } from '../theme';

export default function LoanCard({ loan, onPress }) {
  const type = getLoanType(loan.itemType);
  const overdue = isOverdue(loan);

  return (
    <Pressable
      onPress={() => onPress(loan)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={type.icon} size={24} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {loan.itemName}
          {loan.itemType === 'dinheiro' ? ` · ${formatCurrency(loan.amount)}` : ''}
        </Text>
        <Text style={styles.borrower} numberOfLines={1}>
          Para {loan.borrowerName}
        </Text>
        <Text style={[styles.date, overdue && styles.dateOverdue]}>
          {loan.returned
            ? `Devolvido em ${formatDate(loan.returnedAt)}`
            : `Devolver até ${formatDate(loan.dueDate)}`}
        </Text>
      </View>

      {overdue ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Atrasado</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  title: {
    ...typography.subtitle,
  },
  borrower: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  date: {
    ...typography.caption,
    marginTop: 2,
  },
  dateOverdue: {
    color: colors.danger,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
});
