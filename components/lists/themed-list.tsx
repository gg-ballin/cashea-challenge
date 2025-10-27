// components/lists/themed-list.tsx

import { TodoTask } from '@/constants/types';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
// 🚨 Importar useThemeColor para el separador
import { useThemeColor } from '@/hooks/use-theme-color';
import { TodoItem } from './todo-item';


interface ThemedListProps {
  tasks: TodoTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updates: Partial<Omit<TodoTask, 'id'>>) => void;
}

export function ThemedList({ tasks, onToggleTask, onDeleteTask, onEditTask }: ThemedListProps) {

  const separatorColor = useThemeColor({}, 'secondaryBackground');
  const listBackgroundColor = useThemeColor({}, 'background');

  // 1. Definir el componente separador
  const Separator = () => (
    // Usa el color temático para el separador
    <View style={[styles.separator, { backgroundColor: separatorColor }]} />
  );

  const renderItem = ({ item }: { item: TodoTask }) => (
    // TodoItem ya usa useThemeColor internamente (por ejemplo, para el fondo)
    <TodoItem
      item={item}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
      onEdit={onEditTask}
    />
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}

      // 🚨 2. Aplicar el color de fondo al contenedor de la lista (opcional, pero mejora la consistencia)
      contentContainerStyle={[
        styles.listContainer,
        { backgroundColor: listBackgroundColor }
      ]}

      ItemSeparatorComponent={Separator}
      style={{ flex: 1 }} // Asegura que la lista ocupe el espacio restante
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 5,
    // El color de fondo se aplica dinámicamente arriba
  },
  separator: {
    height: StyleSheet.hairlineWidth, // Usar hairlineWidth para separadores finos
    // El color se aplica dinámicamente
  },
});