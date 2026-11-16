import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Ícone de cada aba (versão "cheia" quando a aba está ativa).
const TAB_ICONS = {
  Loans: { active: 'list', inactive: 'list-outline' },
  Account: { active: 'person', inactive: 'person-outline' },
};

// Navegação principal com Bottom Tabs: Empréstimos e Conta.
// A tela de cadastro (AddLoan) fica no Stack do App.js, acima das abas.
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Loans" options={{ title: 'Empréstimos' }}>
        {({ navigation }) => (
          <SafeAreaView style={styles.container} edges={['top']}>
            <HomeScreen onAdd={() => navigation.navigate('AddLoan')} />
          </SafeAreaView>
        )}
      </Tab.Screen>
      <Tab.Screen name="Account" options={{ title: 'Conta' }}>
        {() => (
          <SafeAreaView style={styles.container} edges={['top']}>
            <AccountScreen />
          </SafeAreaView>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
