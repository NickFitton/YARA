import React from 'react';
import {Alert} from 'react-native';
import {Button} from 'react-native-paper';
import {Screen} from '../../../../components/Screen/Screen';
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
    <Screen>
      <Button mode="contained" onPress={dropTables}>
        DROP TABLES
      </Button>
      <Button mode="contained" onPress={migrateDatabase}>
        Restart migration
      </Button>
    </Screen>
  );
}
