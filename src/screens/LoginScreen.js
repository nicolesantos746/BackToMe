import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Button from '../components/Button';
import Input from '../components/Input';
import FeedbackBanner from '../components/FeedbackBanner';
import { colors, spacing, typography } from '../theme';

function traduzirErro(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com esse e-mail.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/network-request-failed':
      return 'Sem conexão. Verifique sua internet.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    default:
      return 'Não foi possível concluir. Tente novamente.';
  }
}

export default function LoginScreen() {
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isRegister = mode === 'register';

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setFeedback({ type: 'error', message: 'Preencha o e-mail e a senha.' });
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // Ao entrar, o App.js percebe o usuário logado e troca de tela.
    } catch (error) {
      setFeedback({ type: 'error', message: traduzirErro(error.code) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

        <Text style={styles.title}>BackToMe</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
        </Text>

        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          title={isRegister ? 'Criar conta' : 'Entrar'}
          onPress={handleSubmit}
          loading={loading}
        />
        <Button
          title={isRegister ? 'Já tenho conta' : 'Criar uma conta'}
          variant="outline"
          onPress={() => setMode(isRegister ? 'login' : 'register')}
          disabled={loading}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    ...typography.subtitle,
    fontSize: 28,
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});