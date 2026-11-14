import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/services/firebase';
import LoginScreen from './src/screens/LoginScreen';
import Button from './src/components/Button';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Avisa sempre que o usuário entra ou sai (e restaura a sessão salva no celular)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <LoginScreen />
      </View>
    );
  }

  // Tela provisória: a lista de empréstimos entra no próximo passo
  return (
    <View style={[styles.container, styles.center]}>
      <Text style={styles.title}>Você está logado</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Button title="Sair" variant="outline" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  email: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});