import { TodoTask } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TodoItem } from './todo-item';


interface ThemedListProps {
  tasks: TodoTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function ThemedList({ tasks, onToggleTask, onDeleteTask }: ThemedListProps) {

  const separatorColor = useThemeColor({}, 'secondaryBackground');
  const listBackgroundColor = useThemeColor({}, 'background');

  const Separator = () => (
    <View style={[styles.separator, { backgroundColor: separatorColor }]} />
  );

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
      contentContainerStyle={[
        styles.listContainer,
        { backgroundColor: listBackgroundColor }
      ]}
      ItemSeparatorComponent={Separator}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});