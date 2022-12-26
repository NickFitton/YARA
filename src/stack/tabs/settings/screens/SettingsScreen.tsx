import React from 'react';
import {Alert, Button} from 'react-native';
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
      <Button title="DROP TABLES" onPress={dropTables} />
      <Button title="Restart migration" onPress={migrateDatabase} />
    </Screen>
  );
}
