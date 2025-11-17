import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './contexts/ThemeContext';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Simplesmente redireciona para splash na inicialização
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 0);

    return () => clearTimeout(timer);
  }, []); // ← Array vazio = executa apenas uma vez

  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="ferry-details" />
        <Stack.Screen name="not-found" />
      </Stack>
    </ThemeProvider>
  );
}