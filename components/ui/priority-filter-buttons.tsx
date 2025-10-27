// components/ui/priority-filter-buttons.tsx

import React from 'react';
import { StyleSheet } from 'react-native';

import { PriorityFilter } from '@/constants/types';
import { useTodoStore } from '@/stores/todoStore';
import { ThemedView } from '../base/themed-view';
import { ThemedButton } from './themed-button';

// All possible priority filter options
const PRIORITY_OPTIONS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

export function PriorityFilterButtons() {
  // Fetch current filter state and the action to update it from Zustand
  const priorityFilter = useTodoStore(state => state.priorityFilter);
  const setPriorityFilter = useTodoStore(state => state.setPriorityFilter);

  return (
    <ThemedView style={styles.container}>
      {PRIORITY_OPTIONS.map(priority => (
        <ThemedButton
          key={priority}
          title={priority}
          onPress={() => setPriorityFilter(priority)}
          // 🚨 Logic to determine active/inactive appearance:
          // Active: Uses 'tertiary' (yellow, high contrast text)
          // Inactive: Uses 'filter' (transparent background, bordered text)
          variant={priorityFilter === priority ? 'tertiary' : 'filter'}
          style={styles.button}
        />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    // Ensure the background is transparent so the main screen background shows through
    backgroundColor: 'transparent',
  },
  button: {
    // Override the minWidth in ThemedButton to allow for a tighter segmented look
    minWidth: 45,
    paddingHorizontal: 8,
    // Add margin for separation if needed
    marginVertical: 4,
  },
});