import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedInput } from '@/components/ui/themed-textInput';
import { Priority } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';


const { height } = Dimensions.get('window');
const PRIORITY_OPTIONS: Priority[] = ['High', 'Medium', 'Low'];

export default function AddTodoModal() {
  const router = useRouter();

  const [taskText, setTaskText] = useState('');
  const addTask = useTodoStore(state => state.addTask);
  const isAddingTask = useTodoStore(state => state.isAddingTask);
  const [priority, setPriority] = useState<Priority>('Medium');
  const isLoading = isAddingTask;
  const editPriority = priority;
  const separatorColor = useThemeColor({}, 'secondaryBackground');


  const handleAddTask = () => {
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    setPriority(priority || 'Medium');

    const newTask = {
      text: taskText.trim(),
      isCompleted: false,
      priority: priority,
      platform: Platform.OS as 'ios' | 'android',
    };
    addTask(newTask);
    setTaskText('');
    closeModal();
  };

  const closeModal = () => {
    router.canGoBack() && router.back();
  };
  const handleChangePriority = (priority: Priority) => {
    setPriority(priority);
  }

  return (
    <TouchableWithoutFeedback style={styles.outerContainer} onPress={closeModal}>
      <ThemedView style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={[styles.modalContent, { height: Platform.OS === 'ios' ? height * 0.7 : undefined }]}>

            <ThemedText type="title" style={styles.title}>Add new task</ThemedText>
            <View style={styles.divider} />
            <ThemedView style={styles.inputContainer}>
              <ThemedInput
                value={taskText}
                onChangeText={setTaskText}
                placeholder="Task description"
                style={styles.input}
                autoFocus
              />

            </ThemedView>
            <View style={[styles.divider, { borderBottomColor: separatorColor }]} />
            <ThemedView style={styles.priorityRow}>
              <ThemedText type="defaultSemiBold">Priority:</ThemedText>
              {PRIORITY_OPTIONS.map(priority => (
                <ThemedButton
                  title={priority}
                  key={priority}
                  variant={editPriority === priority ? 'tertiary' : 'filter'}
                  onPress={() => handleChangePriority(priority)}
                  style={editPriority === priority && styles.button}
                >
                </ThemedButton>
              ))}
            </ThemedView>
            <ThemedButton
              title="Add"
              onPress={handleAddTask}
              disabled={isLoading}
              loading={isLoading}
              variant="tertiary"
            />
          </ThemedView>
        </TouchableWithoutFeedback>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    width: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priorityRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    borderRadius: 15,
    padding: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});