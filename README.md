# Welcome to Cashea's coding challenge 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies:

   ```bash
   yarn
   ```

2. Start the app in ios:

   ```bash
   yarn ios 
   ```
3. Open Android Studio, select `Virtual Device Manager` and open an Android Emulator. Then type in terminal:
   ```bash
   yarn android
   ```
4. Start the `json-server` like so:

   ```bash
   json-server --watch db.json --port 3000
   ```
## Base dependencies

- [react-native](https://reactnative.dev/docs/getting-started) hybrid mobile framework.
- [expo](https://docs.expo.dev/) React Native framework.
- [expo-router](https://docs.expo.dev/router/introduction/) navigation library.
- [typescript](https://www.typescriptlang.org/) for type-checking.
- [json-server](https://www.npmjs.com/package/json-server) for mocking a REST API.
- [react-native-reanimated v4](https://github.com/software-mansion/react-native-reanimated) for animations.
- [zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management.
- [async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/) for storing data asynchronously.

- [biome](https://biomejs.dev/guides/getting-started/) for linting.

## Why Zustand > Context API

Zustand handles better re-renderization, the biggest performance issue React Native apps usually have. Also, not having `useCallback`'s everywhere, makes the code easier to read and maintain. Cleaner Async logic without the need of a `dispatch`. Also, using Zustand you can significantly reduce the need for custom React Hooks, which aren't that reliable. The simple advantage of Zustand middleware over the Context API is that it allows you to easily add complex, non-React logic like persistence (such as `AsyncStorage`) or logging outside the component tree.