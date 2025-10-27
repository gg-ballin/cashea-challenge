import { Platform } from "react-native";

const LIGHT_GRAY = "#E0E0E0";
const DARK_GRAY = "#333333";
const PRIMARY_BLUE = "#2f95dc";
const SECONDARY_RED_LIGHT = "#FF3B30";
const SECONDARY_RED_DARK = "#FF453A";
const TEXT_LIGHT = "#11181C";
const TEXT_DARK = "#ECEDEE";
const BACKGROUND_LIGHT = "#FFFFFF";
const BACKGROUND_DARK = "#151718";
const TINT_DARK = "#00BFFF";
const EDIT_DARK = "#0A84FF";
const FAB_LIGHT_BG = "#FDFA3D";
const FAB_DARK_BG = "#000000";
const TERTIARY_YELLOW = "#FDFA3D";
const TRANSPARENT = "transparent";

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  edit: string;
  error: string;
  secondaryBackground: string;
  fabBackground: string;
  tertiary: string;
  transparent: string;
}

export const Colors: Record<"light" | "dark", ThemeColors> = {
  light: {
    text: TEXT_LIGHT,
    background: BACKGROUND_LIGHT,
    tint: PRIMARY_BLUE,
    error: SECONDARY_RED_LIGHT,
    secondaryBackground: LIGHT_GRAY,
    edit: PRIMARY_BLUE,
    fabBackground: FAB_LIGHT_BG,
    tertiary: TERTIARY_YELLOW,
    transparent: TRANSPARENT,
  },
  dark: {
    text: TEXT_DARK,
    background: BACKGROUND_DARK,

    tint: TINT_DARK,
    error: SECONDARY_RED_DARK,
    secondaryBackground: DARK_GRAY,
    edit: EDIT_DARK,
    fabBackground: FAB_DARK_BG,
    tertiary: TERTIARY_YELLOW,
    transparent: TRANSPARENT,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
