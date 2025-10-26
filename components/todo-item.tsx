import { ThemedCheckbox } from '@/components/themed-checkbox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Priority, TodoTask } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface RightActionProps {
  progress: SharedValue<number>;
  dragX: SharedValue<number>;
  onDelete: (id: string) => void;
  itemId: string;
}

interface TodoItemProps {
  item: TodoTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case 'High':
      return { backgroundColor: '#FF6347', color: 'white' };
    case 'Medium':
      return { backgroundColor: '#FFD700', color: 'black' };
    case 'Low':
      return { backgroundColor: '#3CB371', color: 'white' };
    default:
      return { backgroundColor: '#CCCCCC', color: 'black' };
  }
};

function SwipeRightAction({ dragX, onDelete, itemId }: RightActionProps) {

  const styleAnimation = useAnimatedStyle(() => {
    const actionWidth = 80;
    return {
      transform: [{ translateX: dragX.value + actionWidth }],
    };
  });

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(itemId) }
      ]
    );
  };

  return (
    <Reanimated.View style={[styles.rightActionWrapper, styleAnimation]}>
      <Pressable
        style={styles.deleteSwipeAction}
        onPress={handleDelete}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
      >
        <Ionicons name="trash-bin-outline" size={24} color="white" />
        <ThemedText style={styles.deleteText} type="default">Delete</ThemedText>
      </Pressable>
    </Reanimated.View>
  );
}
export function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {

  const textDecoration = item.isCompleted ? 'line-through' : 'none';
  const textOpacity = item.isCompleted ? 0.6 : 1;
  const priorityStyles = getPriorityStyles(item.priority);

  return (
    <ReanimatedSwipeable
      renderRightActions={(progress, dragX) => (
        <SwipeRightAction
          progress={progress}
          dragX={dragX}
          onDelete={onDelete}
          itemId={item.id}
        />
      )}
      rightThreshold={80}
    >
      <Link href={`/modal?id=${item.id}`} style={[styles.itemWrapper]} asChild>
        <View style={styles.contentWrapper}>

          <ThemedCheckbox
            checked={item.isCompleted}
            onToggle={(e) => {
              if (e.stopPropagation) e.stopPropagation();
              onToggle(item.id);
            }}
          />

          <View style={styles.textAndPriorityContainer}>
            <ThemedText
              style={{ textDecorationLine: textDecoration, opacity: textOpacity, flexShrink: 1 }}
              type="default"
            >
              {item.text}
            </ThemedText>

            <ThemedView style={[styles.priorityBadge, { backgroundColor: priorityStyles.backgroundColor }]}>
              <ThemedText style={{ color: priorityStyles.color, fontSize: 12 }} type="default">
                {item.priority}
              </ThemedText>
            </ThemedView>
          </View>

        </View>
      </Link>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  rightActionWrapper: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteSwipeAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
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
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textAndPriorityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  priorityBadge: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
});