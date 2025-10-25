import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-textInput';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';


export default function HomeScreen() {

  const [taskText, setTaskText] = useState('');

  const handleAddTask = () => {
    // 1. Validate input is not empty
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    console.log("Adding task:", taskText);

    setTaskText('');
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDFA3D', dark: '#FDFA3D' }}
      headerImage={
        <Image
          source={require('@/assets/images/cashea_logo.jpg')}
          style={styles.casheaLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <HelloWave />
        <ThemedText type="middle">Welcome to Cashea's coding challenge!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <ThemedView style={styles.inputContainer}>
            <ThemedInput
              placeholder="Add tasks here"
              value={taskText}
              onChangeText={setTaskText}
              style={styles.inputField}
            />
            <ThemedButton
              title="Add"
              onPress={handleAddTask}
              variant="primary"
            />
          </ThemedView>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  casheaLogo: {
    height: '80%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputField: {
    flex: 1,
  },
});
