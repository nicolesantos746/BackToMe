import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addLoan } from '../services/loansService';
import { LOAN_TYPES } from '../constants/loanTypes';
import { parseAmount } from '../utils/format';
import Button from '../components/Button';
import Input from '../components/Input';
import FeedbackBanner from '../components/FeedbackBanner';
import { colors, spacing, typography } from '../theme';

// Converte "25/12/2026" em ISO completo (meia-noite no horário local).
// Devolve null se o texto não for uma data válida.
function parseDateBR(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date.toISOString() : null;
}

export default function AddLoanScreen({ onDone }) {
  const [itemType, setItemType] = useState('livro');
  const [itemName, setItemName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [amountText, setAmountText] = useState('');
  const [dueDateText, setDueDateText] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isMoney = itemType === 'dinheiro';

  function validate() {
    const found = {};
    if (!itemName.trim()) found.itemName = 'Informe o que foi emprestado.';
    if (!borrowerName.trim()) found.borrowerName = 'Informe para quem emprestou.';
    if (isMoney) {
      const value = parseAmount(amountText);
      if (Number.isNaN(value) || value <= 0) found.amount = 'Informe um valor maior que zero.';
    }
    if (dueDateText.trim() && !parseDateBR(dueDateText)) {
      found.dueDate = 'Use o formato DD/MM/AAAA.';
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    setSaving(true);
    try {
      await addLoan({
        itemType,
        itemName: itemName.trim(),
        borrowerName: borrowerName.trim(),
        amount: isMoney ? parseAmount(amountText) : null,
        dueDate: dueDateText.trim() ? parseDateBR(dueDateText) : null,
      });
      if (onDone) onDone();
    } catch (error) {
      setFeedback({ type: 'error', message: 'Não foi possível salvar o empréstimo.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.types}>
          {LOAN_TYPES.map((type) => (
            <Button
              key={type.key}
              title={type.label}
              variant={itemType === type.key ? 'primary' : 'outline'}
              onPress={() => setItemType(type.key)}
              disabled={saving}
              style={styles.typeButton}
            />
          ))}
        </View>

        <Input
          label="O que foi emprestado"
          value={itemName}
          onChangeText={setItemName}
          placeholder={isMoney ? 'Ex.: Almoço' : 'Ex.: Furadeira'}
          error={errors.itemName}
        />

        {isMoney ? (
          <Input
            label="Valor (R$)"
            value={amountText}
            onChangeText={setAmountText}
            placeholder="Ex.: 50,00"
            keyboardType="decimal-pad"
            error={errors.amount}
          />
        ) : null}

        <Input
          label="Para quem"
          value={borrowerName}
          onChangeText={setBorrowerName}
          placeholder="Nome da pessoa"
          error={errors.borrowerName}
        />

        <Input
          label="Devolver até (opcional)"
          value={dueDateText}
          onChangeText={setDueDateText}
          placeholder="DD/MM/AAAA"
          keyboardType="numbers-and-punctuation"
          error={errors.dueDate}
        />

        <Button title="Salvar" onPress={handleSave} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  typeButton: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});