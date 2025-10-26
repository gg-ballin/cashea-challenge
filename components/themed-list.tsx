import { TodoTask } from '@/constants/types';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TodoItem } from './todo-item';


interface ThemedListProps {
  tasks: TodoTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function ThemedList({ tasks, onToggleTask, onDeleteTask }: ThemedListProps) {

  const renderItem = ({ item }: { item: TodoTask }) => (
    <TodoItem
      item={item}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
    />
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});