import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';
import { ThemedCheckbox } from '@/components/ui/themed-checkbox';
import { Priority, PriorityStyle, TodoTask } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';


interface RightActionProps {
  progress: SharedValue<number>;
  dragX: SharedValue<number>;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  itemId: string;
}
export const PRIORITY_STYLES: Record<Priority | 'Default', PriorityStyle> = {
  'High': { backgroundColor: '#F97070', color: 'white' },
  'Medium': { backgroundColor: '#FFD700', color: 'black' },
  'Low': { backgroundColor: '#48BB78', color: 'white' },
  'Default': { backgroundColor: '#CCCCCC', color: 'black' },
};
interface TodoItemProps {
  item: TodoTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const getPriorityStyles = (priority: Priority): PriorityStyle => {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Default;
};

function SwipeRightAction({ dragX, onDelete, onEdit, itemId }: RightActionProps) {
  const ACTION_WIDTH = 80;
  const deleteBackgroundColor = useThemeColor({}, 'error');
  const editBackgroundColor = useThemeColor({}, 'edit');

  // 🚨 1. ANIMATION FOR EDIT (The leftmost action)
  const editAnimatedStyle = useAnimatedStyle(() => {
    // The EDIT button is the second button from the right. It starts at ACTION_WIDTH * 2 (160)
    // and moves left by the drag amount.
    const startOffset = ACTION_WIDTH * 2;
    return {
      // This ensures the Edit button is always to the left of the Delete button
      transform: [{ translateX: dragX.value + startOffset }],
    };
  });

  // 🚨 2. ANIMATION FOR DELETE (The rightmost action)
  const deleteAnimatedStyle = useAnimatedStyle(() => {
    // The DELETE button is the rightmost action. It starts at ACTION_WIDTH (80)
    // and moves left by the drag amount.
    const startOffset = ACTION_WIDTH;
    return {
      // This ensures the Delete button stays visible on the right edge.
      transform: [{ translateX: dragX.value + startOffset }],
    };
  });

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?',
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(itemId) }
      ]
    )
  };

  const handleEdit = () => {
    // 🚨 IMPORTANT: You must call onEdit here.
    // The current code calls handleDelete for both!
    // Since tapping Edit should likely open the modal, we can use onEdit(itemId)
    // or trigger the navigation logic here.
    onEdit(itemId);
    router.push(`/modal?id=${itemId}`);
  };


  return (
    <ThemedView style={styles.actionContainer}>

      <Reanimated.View style={[styles.rightActionWrapper, editAnimatedStyle]}>
        <Pressable
          // 🚨 Use handleEdit here!
          style={[styles.actionButton, { backgroundColor: editBackgroundColor }]}
          onPress={handleEdit}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
          <ThemedText style={styles.deleteText} type="default">Edit</ThemedText>
        </Pressable>
      </Reanimated.View>

      <Reanimated.View style={[styles.rightActionWrapper, deleteAnimatedStyle]}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: deleteBackgroundColor }]}
          onPress={handleDelete}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Ionicons name="trash-bin-outline" size={24} color="white" />
          <ThemedText style={styles.deleteText} type="default">Delete</ThemedText>
        </Pressable>
      </Reanimated.View>



    </ThemedView>
  );
}

export function TodoItem({ item, onToggle, onDelete, onEdit }: TodoItemProps) {

  const separatorColor = useThemeColor({}, 'secondaryBackground');

  const textDecoration = item.isCompleted ? 'line-through' : 'none';
  const textOpacity = item.isCompleted ? 0.6 : 1;
  const priorityStyles = getPriorityStyles(item.priority);

  const completedStyle = item.isCompleted ? styles.completedItem : {};

  return (
    <ReanimatedSwipeable
      renderRightActions={(progress, dragX) => (
        <SwipeRightAction
          progress={progress}
          dragX={dragX}
          onDelete={onDelete}
          onEdit={onEdit}
          itemId={item.id}
        />
      )}
      rightThreshold={80}
    >
      <Link href={`/modal?id=${item.id}`} style={[styles.itemWrapper]} asChild>

        <ThemedView style={[styles.contentWrapper, completedStyle, {
          borderBottomColor: separatorColor,
          borderBottomWidth: StyleSheet.hairlineWidth
        }]}>
          <ThemedView style={styles.content}>
            <ThemedCheckbox
              checked={item.isCompleted}
              onToggle={(e) => {
                if (e.stopPropagation) e.stopPropagation();
                onToggle(item.id);
              }}
            />
            <ThemedView style={styles.textAndPriorityContainer}>
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
            </ThemedView>

          </ThemedView>

        </ThemedView>
      </Link>
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
    padding: 15,
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
    // This wrapper is needed to correctly stack and position the actions
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 160, // Total width of both buttons
  },
  rightActionWrapper: {
    // Use absolute positioning for Reanimated views inside a row layout
    position: 'absolute',
    height: '100%',
    width: 80,
    // We rely on the translateX animation for positioning
  },
  actionButton: { // Style for the interior Pressable
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});