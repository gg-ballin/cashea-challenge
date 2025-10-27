import { Colors } from "@/constants/theme";
import { ColorScheme, useThemePreferenceStore } from "@/stores/themeStore";
import { useColorScheme } from "react-native";

const getEffectiveTheme = (
  preference: ColorScheme,
  systemScheme: "light" | "dark" | null | undefined
): "light" | "dark" => {
  if (preference === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }

  return preference;
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const preference = useThemePreferenceStore(
    (state) => state.colorSchemePreference
  );
  const systemScheme = useColorScheme();
  const effectiveTheme = getEffectiveTheme(preference, systemScheme);
  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveTheme][colorName];
  }
}
