import React from 'react';


import { PRIORITY_STYLES } from '@/constants/priority';
import { Priority, PriorityFilter } from '@/constants/types';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../base/themed-text';
import { ThemedView } from '../base/themed-view';

interface BadgeProps {
  priority: Priority | PriorityFilter;
  size?: 'small' | 'large';
}

const getBadgeStyles = (priority: Priority | PriorityFilter) => {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Default;
};

export function PriorityBadge({ priority, size = 'small' }: BadgeProps) {
  const priorityStyles = getBadgeStyles(priority);

  const fontSize = size === 'large' ? 14 : 12;
  const padding = size === 'large' ? { paddingHorizontal: 10, paddingVertical: 5 } : { paddingHorizontal: 8, paddingVertical: 4 };

  return (
    <ThemedView
      style={[
        styles.badge,
        padding,
        { backgroundColor: priorityStyles.backgroundColor }
      ]}
    >
      <ThemedText
        style={{
          color: priorityStyles.color,
          fontSize: fontSize,
          fontWeight: 'bold'
        }}
        type="default"
      >
        {priority}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});