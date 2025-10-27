import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

export type ColorScheme = "light" | "dark" | "system";
type StorageValue<T> = { state: T };

interface ThemeState {
  colorSchemePreference: ColorScheme;
  setColorSchemePreference: (preference: ColorScheme) => void;
}

const customStorage: PersistStorage<ThemeState> = {
  getItem: async (name: string): Promise<StorageValue<ThemeState> | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ? { state: JSON.parse(value) } : null;
    } catch (e) {
      console.error("AsyncStorage Error (Theme): Failed to load items.", e);
      return null;
    }
  },
  setItem: async (
    name: string,
    value: StorageValue<ThemeState>
  ): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value.state);
      await AsyncStorage.setItem(name, serializedValue);
    } catch (e) {
      console.error("AsyncStorage Error (Theme): Failed to save item.", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.error("AsyncStorage Error (Theme): Failed to remove item.", e);
    }
  },
};

export const useThemePreferenceStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorSchemePreference: "system",

      setColorSchemePreference: (preference) =>
        set({ colorSchemePreference: preference }),
    }),
    {
      name: "theme-storage",
      storage: customStorage,
    }
  )
);
