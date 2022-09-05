import {NavigationProp} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {OCRFrame} from 'vision-camera-ocr';
import {Column} from '../../../../components/Column/Column';
import {OcrCamera} from './OcrCamera';

type TextBlock = OCRFrame['result']['blocks'][0];

export const NameScreen = ({navigation}: {navigation: NavigationProp<{}>}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
    });
  }, []);

  const onSelect = (blocks: TextBlock[]) => {
    const autoSelect = blocks.length < 10;
    setBlocks(blocks.map(block => ({block, selected: autoSelect})));
  };
  const [blocks, setBlocks] =
    useState<{block: TextBlock; selected: boolean}[]>();

  const toggleBlock = (block: {block: TextBlock; selected: boolean}) => [
    setBlocks(pBlocks => {
      const toggleIndex = pBlocks?.indexOf(block);
      return pBlocks?.map(({block, selected}, i) =>
        i === toggleIndex ? {block, selected: !selected} : {block, selected},
      );
    }),
  ];

  const name = blocks
    ?.filter(({selected}) => selected)
    .map(({block: {text}}) => text.split('\n').join(' '))
    .join(' ');

  return (
    <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
      {!blocks ? (
        <OcrCamera onSelect={onSelect} />
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
            <Button title="Try again" onPress={() => setBlocks(undefined)} />
            <Button title="Continue" onPress={() => console.log('Wahoo!')} />
            <Button
              title="Select none"
              onPress={() =>
                setBlocks(pBlocks =>
                  pBlocks?.map(block => ({...block, selected: false})),
                )
              }
            />
            <Button
              title="Select all"
              onPress={() =>
                setBlocks(pBlocks =>
                  pBlocks?.map(block => ({...block, selected: true})),
                )
              }
            />
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
