import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import HeaderView from '@/components/containers/header-view';
import { ThemedList } from '@/components/lists/themed-list';
import { HelloWave } from '@/components/ui/hello-wave';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedFAB } from '@/components/ui/themed-fab';
import { ThemedInput } from '@/components/ui/themed-textInput';
import { TodoTask } from '@/constants/types';
import { getRandomPriority } from '@/helpers/helpers';
import { useTodoStore } from '@/stores/todoStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function HomeScreen() {
  const [taskText, setTaskText] = useState('');

  const allTasks = useTodoStore(state => state.tasks);
  const statusFilter = useTodoStore(state => state.statusFilter);
  const priorityFilter = useTodoStore(state => state.priorityFilter);
  const setStatusFilter = useTodoStore(state => state.setStatusFilter);
  const setPriorityFilter = useTodoStore(state => state.setPriorityFilter);
  const addTask = useTodoStore(state => state.addTask);
  const isHydrated = useTodoStore(state => state.isHydrated);

  const handleAddTask = () => {
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: taskText.trim(),
      isCompleted: false,
      priority: getRandomPriority(),
    };

    addTask(newTask);
    setTaskText('');
  };

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const statusMatch =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && task.isCompleted) ||
        (statusFilter === 'Pending' && !task.isCompleted);
      const priorityMatch =
        priorityFilter === 'All' ||
        task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
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
        <ThemedView style={styles.filterBar}>
          <ThemedButton
            title="All"
            onPress={() => setStatusFilter('All')}
            variant={statusFilter === 'All' ? 'tertiary' : 'filter'}
          />
          <ThemedButton
            title="Completed"
            onPress={() => setStatusFilter('Completed')}
            variant={statusFilter === 'Completed' ? 'tertiary' : 'filter'}
          />
          <ThemedButton
            title="Pending"
            onPress={() => setStatusFilter('Pending')}
            variant={statusFilter === 'Pending' ? 'tertiary' : 'filter'}
          />
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
            />
            <ThemedButton
              title="Add"
              onPress={handleAddTask}
              variant="tertiary"
            />
          </ThemedView>
          {filterButtons()}
          <ThemedList tasks={filteredTasks} />
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
  }
});