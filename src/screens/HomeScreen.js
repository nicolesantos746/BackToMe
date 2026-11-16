import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useLoans } from '../context/LoansContext';
import LoanCard from '../components/LoanCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import FeedbackBanner from '../components/FeedbackBanner';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';

export default function HomeScreen({ onAdd }) {
  // Estado global (Context API + useReducer): lista, loading e mensagens de feedback
  const { loans, loading, feedback, returnLoan, deleteLoan, clearFeedback } = useLoans();

  function confirmRemove(loan) {
    Alert.alert('Excluir empréstimo', `Excluir "${loan.itemName}"? Essa ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteLoan(loan) },
    ]);
  }

  function handlePress(loan) {
    const buttons = [];
    if (!loan.returned) {
      buttons.push({ text: 'Marcar como devolvido', onPress: () => returnLoan(loan) });
    }
    buttons.push({ text: 'Excluir', style: 'destructive', onPress: () => confirmRemove(loan) });
    buttons.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert(loan.itemName, `Para ${loan.borrowerName}`, buttons);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus empréstimos</Text>
      </View>

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LoanCard loan={item} onPress={handlePress} />}
          ListEmptyComponent={
            <EmptyState
              title="Nenhum empréstimo ainda"
              message="Toque em Novo empréstimo para registrar o primeiro."
            />
          }
          contentContainerStyle={loans.length === 0 ? styles.emptyList : styles.list}
        />
      )}

      <View style={styles.footer}>
        <Button title="Novo empréstimo" onPress={() => onAdd && onAdd()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    ...typography.title,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  emptyList: {
    flexGrow: 1,
  },
  footer: {
    padding: spacing.md,
  },
});