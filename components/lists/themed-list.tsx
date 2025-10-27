import { TodoTask } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { EmptyListMessage } from './empty-list';
import { TodoItem } from './todo-item';


interface ThemedListProps {
  tasks: TodoTask[];
}

export function ThemedList({ tasks }: ThemedListProps) {

  const separatorColor = useThemeColor({}, 'secondaryBackground');
  const getTasks = useTodoStore(state => state.getTasks);
  const isRefreshing = useTodoStore(state => state.isRefreshing);
  const listBackgroundColor = useThemeColor({}, 'background');
  const Separator = () => (
    <View style={[styles.separator, { backgroundColor: separatorColor }]} />
  );
  const tintColor = useThemeColor({}, 'tertiary');
  const handleRefresh = () => {
    getTasks(true);
  };
  const renderItem = ({ item }: { item: TodoTask }) => (
    <TodoItem
      item={item} />
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
      ListEmptyComponent={<EmptyListMessage />}
      ItemSeparatorComponent={Separator}
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={tintColor}
        />
      }
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