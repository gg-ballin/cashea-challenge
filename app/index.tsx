import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedButton } from '@/components/themed-button';
import { ThemedList } from '@/components/themed-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-textInput';
import { ThemedView } from '@/components/themed-view';
import { TodoTask } from '@/constants/types';
import { getRandomPriority } from '@/helpers/helpers';
import { useTodoStore } from '@/stores/todoStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderView from '../components/header-view';



export default function HomeScreen() {
  // Local state for input text remains (should be local)
  const [taskText, setTaskText] = useState('');

  // 🚨 Use the Zustand store selectors instead of useState
  const tasks = useTodoStore(state => state.tasks);
  const addTask = useTodoStore(state => state.addTask);
  const toggleTask = useTodoStore(state => state.toggleTask);
  const deleteTask = useTodoStore(state => state.deleteTask);
  const isHydrated = useTodoStore(state => state.isHydrated); // Loading state

  // No need for separate local handlers, we use the store actions directly

  const handleAddTask = () => {
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: taskText.trim(),
      isCompleted: false,
      priority: getRandomPriority(), // Use the helper
    };

    // 🚨 Use the Zustand action to add the task
    addTask(newTask);
    setTaskText('');
  };

  // 🚨 Hydration Check: Show a loading indicator until data is ready
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
      <HeaderView
        headerBackgroundColor={{ light: '#FDFA3D', dark: '#FDFA3D' }}
        headerImage={
          <Image
            source={require('@/assets/images/cashea_logo.jpg')}
            style={styles.casheaLogo}
          />
        } />
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
            variant="primary"
          />
        </ThemedView>
        <ThemedList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  stepContainer: {
    backgroundColor: 'white',
    flex: 1,
    gap: 8,
    marginBottom: 8,
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
});
