import {NavigationProp} from '@react-navigation/native';
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
import {RecipeStackParamList} from '../../RecipesStack';
import {useBlocks} from './useBlocks';
import {OcrCamera} from './OcrCamera';

export const NameScreen = ({
  navigation,
}: {
  navigation: NavigationProp<RecipeStackParamList>;
}) => {
  const {loadBlocks, blocks, toggleBlock, selectAllBlocks, unselectBlocks} =
    useBlocks();

  const name = blocks
    ?.filter(({selected}) => selected)
    .map(({block: {text}}) => text.split('\n').join(' '))
    .join(' ');

  return (
    <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
      {!blocks ? (
        <OcrCamera onSelect={loadBlocks} />
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            data={blocks}
            ListHeaderComponent={() => <PreviewHeader name={name} />}
            stickyHeaderIndices={[0]}
            renderItem={({item: block}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    toggleBlock(block);
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
              );
            }}
          />
          <Column space={8} style={{padding: 8, backgroundColor: '#fff'}}>
            <Button title="Try again" onPress={() => loadBlocks(undefined)} />
            <Button
              title="Continue"
              onPress={() =>
                navigation.navigate('Scan Description', {name: name || ''})
              }
            />
            <Button title="Select none" onPress={unselectBlocks} />
            <Button title="Select all" onPress={selectAllBlocks} />
          </Column>
        </View>
      )}
    </View>
  );
};

function PreviewHeader({name}: {name: string | undefined}) {
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
          "{name}"
        </Text>
      </View>
    </View>
  );
}

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
