import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddLoanScreen from './src/screens/AddLoanScreen';
import { LoansProvider } from './src/context/LoansContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

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

  let content;

  if (initializing) {
    content = (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  } else if (!user) {
    content = (
      <SafeAreaView style={styles.container}>
        <LoginScreen />
      </SafeAreaView>
    );
  } else {
    // O estado global dos empréstimos só existe com o usuário logado
    content = (
      <LoansProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.primary,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {({ navigation }) => (
                <SafeAreaView style={styles.container}>
                  <HomeScreen onAdd={() => navigation.navigate('AddLoan')} />
                </SafeAreaView>
              )}
            </Stack.Screen>
            <Stack.Screen name="AddLoan" options={{ title: 'Novo empréstimo' }}>
              {({ navigation }) => (
                <SafeAreaView style={styles.container} edges={['bottom']}>
                  <AddLoanScreen onDone={() => navigation.goBack()} />
                </SafeAreaView>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </LoansProvider>
    );
  }

  return <SafeAreaProvider>{content}</SafeAreaProvider>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    justifyContent: 'center',
  },
});