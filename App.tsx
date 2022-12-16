import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {DatabaseProvider} from './src/providers/database/Provider';
import {migrate} from './src/db/migrate';
import {Stack} from './src/stack/Stack';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

SQLite.enablePromise(true);

const queryClient = new QueryClient();
const useDBSetup = ():
  | {status: 'loading' | 'error'}
  | {status: 'loaded'; db: SQLiteDatabase} => {
  const [db, setDb] = useState<SQLiteDatabase | null | undefined>();

  useEffect(() => {
    SQLite.openDatabase({
      location: 'Library',
      name: 'Test.db',
    })
      .then(openedDb => migrate(openedDb).then(() => setDb(openedDb)))
      .catch(err => {
        Alert.alert(JSON.stringify(err));
        setDb(null);
      });
  }, []);

  if (db === undefined) {
    return {status: 'loading'};
  }
  if (db === null) {
    return {status: 'error'};
  }
  return {status: 'loaded', db};
};

function App() {
  const dbSetup = useDBSetup();

  switch (dbSetup.status) {
    case 'loading':
      return (
        <View style={styles.page}>
          <Text>The app is loading, shouldn&apos;t be too long!</Text>
        </View>
      );
    case 'error':
      return (
        <View style={styles.page}>
          <Text>
            It looks like an error occured whilst starting the app, we&apos;ve
            been notified and will look into this issue.
          </Text>
        </View>
      );
    case 'loaded':
      return (
        <DatabaseProvider {...dbSetup}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{flex: 1}}>
                <Stack />
              </GestureHandlerRootView>
            </QueryClientProvider>
          </NavigationContainer>
        </DatabaseProvider>
      );
    default:
      return (
        <Text style={{flex: 1, textAlign: 'center', padding: 32}}>
          Something went wrong
        </Text>
      );
  }
}

export default App;
