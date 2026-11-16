import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import Button from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';

// Aba "Conta": mostra quem está logado e permite sair do app.
export default function AccountScreen() {
  const email = auth.currentUser ? auth.currentUser.email : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha conta</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Conectado como</Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Sair" variant="outline" icon="log-out-outline" onPress={() => signOut(auth)} />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  label: {
    ...typography.caption,
  },
  email: {
    ...typography.subtitle,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.md,
  },
});
