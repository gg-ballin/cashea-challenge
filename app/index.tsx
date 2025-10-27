import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import HeaderView from '@/components/containers/header-view';
import { PriorityFilterDropdown } from '@/components/lists/priority-filter-dropdown-button-list';
import { ThemedList } from '@/components/lists/themed-list';
import { HelloWave } from '@/components/ui/hello-wave';
import { StatusFilterButtons } from '@/components/ui/status-filter-buttons';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedFAB } from '@/components/ui/themed-fab';
import { ThemedInput } from '@/components/ui/themed-textInput';
import { Priority } from '@/constants/types';
import { getRandomPriority } from '@/helpers/helpers';
import { useTodoStore } from '@/stores/todoStore';


export default function HomeScreen() {
  const [taskText, setTaskText] = useState('');

  const allTasks = useTodoStore(state => state.tasks);
  const statusFilter = useTodoStore(state => state.statusFilter);
  const priorityFilter = useTodoStore(state => state.priorityFilter);
  const isAddingTask = useTodoStore(state => state.isAddingTask);
  const addTask = useTodoStore(state => state.addTask);
  const isHydrated = useTodoStore(state => state.isHydrated);
  const getTasks = useTodoStore(state => state.getTasks); // 🚨 FETCH getTasks action

  // 🚨 useEffect para cargar las tareas
  useEffect(() => {
    // Si Zustand terminó de cargar los filtros y estados anteriores de AsyncStorage,
    // es seguro cargar los datos frescos de la API.
    if (isHydrated) {
      getTasks();
    }
  }, [isHydrated, getTasks]);
  const handleAddTask = () => {
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    const newTask = {
      text: taskText.trim(),
      isCompleted: false,
      priority: getRandomPriority(),
      platform: Platform.OS as 'ios' | 'android',
    };

    addTask(newTask);
    setTaskText('');
  };

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

    // --- Ordering Logic (Highest Priority/Pending first) ---
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
  const filterButtons = () => {
    return (
      <>
        <ThemedView style={styles.fullFilterContainer}>
          <ThemedView style={styles.statusFilters}>
            <StatusFilterButtons />
          </ThemedView>

          <ThemedView style={styles.priorityFilters}>
            <PriorityFilterDropdown />
          </ThemedView>

        </ThemedView>
      </>
    )
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

        <ThemedView style={styles.titleContainer}>
          <HelloWave />
          <ThemedView style={{ flexDirection: 'column', alignItems: 'center' }}>
            <ThemedText type="middle">Welcome to Cashea's </ThemedText>
            <ThemedText type="middle">coding challenge! </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles.inputContainer}>
            <ThemedInput
              placeholder="Add tasks here"
              value={taskText}
              onChangeText={setTaskText}
              style={styles.inputField}
              editable={!isAddingTask}
            />
            <ThemedButton
              title="Add"
              onPress={handleAddTask}
              disabled={isAddingTask}
              loading={isAddingTask}
              variant="tertiary"
            />
          </ThemedView>
          {filterButtons()}
          <ThemedList tasks={filteredAndSortedTasks} />
        </ThemedView>
      </ThemedView>
      <ThemedFAB />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
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
    flex: 1,
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