import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {v4} from 'uuid';

import {itemToSentenceCase, toTitleCase} from '../../../../utils/string';
import {CreateRecipeStackParamList} from '../types';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    opacity: 1,
    borderRadius: 4,
    padding: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selected: {
    backgroundColor: '#7f7',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 16,
    marginBottom: 4,
  },
});

type RawItem = {
  type: 'raw';
  value: string;
  selected: boolean;
};

type SplitItem = {
  type: 'split';
  values: {value: string; selected: boolean}[];
};

type Item = RawItem | SplitItem;

const removeByKey = <T,>(record: Record<string, T>, removedKey: string) =>
  Object.entries(record).reduce(
    (agg, [key, value]) => (key === removedKey ? agg : {...agg, [key]: value}),
    {},
  );

function ListItem({
  item,
  id,
  toggleSelect,
  breakItem,
}: {
  id: string;
  item: Item;
  toggleSelect: (id: string, index?: number) => void;
  breakItem: (id: string) => void;
}) {
  switch (item.type) {
    case 'split':
      return (
        <View style={{flexDirection: 'row', margin: 8}}>
          {item.values.map(({value, selected}, i) => (
            <Pressable
              onPress={() => toggleSelect(id, i)}
              key={`${id}-${value}`}
              style={[
                styles.card,
                {
                  padding: 0,
                  marginRight: 8,
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                },
              ]}>
              <Text style={{fontSize: 16, padding: 8, color: '#111'}}>
                {value}
              </Text>
              {selected ? (
                <View
                  style={[
                    styles.selected,
                    {
                      aspectRatio: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 8,
                    },
                  ]}>
                  <Text style={{color: '#111'}}>✓</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      );
    case 'raw':
    default: {
      return (
        <Pressable
          key={id}
          onPress={() => toggleSelect(id)}
          onLongPress={() => breakItem(id)}
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            backgroundColor: '#fff',
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <Text style={{fontSize: 16, flex: 1, padding: 16, color: '#111'}}>
            {item.value}
          </Text>
          {item.selected ? (
            <View
              style={[
                styles.selected,
                {
                  aspectRatio: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Text style={{color: '#111'}}>✓</Text>
            </View>
          ) : null}
        </Pressable>
      );
    }
  }
}

const lowercaseWords = ['as', 'with', 'to', ''];

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

  const breakItem = (id: keyof typeof items) => {
    const item = items[id];
    if (item.type === 'split') {
      return;
    }

    const values = item.value
      .split(/[ .,]/g)
      .filter(part => part.length > 0)
      .map(value => ({value, enabled: false, selected: item.selected}));
    setItems(pItems => ({
      ...pItems,
      [id]: {type: 'split', values},
    }));
  };

  const mergeItem = (item: SplitItem): RawItem => ({
    type: 'raw',
    value: item.values.map(({value}) => value).join(' '),
    selected: item.values[0].selected,
  });

  const toggleItemSelect = (id: keyof typeof items, splitIndex?: number) => {
    let pItem = items[id];
    if (pItem.type === 'raw') {
      pItem.selected = !pItem.selected;
    } else if (pItem.type === 'split') {
      if (typeof splitIndex !== 'number') {
        throw new Error(
          "Tried to toggle a word in a split item, but didn't provide an index.",
        );
      }
      pItem.values[splitIndex].selected = !pItem.values[splitIndex].selected;
      if (
        pItem.values.every(value => value.selected === true) ||
        pItem.values.every(value => value.selected === false)
      ) {
        pItem = mergeItem(pItem);
      }
    }
    setItems(pItems => ({...pItems, [id]: pItem}));
  };

  const aggregatedItem = Object.values(items).reduce((agg, item) => {
    switch (item.type) {
      case 'raw':
        if (item.selected) {
          return `${agg} ${item.value}`.trim();
        }
        break;
      case 'split': {
        const aggVal = item.values.reduce(
          (valAgg, {value, selected}) =>
            selected ? `${valAgg} ${value}` : valAgg,
          '',
        );
        if (aggVal.length > 0) {
          return `${agg} ${aggVal}`.trim();
        }
        break;
      }
    }
    return agg;
  }, '');

  const removeSelected = () => {
    setItems(pItems =>
      Object.entries(pItems).reduce((agg, [entryKey, entryValue]) => {
        if (entryValue.type === 'raw') {
          return entryValue.selected ? agg : {...agg, [entryKey]: entryValue};
        }
        const remainingValues = entryValue.values.filter(
          value => !value.selected,
        );
        return remainingValues.length === 0
          ? agg
          : {
              ...agg,
              [entryKey]: {...entryValue, values: remainingValues},
            };
      }, {}),
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
    breakItem,
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
  casing = 'sentence',
}: {
  data: string[];
  itemType: string;
  onSubmit: (item?: string) => void;
  casing: 'title' | 'sentence';
}) {
  const {items, aggregatedItem, breakItem, toggleItemSelect} = useData(
    data,
    casing,
  );
  const navigation =
    useNavigation<NavigationProp<CreateRecipeStackParamList>>();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => {
        if (aggregatedItem.length > 0) {
          return (
            <Button title="Next" onPress={() => onSubmit(aggregatedItem)} />
          );
        }
        return <Button title="Skip" onPress={() => onSubmit(undefined)} />;
      },
    });
  }, [aggregatedItem, navigation, onSubmit]);

  return (
    <View style={{maxHeight: '100%'}}>
      <View style={styles.header}>
        {aggregatedItem.length > 0 ? (
          <View>
            <Text style={{color: '#111', textAlign: 'center'}}>
              Your recipes {itemType}:
            </Text>
            <Text style={{color: '#111', textAlign: 'center'}}>
              {casing === 'title'
                ? itemToTitleCase(aggregatedItem)
                : itemToSentenceCase(aggregatedItem)}
            </Text>
          </View>
        ) : (
          <Text style={{color: '#111', textAlign: 'center'}}>
            Tap an item to start building an {itemType}
          </Text>
        )}
      </View>
      <FlatList
        data={Object.entries(items)}
        keyExtractor={([key]) => key}
        renderItem={({item: [key, value]}) => (
          <ListItem
            item={value}
            id={key}
            toggleSelect={toggleItemSelect}
            breakItem={breakItem}
          />
        )}
      />
    </View>
  );
}
