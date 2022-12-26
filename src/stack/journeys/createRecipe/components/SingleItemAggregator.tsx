import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, FAB, List, TextInput} from 'react-native-paper';
import {v4} from 'uuid';
import {Screen} from '../../../../components/Screen/Screen';

import {itemToSentenceCase, toTitleCase} from '../../../../utils/string';
import {CreateRecipeStackParamList} from '../types';

type Item = {
  type: 'raw';
  value: string;
  selected: boolean;
};

const removeByKey = <T,>(record: Record<string, T>, removedKey: string) =>
  Object.entries(record).reduce(
    (agg, [key, value]) => (key === removedKey ? agg : {...agg, [key]: value}),
    {},
  );

function ListItem({
  item,
  id,
  toggleSelect,
}: {
  id: string;
  item: Item;
  toggleSelect: (id: string, index?: number) => void;
}) {
  const right = () => (
    <List.Icon
      icon={`checkbox-${item.selected ? 'marked' : 'blank'}-outline`}
    />
  );
  return (
    <List.Item
      key={id}
      onPress={() => toggleSelect(id)}
      title={item.value}
      right={right}
    />
  );
}

const lowercaseWords = ['as', 'with', 'to', 'and'];

const itemToTitleCase = (item: string): string =>
  item
    .split(' ')
    .map(word => word.toLowerCase())
    .map(word => (lowercaseWords.includes(word) ? word : toTitleCase(word)))
    .join(' ');

const useData = (data: string[], casing: 'title' | 'sentence') => {
  const [builtItems, setBuiltItems] = useState<string[]>([]);
  const [items, setItems] = useState<Record<string, Item>>({});
  useEffect(() => {
    setItems(
      data
        .flatMap(item => item.split('\n'))
        .map(value => ({value, type: 'raw', id: v4()}))
        .reduce(
          (acc, {id, ...rest}) => ({...acc, [id]: {...rest, selected: false}}),
          {},
        ),
    );
  }, [setItems, data]);

  const toggleItemSelect = (id: keyof typeof items) => {
    const pItem = items[id];
    pItem.selected = !pItem.selected;
    setItems(pItems => ({...pItems, [id]: pItem}));
  };

  const aggregatedItem = Object.values(items).reduce((agg, item) => {
    if (item.selected) {
      return `${agg} ${item.value}`.trim();
    }
    return agg;
  }, '');

  const removeSelected = () => {
    setItems(pItems =>
      Object.entries(pItems).reduce(
        (agg, [entryKey, entryValue]) =>
          entryValue.selected ? agg : {...agg, [entryKey]: entryValue},
        {},
      ),
    );
  };

  const onAdd = () => {
    setBuiltItems(pItems => [...pItems, aggregatedItem]);
    removeSelected();
  };

  const removeItem = (id: string) => {
    setItems(pItems => removeByKey(pItems, id));
  };

  const addItem = (id: string) => {
    const item = items[id];
    if (item.type !== 'raw') {
      throw new Error('tried to add a split item');
    }
    setBuiltItems(pItems => [...pItems, item.value]);
    removeItem(id);
  };

  return {
    items,
    aggregatedItem:
      casing === 'title'
        ? itemToTitleCase(aggregatedItem)
        : itemToSentenceCase(aggregatedItem),
    toggleItemSelect,
    builtItems,
    onAdd,
    removeItem,
    addItem,
  };
};

export function SingleItemAggregator({
  data,
  itemType,
  onSubmit,
  onRetry,
  casing = 'sentence',
}: {
  data: string[];
  itemType: string;
  onSubmit: (item?: string) => void;
  onRetry: () => void;
  casing: 'title' | 'sentence';
}) {
  const {items, aggregatedItem, toggleItemSelect} = useData(data, casing);
  const navigation =
    useNavigation<NavigationProp<CreateRecipeStackParamList>>();

  useEffect(() => {
    const headerRight = () => (
      <Appbar.Action
        icon="arrow-right"
        onPress={() => {
          onSubmit(aggregatedItem);
        }}
      />
    );

    navigation.setOptions({headerRight});
  }, [aggregatedItem, navigation, onSubmit]);

  const keyExtractor = ([key]: [string, Item]): string => key;
  const renderItem = ({item: [key, value]}: {item: [string, Item]}) => (
    <ListItem item={value} id={key} toggleSelect={toggleItemSelect} />
  );

  return (
    <>
      <Screen style={{maxHeight: '100%'}}>
        <TextInput
          mode="outlined"
          placeholder={`Your recipe ${itemType}`}
          value={
            casing === 'title'
              ? itemToTitleCase(aggregatedItem)
              : itemToSentenceCase(aggregatedItem)
          }
        />
        <View style={{paddingVertical: 4}} />
        <FlatList
          data={Object.entries(items)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Screen>

      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        label={`Scan${data.length > 0 ? ' Again' : ''}`}
        icon="camera"
        onPress={onRetry}
      />
    </>
  );
}
