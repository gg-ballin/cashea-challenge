import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle, type PressableProps } from 'react-native';

export type ThemedCheckboxProps = PressableProps & {
  checked: boolean;
  onToggle: (e: any) => void;
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
};

export function ThemedCheckbox({
  checked,
  onToggle,
  style,
  lightColor,
  darkColor,
  isLoading = false,
  ...otherProps
}: ThemedCheckboxProps) {

  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const checkedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tertiary');
  const uncheckedBgColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'text');
  const iconColor = checked ? checkedColor : uncheckedBgColor;

  return (
    <Pressable
      style={[styles.base, style]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      disabled={isLoading}
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
        {isLoading ? (
          <ActivityIndicator size="small" color={tintColor} />
        ) : checked && (
          <Ionicons
            name={'checkmark'}
            size={20}
            color={'black'}
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