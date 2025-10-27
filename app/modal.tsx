import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedInput } from '@/components/ui/themed-textInput';
import { Priority } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';


const { height } = Dimensions.get('window');
const PRIORITY_OPTIONS: Priority[] = ['High', 'Medium', 'Low'];

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id as string;

  const editTask = useTodoStore(state => state.editTask);
  const tasks = useTodoStore(state => state.tasks);
  const task = tasks.find(t => t.id === taskId);
  const isEditingTask = useTodoStore(state => state.isEditingTask);
  const [editText, setEditText] = useState(task?.text || '');
  const [editPriority, setEditPriority] = useState<Priority>(task?.priority || 'Medium');

  const separatorColor = useThemeColor({}, 'secondaryBackground');

  useEffect(() => {
    if (task) {
      setEditText(task.text);
    }
  }, [task]);


  const handleEdit = () => {
    if (!editText.trim()) {
      Alert.alert("Validation Error", "Task text cannot be empty.");
      return;
    }
    editTask(taskId, {
      text: editText.trim(),
    });
    closeModal();
  };

  const closeModal = () => {
    router.canGoBack() && router.back();
  };
  const handleChangePriority = (priority: Priority) => {
    editTask(taskId, {
      priority: priority,
    });
    setEditPriority(priority);
  }

  if (!task) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="title">Task Not Found</ThemedText>
        <ThemedButton title="Go Back" onPress={closeModal} variant="primary" style={{ marginTop: 20 }} />
      </ThemedView>
    );
  }

  return (
    <TouchableWithoutFeedback style={styles.outerContainer} onPress={closeModal}>
      <ThemedView style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={styles.modalContent}>

            <ThemedText type="title" style={styles.title}>Edit Task</ThemedText>
            <View style={styles.divider} />
            <ThemedView style={styles.inputContainer}>
              <ThemedInput
                value={editText}
                onChangeText={setEditText}
                placeholder="Task description"
                style={styles.input}
              />
              <ThemedButton
                title="Edit"
                onPress={handleEdit}
                disabled={isEditingTask || !editText.trim()}
                loading={isEditingTask || !editText.trim()}
                variant="tertiary"
              />
            </ThemedView>
            <View style={[styles.divider, { borderBottomColor: separatorColor }]} />
            <ThemedView style={styles.priorityRow}>
              <ThemedText type="defaultSemiBold">Priority:</ThemedText>
              {PRIORITY_OPTIONS.map(priority => (
                <ThemedButton
                  title={priority}
                  key={priority}
                  loading={isEditingTask && editPriority === priority}
                  variant={editPriority === priority ? 'tertiary' : 'filter'}
                  onPress={() => handleChangePriority(priority)}
                  style={editPriority === priority && styles.button}
                >
                </ThemedButton>
              ))}
            </ThemedView>
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
    height: height * 0.4,
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
    width: '80%',
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