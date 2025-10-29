import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="edit" options={{
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
          headerShown: false
        }} />
        <Stack.Screen name="add" options={{
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
          headerShown: false
        }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
