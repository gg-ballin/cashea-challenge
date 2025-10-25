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

  const [taskText, setTaskText] = useState(''); // 👈 Local state for the input

  const handleAddTask = () => {
    // 1. Validate input is not empty
    if (!taskText.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    
    // 2. Here you will eventually dispatch an action to Zustand 
    //    or call your json-server POST endpoint with taskText.

    console.log("Adding task:", taskText);
    
    // 3. Clear input after adding
    setTaskText('');
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
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
          {/* <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger> */}
          <ThemedView>

          <ThemedInput
            placeholder="What needs to be done?"
            value={taskText}
            onChangeText={setTaskText} // Update local state on change
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
    height: '100%',
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
    borderBottomWidth: StyleSheet.hairlineWidth, // Visual separator
    // Assuming you have a themed border color
    // borderBottomColor: useThemeColor({}, 'separator'),
  },
  inputField: {
    flex: 1, // Allows input to take up most of the space
  },
});
