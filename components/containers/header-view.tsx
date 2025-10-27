import { ThemedView } from '@/components/base/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const HEADER_HEIGHT = Dimensions.get('window').height * 0.2;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function HeaderView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
        ]}>
        {headerImage}
      </View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    gap: 16,
    overflow: 'hidden',
  },
});