import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Column} from '../../../../components/Column/Column';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {OcrCamera} from './OcrCamera';
import {useBlocks} from './useBlocks';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 8,
    margin: 5,
  },
});

function PreviewHeader({description}: {description: string | undefined}) {
  return (
    <View
      style={[
        {
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: '#fff',
          padding: 8,
          marginBottom: 16,
          flex: 1,
          flexGrow: 1,
          flexDirection: 'column',
        },
      ]}>
      <View style={{flex: 1}}>
        <Text style={{color: '#000', textAlign: 'center', fontSize: 16}}>
          Name:
        </Text>
        <Text style={{color: '#000', textAlign: 'center', fontSize: 16}}>
          &quot;{description}&quot;
        </Text>
      </View>
    </View>
  );
}

export function DescriptionScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Scan Description'>;
  route: RouteProp<RecipeStackParamList, 'Scan Description'>;
}) {
  const blocks = useBlocks();

  const description = blocks.blocks
    ?.filter(({selected}) => selected)
    .map(({block: {text}}) => text)
    .join(' ');

  return (
    <View style={{flex: 1}}>
      {!blocks.blocks ? (
        <OcrCamera onSelect={blocks.loadBlocks} />
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            data={blocks.blocks}
            ListHeaderComponent={<PreviewHeader description={description} />}
            stickyHeaderIndices={[0]}
            renderItem={({item: block}) => (
              <TouchableOpacity
                onPress={() => {
                  blocks.toggleBlock(block);
                }}
                key={JSON.stringify(block.block.cornerPoints)}
                style={[
                  styles.card,
                  {
                    marginBottom: 16,
                    opacity: block.selected ? 1 : 0.7,
                  },
                ]}>
                <Text style={{color: '#000'}}>{block.block.text}</Text>
              </TouchableOpacity>
            )}
          />
          <Column space={8} style={{padding: 8, backgroundColor: '#fff'}}>
            <Button
              title="Try again"
              onPress={() => blocks.loadBlocks(undefined)}
            />
            <Button
              title="Continue"
              onPress={() =>
                navigation.navigate('Scan Ingredient', {
                  name: route.params.name,
                  description: description || '',
                })
              }
            />
            <Button title="Select none" onPress={blocks.unselectBlocks} />
            <Button title="Select all" onPress={blocks.selectAllBlocks} />
          </Column>
        </View>
      )}
    </View>
  );
}
