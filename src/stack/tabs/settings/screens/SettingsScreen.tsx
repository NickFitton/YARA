import React from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {ScrollScreen} from '../../../../components/Screen/Screen';
import {migrate, teardown} from '../../../../db/migrate';
import {useDatabase} from '../../../../providers/database/Provider';

export function SettingsScreen() {
  const db = useDatabase();
  const {colors} = useTheme();

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
    <ScrollScreen>
      <Button mode="contained" onPress={dropTables}>
        DROP TABLES
      </Button>
      <Button mode="contained" onPress={migrateDatabase}>
        Restart migration
      </Button>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View style={{flex: 1, backgroundColor: colors.primary}}>
          <Text>primary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onPrimary}}>
          <Text style={{color: colors.primary}}>onPrimary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.primaryContainer}}>
          <Text>primaryContainer</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onPrimaryContainer}}>
          <Text style={{color: colors.primaryContainer}}>
            onPrimaryContainer
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View style={{flex: 1, backgroundColor: colors.secondary}}>
          <Text>secondary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onSecondary}}>
          <Text style={{color: colors.secondary}}>onSecondary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.secondaryContainer}}>
          <Text>secondaryContainer</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onSecondaryContainer}}>
          <Text style={{color: colors.secondaryContainer}}>
            onSecondaryContainer
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View style={{flex: 1, backgroundColor: colors.tertiary}}>
          <Text>tertiary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onTertiary}}>
          <Text style={{color: colors.tertiary}}>onTertiary</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.tertiaryContainer}}>
          <Text>tertiaryContainer</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onTertiaryContainer}}>
          <Text style={{color: colors.tertiaryContainer}}>
            onTertiaryContainer
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View style={{flex: 1, backgroundColor: colors.error}}>
          <Text>error</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onError}}>
          <Text style={{color: colors.error}}>onError</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.errorContainer}}>
          <Text>errorContainer</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onErrorContainer}}>
          <Text style={{color: colors.errorContainer}}>onErrorContainer</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View style={{flex: 1, backgroundColor: colors.background}}>
          <Text>background</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onBackground}}>
          <Text style={{color: colors.background}}>onBackground</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.surface}}>
          <Text>surface</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.onSurface}}>
          <Text style={{color: colors.surface}}>onSurface</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', aspectRatio: 4}}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surfaceVariant,
          }}>
          <Text>surfaceVariant</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.onSurfaceVariant,
          }}>
          <Text style={{color: colors.surfaceVariant}}>onSurfaceVariant</Text>
        </View>

        <View style={{flex: 1, backgroundColor: colors.outline}}>
          <Text>outline</Text>
        </View>
      </View>
      <View style={{padding: 32}} />
    </ScrollScreen>
  );
}
