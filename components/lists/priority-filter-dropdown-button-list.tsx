import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { PriorityFilter } from '@/constants/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/stores/todoStore';
import { ThemedText } from '../base/themed-text';
import { ThemedView } from '../base/themed-view';
import { PriorityBadge } from '../ui/priority-badge';

const PRIORITY_OPTIONS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

export function PriorityFilterDropdown() {
  const priorityFilter = useTodoStore(state => state.priorityFilter);
  const setPriorityFilter = useTodoStore(state => state.setPriorityFilter);

  const isExpanded = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    isExpanded.value = withTiming(newState ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'secondaryBackground');
  const textColor = useThemeColor({}, 'text');
  const triggerTextColor = textColor;
  const animatedDropdownStyle = useAnimatedStyle(() => {
    const height = interpolate(isExpanded.value, [0, 1], [0, PRIORITY_OPTIONS.length * 40]);
    return {
      height,
      opacity: isExpanded.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(isExpanded.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });


  const handleSelect = (priority: PriorityFilter) => {
    setPriorityFilter(priority);
    toggleDropdown();
  };


  return (
    <ThemedView style={styles.outerContainer}>
      <Pressable onPress={toggleDropdown} style={[styles.trigger, { borderColor: borderColor }]}>
        <ThemedText type='default' style={styles.triggerText}>
          Filter: {priorityFilter}
        </ThemedText>
        <Animated.View style={animatedIconStyle}>
          <Ionicons name="chevron-down-outline" size={20} color={triggerTextColor} />
        </Animated.View>
      </Pressable>
      {isOpen && (
        <Animated.View style={[styles.dropdownContainer, animatedDropdownStyle, { borderColor: borderColor }]}>
          <ThemedView style={styles.optionsWrapper}>
            {PRIORITY_OPTIONS.map(priority => (
              <Pressable
                key={priority}
                onPress={() => handleSelect(priority)}
                style={[
                  styles.option,
                  { backgroundColor: priorityFilter === priority ? backgroundColor : 'transparent' }
                ]}
              >
                <PriorityBadge priority={priority} size="large" />
              </Pressable>
            ))}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    height: 43,
    minWidth: 150,
  },
  triggerText: {
    fontSize: 14,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 45,
    width: 150,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  optionsWrapper: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  option: {
    marginBottom: 3,
  },
  optionText: {
    fontSize: 15,
  }
});