import { Image } from 'expo-image';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import HeaderView from '@/components/containers/header-view';
import { PriorityFilterDropdown } from '@/components/lists/priority-filter-dropdown-button-list';
import { ThemedList } from '@/components/lists/themed-list';
import { StatusFilterButtons } from '@/components/ui/status-filter-buttons';
import { ThemedActionButton } from '@/components/ui/themed-action-btn';
import { ThemedFAB } from '@/components/ui/themed-fab';
import { Priority } from '@/constants/types';
import { useTodoStore } from '@/stores/todoStore';
import { router } from 'expo-router';


export default function HomeScreen() {
  const allTasks = useTodoStore(state => state.tasks);
  const statusFilter = useTodoStore(state => state.statusFilter);
  const priorityFilter = useTodoStore(state => state.priorityFilter);
  const isHydrated = useTodoStore(state => state.isHydrated);
  const getTasks = useTodoStore(state => state.getTasks);
  const isAddingTask = useTodoStore(state => state.isAddingTask);
  useEffect(() => {
    if (isHydrated) {
      getTasks();
    }
  }, [isHydrated, getTasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let tasks = allTasks.filter(task => {
      const statusMatch =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && task.isCompleted) ||
        (statusFilter === 'Pending' && !task.isCompleted);
      const priorityMatch =
        priorityFilter === 'All' ||
        task.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
    const priorityOrder: Record<Priority, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };

    tasks.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return priorityB - priorityA;
    });

    return tasks;
  }, [allTasks, statusFilter, priorityFilter]);

  if (!isHydrated) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading tasks...</ThemedText>
      </ThemedView>
    );
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <HeaderView
          headerBackgroundColor={{ light: '#FDFA3D', dark: '#3C3C3C' }}
          headerImage={
            <Image
              source={require('@/assets/images/cashea_logo.jpg')}
              style={styles.casheaLogo}
            />
          }
        />

        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles.fullFilterContainer}>
            <ThemedView style={styles.statusFilters}>
              <StatusFilterButtons />
            </ThemedView>
            {isAddingTask && (
              <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
              </ThemedView>
            )}
            <ThemedView style={styles.priorityFilters}>
              <PriorityFilterDropdown />
            </ThemedView>
          </ThemedView>
          <ThemedList tasks={filteredAndSortedTasks} />
        </ThemedView>
      </ThemedView>
      <ThemedFAB />
      <ThemedActionButton onPress={() => router.push('/add')} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    gap: 8,
  },
  casheaLogo: {
    height: '80%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputField: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  fullFilterContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
    gap: 10,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});