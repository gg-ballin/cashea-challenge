import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle, type PressableProps } from 'react-native';

export type ThemedCheckboxProps = PressableProps & {
  checked: boolean;
  onToggle: (e: any) => void;
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

  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const checkedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const uncheckedBgColor = useThemeColor({}, 'background');

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
        {checked && (
          <Ionicons
            name={'checkmark'}
            size={20}
            color={'white'}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 5,
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