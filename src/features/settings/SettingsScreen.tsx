import React from 'react';
import {Button, SafeAreaView, ScrollView} from 'react-native';
import {migrate, teardown} from '../../db/migrate';
import {useDatabase} from '../../providers/database/Provider';

export const SettingsScreen = () => {
  const db = useDatabase();

  const dropTables = () => {
    db.transaction(tx => {
      teardown.forEach(statement => tx.executeSql(statement));
    });
  };
  return (
    <SafeAreaView style={{height: '100%'}}>
      <ScrollView style={{flex: 1}}>
        <Button title="DROP TABLES" onPress={dropTables} />
        <Button title="Restart migration" onPress={() => migrate(db)} />
      </ScrollView>
    </SafeAreaView>
  );
};
