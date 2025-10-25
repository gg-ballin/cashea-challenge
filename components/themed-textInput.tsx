// components/themed-input.tsx

import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, type TextInputProps } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};
const width = Dimensions.get('window').width;
export function ThemedInput({ style, lightColor, darkColor, ...otherProps }: ThemedInputProps) {

  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderColor = useThemeColor({}, 'icon');

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: textColor,

          borderColor: borderColor,
        },
        style,
      ]}
      autoCorrect={false}
      autoCapitalize="none"
      placeholderTextColor={placeholderColor}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: width * 0.7,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
  },
});