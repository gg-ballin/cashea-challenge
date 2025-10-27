import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";
import { ThemedText } from "../base/themed-text";
import { ThemedView } from "../base/themed-view";

// 🚨 1. Nuevo componente para el mensaje de lista vacía
export const EmptyListMessage = () => {
  // Usamos el color de fondo para que el mensaje se adapte al tema
  const background = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.emptyContainer, { backgroundColor: background }]}>
      <ThemedText type="middle" style={styles.emptyText}>
        No tasks found! 🎉
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        Try adding a new task or adjusting your filters.
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyText: {
    marginBottom: 20,
  }
});