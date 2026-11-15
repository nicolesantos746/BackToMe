import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { markAsReturned, removeLoan, subscribeLoans } from '../services/loansService';
import LoanCard from '../components/LoanCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import FeedbackBanner from '../components/FeedbackBanner';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';

export default function HomeScreen({ onAdd }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Atualiza a lista sozinha sempre que algo muda no Firestore
    const unsubscribe = subscribeLoans(
      (list) => {
        setLoans(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setFeedback({ type: 'error', message: 'Não foi possível carregar os empréstimos.' });
      }
    );
    return unsubscribe;
  }, []);

  async function handleReturned(loan) {
    try {
      await markAsReturned(loan.id);
      setFeedback({ type: 'success', message: 'Marcado como devolvido.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Não foi possível atualizar o empréstimo.' });
    }
  }

  async function handleRemove(loan) {
    try {
      await removeLoan(loan.id);
      setFeedback({ type: 'success', message: 'Empréstimo excluído.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Não foi possível excluir o empréstimo.' });
    }
  }

  function confirmRemove(loan) {
    Alert.alert('Excluir empréstimo', `Excluir "${loan.itemName}"? Essa ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => handleRemove(loan) },
    ]);
  }

  function handlePress(loan) {
    const buttons = [];
    if (!loan.returned) {
      buttons.push({ text: 'Marcar como devolvido', onPress: () => handleReturned(loan) });
    }
    buttons.push({ text: 'Excluir', style: 'destructive', onPress: () => confirmRemove(loan) });
    buttons.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert(loan.itemName, `Para ${loan.borrowerName}`, buttons);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus empréstimos</Text>
        <Text style={styles.email} numberOfLines={1}>
          {auth.currentUser ? auth.currentUser.email : ''}
        </Text>
      </View>

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

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
        <Button
          title="Sair"
          variant="outline"
          onPress={() => signOut(auth)}
          style={styles.signOut}
        />
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
  email: {
    ...typography.caption,
    marginTop: spacing.xs,
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
  signOut: {
    marginTop: spacing.sm,
  },
});