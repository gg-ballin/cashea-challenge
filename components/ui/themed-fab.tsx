import { Colors } from '@/constants/theme';
import { useThemePreferenceStore } from '@/stores/themeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

export function ThemedFAB() {
  const preference = useThemePreferenceStore(state => state.colorSchemePreference);
  const setPreference = useThemePreferenceStore(state => state.setColorSchemePreference);
  const systemScheme = useColorScheme();

  const currentEffectiveTheme = preference === 'system'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : preference;

  const targetTheme = currentEffectiveTheme === 'light' ? 'dark' : 'light';

  const buttonBgColor = Colors[targetTheme].fabBackground;

  const iconColor = Colors[targetTheme].text === Colors.light.text
    ? Colors.light.text
    : Colors.dark.text;

  const iconName = targetTheme === 'light' ? 'sunny-outline' : 'moon-outline';

  const cycleTheme = () => {
    setPreference(targetTheme);
  };

  return (
    <Pressable
      onPress={cycleTheme}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: buttonBgColor,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons name={iconName} size={28} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});