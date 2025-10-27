import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { TaskStatusFilter } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';
import { ThemedText } from '../base/themed-text';
import { ThemedView } from '../base/themed-view';
import { ThemedButton } from './themed-button';

const STATUS_OPTIONS: TaskStatusFilter[] = ['All', 'Completed', 'Pending'];

interface TaskCountBadgeProps {
  count: number;
}

function TaskCountBadge({ count }: TaskCountBadgeProps) {
  const errorColor = useThemeColor({}, 'error'); // Red color

  if (count === 0) return null;

  return (
    <ThemedView style={[styles.badgeContainer, { backgroundColor: errorColor }]}>
      <ThemedText style={[styles.badgeText, { color: 'white' }]} type="default">
        {count > 99 ? '99+' : count}
      </ThemedText>
    </ThemedView>
  );
}

export function StatusFilterButtons() {
  const statusFilter = useTodoStore(state => state.statusFilter);
  const setStatusFilter = useTodoStore(state => state.setStatusFilter);
  const allTasks = useTodoStore(state => state.tasks);
  const counts = useMemo(() => {
    const completed = allTasks.filter(t => t.isCompleted).length;
    const pending = allTasks.length - completed;

    return {
      All: allTasks.length,
      Completed: completed,
      Pending: pending,
    };
  }, [allTasks]);
  return (
    <ThemedView style={styles.container}>
      {STATUS_OPTIONS.map(status => (
        <ThemedView key={status} style={styles.buttonWrapper}>
          <ThemedButton
            title={status}
            onPress={() => setStatusFilter(status)}
            variant={statusFilter === status ? 'tertiary' : 'filter'}
            style={styles.button}
          />
          <TaskCountBadge count={counts[status]} />
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    minWidth: 80,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 80,
    height: 50,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 16,
  },
});