// constants/theme.ts

// --- Base Color Constants ---
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
const FAB_LIGHT_BG = "#FFD700"; // Yellow for Light FAB
const FAB_DARK_BG = "#000000"; // Darker Gray for Dark FAB

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  edit: string;
  error: string;
  secondaryBackground: string;
  fabBackground: string; // 🚨 NEW KEY: Dedicated color for the FAB background
}

export const Colors: Record<"light" | "dark", ThemeColors> = {
  light: {
    // Basic UI Colors
    text: TEXT_LIGHT,
    background: BACKGROUND_LIGHT,

    // Functional Colors
    tint: PRIMARY_BLUE,
    error: SECONDARY_RED_LIGHT,
    secondaryBackground: LIGHT_GRAY,
    edit: PRIMARY_BLUE,
    fabBackground: FAB_LIGHT_BG, // 🚨 NEW VALUE
  },
  dark: {
    // Basic UI Colors
    text: TEXT_DARK,
    background: BACKGROUND_DARK,

    // Functional Colors
    tint: TINT_DARK,
    error: SECONDARY_RED_DARK,
    secondaryBackground: DARK_GRAY,
    edit: EDIT_DARK,
    fabBackground: FAB_DARK_BG, // 🚨 NEW VALUE
  },
};

// ... (export const Fonts remains the same)
