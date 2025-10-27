import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle, type PressableProps } from 'react-native';

export type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'delete' | 'filter' | 'priority' | 'tertiary' | 'transparent';
  lightColor?: string;
  darkColor?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>
};

export function ThemedButton({
  title,
  variant = 'primary',
  style,
  lightColor,
  loading,
  darkColor,
  ...otherProps
}: ThemedButtonProps) {

  const primaryColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const deleteColor = useThemeColor({}, 'error');
  const tertiaryColor = useThemeColor({}, 'tertiary');
  const filterPriorityBg = useThemeColor({}, 'secondaryBackground');
  const transparentBg = useThemeColor({}, 'transparent');
  const trueBlackColor = Colors.light.text;
  const currentThemeTextColor = useThemeColor({}, 'text');
  const lightTextColor = useThemeColor({}, 'background');

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return primaryColor;
      case 'delete':
        return deleteColor;
      case 'tertiary':
        return tertiaryColor;
      case 'filter':
        return filterPriorityBg;
      case 'priority':
        return filterPriorityBg;
      case 'transparent':
        return transparentBg;
      default:
        return primaryColor;
    }
  };

  const isOpticallyLightBackground =
    variant === 'filter' ||
    variant === 'priority' ||
    variant === 'transparent' ||
    variant === 'tertiary';

  let textColor;

  if (isOpticallyLightBackground) {
    textColor = trueBlackColor;
  } else {
    textColor = lightTextColor;
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: isOpticallyLightBackground ? currentThemeTextColor : lightTextColor,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>}

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