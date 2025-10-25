import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle, type PressableProps } from 'react-native';
// Assuming useThemeColor is available at this path

export type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'delete' | 'filter' | 'priority'; // New styling variants
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ThemedButton({ 
  title, 
  variant = 'primary', 
  style, 
  lightColor, 
  darkColor, 
  ...otherProps 
}: ThemedButtonProps) {
  
  // Determine background color based on variant or custom color
  const primaryBg = useThemeColor({ light: lightColor, dark: darkColor }, 'tint'); // Default to 'tint' (a primary color)
  const deleteBg = useThemeColor({}, 'tint'); // Use 'error' for delete actions
  const filterBg = useThemeColor({}, 'tabIconSelected'); // Use a lighter background for filters

  const getBackgroundColor = () => {
    if (variant === 'delete') return deleteBg;
    if (variant === 'filter' || variant === 'priority') return filterBg;
    return primaryBg;
  };

  // Determine text color
  const textColor = variant === 'filter' || variant === 'priority' 
    ? useThemeColor({}, 'text') // Dark text for light filter background
    : useThemeColor({}, 'background'); // Light text for dark/primary backgrounds

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { 
          backgroundColor: getBackgroundColor(), 
          opacity: pressed ? 0.7 : 1, // Visual feedback on press 
        },
        style,
      ]}
      {...otherProps}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});