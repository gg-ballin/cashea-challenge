import { Link, useRouter } from 'expo-router';
import { Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { ThemedText } from '@/components/base/themed-text';
import { ThemedView } from '@/components/base/themed-view';

const { height } = Dimensions.get('window');

export default function ModalScreen() {
  const router = useRouter();

  const closeModal = () => {
    router.canGoBack() && router.back();
  };
  return (
    <TouchableWithoutFeedback style={styles.outerContainer} onPress={closeModal}>
      <ThemedView style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title">This is a modal</ThemedText>
            <Link href="/" dismissTo style={styles.link}>
              <ThemedText type="link">Go to home screen</ThemedText>
            </Link>
          </ThemedView>
        </TouchableWithoutFeedback>

      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});