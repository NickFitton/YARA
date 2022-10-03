import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {BooksStack} from './src/features/books/BooksStack';
import {RecipesStack} from './src/features/recipes/RecipesStack';
import {SearchStack} from './src/features/search/SearchStack';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {DatabaseProvider} from './src/providers/database/Provider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SettingsScreen} from './src/features/settings/SettingsScreen';
import {migrate} from './src/db/migrate';

export type TabParamList = {
  Recipes: undefined;
  Search: undefined;
  Books: undefined;
  Settings: undefined;
};

SQLite.enablePromise(true);

const Tab = createBottomTabNavigator<TabParamList>();

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
      .then(db => {
        setDb(db);
        return migrate(db);
      })
      .catch(err => {
        Alert.alert(err);
        console.error(err);
        setDb(null);
      });
  }, []);

  if (db === undefined) {
    return {status: 'loading'};
  } else if (db === null) {
    return {status: 'error'};
  } else {
    return {status: 'loaded', db: db!};
  }
};

const App = () => {
  const dbSetup = useDBSetup();

  switch (dbSetup.status) {
    case 'loading':
      return (
        <View style={styles.page}>
          <Text>The app is loading, shouldn't be too long!</Text>
        </View>
      );
    case 'error':
      return (
        <View style={styles.page}>
          <Text>
            It looks like an error occured whilst starting the app, we've been
            notified and will look into this issue.
          </Text>
        </View>
      );
    case 'loaded':
      return (
        <DatabaseProvider {...dbSetup}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <Tab.Navigator screenOptions={{headerShown: false}}>
                <Tab.Screen name="Recipes" component={RecipesStack} />
                <Tab.Screen name="Search" component={SearchStack} />
                <Tab.Screen name="Books" component={BooksStack} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
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
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
