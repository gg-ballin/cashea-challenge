// components/ui/status-filter-buttons.tsx (Nuevo Componente)

import React from 'react';
import { StyleSheet } from 'react-native';

import { TaskStatusFilter } from '@/constants/types';
import { useTodoStore } from '@/stores/todoStore';
import { ThemedView } from '../base/themed-view';
import { ThemedButton } from './themed-button';

// Definición de las opciones disponibles para el filtro de estado
const STATUS_OPTIONS: TaskStatusFilter[] = ['All', 'Completed', 'Pending'];

export function StatusFilterButtons() {
  // Obtener el estado actual del filtro y la acción para cambiarlo
  const statusFilter = useTodoStore(state => state.statusFilter);
  const setStatusFilter = useTodoStore(state => state.setStatusFilter);

  return (
    <ThemedView style={styles.container}>
      {STATUS_OPTIONS.map(status => (
        <ThemedButton
          key={status}
          title={status}
          onPress={() => setStatusFilter(status)}
          // 🚨 Lógica de Activación: Si el estado coincide con el filtro actual, usa 'tertiary'.
          variant={statusFilter === status ? 'tertiary' : 'filter'}
          style={styles.button}
        />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    // Aseguramos que el fondo sea transparente para que se vea el fondo de la pantalla
    backgroundColor: 'transparent',
    // Opcional: Centrar los botones horizontalmente si están en una fila dedicada
    justifyContent: 'space-between',
  },
  button: {
    // Permite que los botones se distribuyan bien en la fila
    flex: 1,
    minWidth: 80,
    paddingHorizontal: 10,
  },
});