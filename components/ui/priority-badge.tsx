// components/ui/priority-badge.tsx (Nuevo Componente)

import { PRIORITY_STYLES } from '@/components/lists/todo-item';
import { Priority, PriorityFilter } from '@/constants/types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../base/themed-text';
import { ThemedView } from '../base/themed-view';

interface PriorityBadgeProps {
  priority: Priority | PriorityFilter;
  size?: 'small' | 'large';
}

// Helper para obtener los estilos del badge (lo que era getPriorityStyles)
const getBadgeStyles = (priority: Priority | PriorityFilter) => {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Default;
};

export function PriorityBadge({ priority, size = 'small' }: PriorityBadgeProps) {
  const priorityStyles = getBadgeStyles(priority);

  // Determinar el tamaño de la fuente y el relleno basado en la prop 'size'
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
    // Otros estilos base
  },
});