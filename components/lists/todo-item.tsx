import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import { ThemedCheckbox } from '@/components/ui/themed-checkbox';
import { TodoTask } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PriorityBadge } from '../ui/priority-badge';


interface RightActionProps {
  progress: SharedValue<number>;
  dragX: SharedValue<number>;
  itemId: string;
}


interface TodoItemProps {
  item: TodoTask;
}

function SwipeRightAction({ dragX, itemId }: RightActionProps) {
  const ACTION_WIDTH = 80;
  const deleteBackgroundColor = useThemeColor({}, 'error');
  const editBackgroundColor = useThemeColor({}, 'edit');
  const deleteTask = useTodoStore(state => state.deleteTask);
  const loadingTaskId = useTodoStore(state => state.loadingTaskId);
  const isLoading = loadingTaskId === itemId;

  const editAnimatedStyle = useAnimatedStyle(() => {
    const startOffset = ACTION_WIDTH * 2;
    return {
      transform: [{ translateX: dragX.value + startOffset }],
    };
  });

  const deleteAnimatedStyle = useAnimatedStyle(() => {
    const startOffset = ACTION_WIDTH;
    return {
      transform: [{ translateX: dragX.value + startOffset }],
    };
  });

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?',
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTask(itemId) }
      ]
    )
  };

  return (
    <ThemedView style={styles.actionContainer}>
      <Reanimated.View style={[styles.rightActionWrapper, editAnimatedStyle]}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: editBackgroundColor }]}
          onPress={() => router.push(`/modal?id=${itemId}`)}
          disabled={isLoading}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          {isLoading ?
            <ActivityIndicator size="small" color="white" /> :
            <Ionicons name="pencil-outline" size={24} color="white" />
          }

          <ThemedText style={styles.deleteText} type="default">Edit</ThemedText>
        </Pressable>
      </Reanimated.View>
      <Reanimated.View style={[styles.rightActionWrapper, deleteAnimatedStyle]}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: deleteBackgroundColor }]}
          onPress={handleDelete}
          disabled={isLoading}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          {isLoading ?
            <ActivityIndicator size="small" color="white" /> :
            <Ionicons name="trash-bin-outline" size={24} color="white" />
          }
          <ThemedText style={styles.deleteText} type="default">Delete</ThemedText>
        </Pressable>
      </Reanimated.View>
    </ThemedView>
  );
}

export function TodoItem({ item }: TodoItemProps) {
  const loadingTaskId = useTodoStore(state => state.loadingTaskId);
  const toggleTask = useTodoStore(state => state.toggleTask);
  const isLoading = loadingTaskId === item.id;
  const separatorColor = useThemeColor({}, 'secondaryBackground');
  const loadingColor = useThemeColor({}, 'text');
  const textDecoration = item.isCompleted ? 'line-through' : 'none';
  const textOpacity = item.isCompleted ? 0.6 : 1;
  const completedStyle = item.isCompleted ? styles.completedItem : {};

  return (
    <ReanimatedSwipeable
      renderRightActions={(progress, dragX) => (
        <SwipeRightAction
          progress={progress}
          dragX={dragX}
          itemId={item.id}
        />
      )}
      rightThreshold={80}
      simultaneousHandlers={isLoading ? [] : undefined}
    >
      <ThemedView style={[styles.contentWrapper, completedStyle, {
        borderBottomColor: separatorColor,
        borderBottomWidth: StyleSheet.hairlineWidth
      }]}>
        <ThemedView style={styles.content}>
          {isLoading ? (
            <ThemedView style={styles.loadingSpinner}>
              <ActivityIndicator size="small" color={loadingColor} />
            </ThemedView>
          ) : (
            <ThemedCheckbox
              checked={item.isCompleted}
              isLoading={isLoading}
              onToggle={(e) => {
                if (e.stopPropagation) e.stopPropagation();
                toggleTask(item.id);
              }}
            />
          )}
          <ThemedView style={styles.textAndPriorityContainer}>
            <ThemedText
              style={{ textDecorationLine: textDecoration, opacity: textOpacity, flexShrink: 1 }}
              type="default"
            >
              {item.text}
            </ThemedText>
            <PriorityBadge priority={item.priority} size="small" />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  deleteSwipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
  },
  editText: {
    color: 'white',
    fontSize: 12,
  },
  itemWrapper: {
    padding: 0,
    width: '100%',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  completedItem: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textAndPriorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  priorityBadge: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 160,
  },
  rightActionWrapper: {
    position: 'absolute',
    height: '100%',
    width: 80,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});