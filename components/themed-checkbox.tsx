import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo for icons
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle, type PressableProps } from 'react-native';

export type ThemedCheckboxProps = PressableProps & {
  checked: boolean;
  onToggle: () => void;
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ThemedCheckbox({ 
  checked, 
  onToggle, 
  style, 
  lightColor, 
  darkColor, 
  ...otherProps 
}: ThemedCheckboxProps) {
  
  // Theme colors
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const checkedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint'); // Primary color when checked
  const uncheckedBgColor = useThemeColor({}, 'background'); // Usually white/light gray when unchecked
  
  // Use the primary/tint color for the icon when checked
  const iconColor = checked ? checkedColor : uncheckedBgColor;

  return (
    <Pressable
      style={[styles.base, style]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      {...otherProps}
    >
      <View 
        style={[
          styles.box, 
          { 
            borderColor: borderColor,
            backgroundColor: iconColor,
          }
        ]}
      >
        {/* Use Ionicons checkmark icon */}
        {checked && (
          <Ionicons 
            name={Platform.OS === 'ios' ? 'checkmark' : 'checkmark'} 
            size={20} 
            color={useThemeColor({}, 'background')} // The icon itself should be the inverse (white/light)
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 5, // Tappable area
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});