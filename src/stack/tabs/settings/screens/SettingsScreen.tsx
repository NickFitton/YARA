import React from 'react';
import {Alert, Button, SafeAreaView, ScrollView} from 'react-native';
import {migrate, teardown} from '../../../../db/migrate';
import {useDatabase} from '../../../../providers/database/Provider';

export function SettingsScreen() {
  const db = useDatabase();

  const dropTablesAsync = async () => {
    await db.transaction(tx => {
      teardown.forEach(statement => {
        tx.executeSql(statement).catch(Alert.alert);
      });
    });
  };

  const dropTables = () => {
    dropTablesAsync().catch(Alert.alert);
  };

  const migrateDatabase = () => {
    migrate(db).catch(Alert.alert);
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <ScrollView style={{flex: 1}}>
        <Button title="DROP TABLES" onPress={dropTables} />
        <Button title="Restart migration" onPress={migrateDatabase} />
      </ScrollView>
    </SafeAreaView>
  );
}
