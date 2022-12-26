import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {Appbar, FAB, List, TextInput, useTheme} from 'react-native-paper';
import {v4} from 'uuid';
import {Input} from '../../../../components/Input/Input';
import {Screen} from '../../../../components/Screen/Screen';
import {itemToSentenceCase} from '../../../../utils/string';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    backgroundColor: '#fff',
  },
  rectButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  greenRectButton: {
    alignItems: 'flex-start',
    backgroundColor: '#7f7',
  },
  redRectButton: {
    alignItems: 'flex-end',
    backgroundColor: '#f77',
  },
  rectButtonText: {
    color: '#111',
    backgroundColor: 'transparent',
  },
  selected: {
    aspectRatio: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7f7',
  },
});

type ItemData = {
  id: string;
  value: string;
};

type ItemState = {
  id: string;
  selected: boolean;
  used: boolean;
};

type Item = ItemData & ItemState;

function Separator() {
  return <View style={{borderBottomColor: '#ddd', borderBottomWidth: 1}} />;
}

function SwipeItem({
  item,
  changeToSelect,
  addItem,
  removeItem,
}: {
  item: ItemData;
  changeToSelect: (id: string, index?: number) => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
}) {
  const theme = useTheme();
  const renderRightActions = () => (
    <RectButton style={[styles.rectButton, styles.redRectButton]}>
      <Text style={styles.rectButtonText}>Remove</Text>
    </RectButton>
  );
  const renderLeftActions = () => (
    <RectButton style={[styles.rectButton, styles.greenRectButton]}>
      <Text style={styles.rectButtonText}>Add</Text>
    </RectButton>
  );
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => addItem(item.id)}
      onSwipeableRightOpen={() => removeItem(item.id)}>
      <List.Item
        onPress={() => changeToSelect(item.id)}
        style={{backgroundColor: theme.colors.background}}
        onLongPress={() => {
          console.log('onLongPress');
          changeToSelect(item.id);
        }}
        title={item.value}
      />
    </Swipeable>
  );
}

function SelectItem({
  item,
  toggleSelected,
}: {
  item: Item;
  toggleSelected: (id: string) => void;
}) {
  const right = () => (
    <List.Icon
      icon={`checkbox-${item.selected ? 'marked' : 'blank'}-outline`}
    />
  );
  return (
    <List.Item
      onPress={() => toggleSelected(item.id)}
      title={item.value}
      right={right}
    />
  );
}

export function ItemAggregator({
  text,
  onScan,
  onSaveItem,
  savedItems,
  onDone,
}: {
  text: string[];
  onScan: () => void;
  onSaveItem: (item: string) => void;
  savedItems: string[];
  onDone: () => void;
}) {
  const navigation = useNavigation();
  const [data, setData] = useState<ItemData[]>([]);
  const [state, setState] = useState<ItemState[]>([]);
  const [mode, setMode] = useState<'swipe' | 'select'>('swipe');

  useEffect(() => {
    const newData: ItemData[] = [];
    const newState: ItemState[] = [];

    text.forEach(value => {
      const id = v4();
      newData.push({id, value});
      newState.push({id, selected: false, used: false});
    });
    setData(newData);
    setState(newState);
  }, [setData, text]);

  useEffect(() => {
    const consumeSelected = () => {
      const newState: ItemState[] = [];
      const itemParts: string[] = [];
      state.forEach(itemState => {
        if (!itemState.selected) {
          newState.push(itemState);
          return;
        }

        const itemData = data.find(({id}) => id === itemState.id);
        if (!itemData) {
          throw new Error('Failed to find an item with the given ID.');
        }
        itemParts.push(itemData.value);
        newState.push({used: true, selected: false, id: itemState.id});
      });
      onSaveItem(itemToSentenceCase(itemParts.join(' ')));
      setState(newState);
      setMode('swipe');
    };

    const onPress = () => (mode === 'select' ? consumeSelected() : onDone());

    const headerRight = () =>
      mode === 'select' ? (
        <Appbar.Action icon="check" onPress={onPress} />
      ) : (
        <Appbar.Action icon="arrow-right" onPress={onPress} />
      );
    navigation.setOptions({
      headerRight,
    });
  }, [mode, state, navigation, savedItems.length, onDone, onSaveItem, data]);

  const removeItem = (id: string) => {
    setState(pState =>
      pState.map(itemState =>
        itemState.id !== id ? itemState : {id, selected: false, used: true},
      ),
    );
  };

  const selectItem = (id: string) =>
    setState(pState =>
      pState.map(itemState =>
        itemState.id !== id
          ? itemState
          : {id, selected: true, used: itemState.used},
      ),
    );

  const addItem = (id: string) => {
    const itemData = data.find(({id: itemId}) => itemId === id);
    if (!itemData) {
      throw new Error('Failed to find an item with the given ID.');
    }
    onSaveItem(itemData.value);
    removeItem(id);
  };

  const toggleSelected = (id: string) =>
    setState(pState =>
      pState.map(itemState =>
        itemState.id !== id
          ? itemState
          : {id, selected: !itemState.selected, used: itemState.used},
      ),
    );

  const keyExtractor = ({id}: ItemData): string => id;
  const renderItem = ({item: itemData}: {item: ItemData}) => {
    const itemState = state.find(({id, used}) => !used && id === itemData.id);
    if (!itemState) {
      return null;
    }

    if (mode === 'swipe') {
      return (
        <SwipeItem
          item={itemData}
          changeToSelect={() => {
            setMode('select');
            selectItem(itemData.id);
          }}
          addItem={addItem}
          removeItem={removeItem}
        />
      );
    }
    const item: Item = {...itemData, ...itemState};
    return <SelectItem item={item} toggleSelected={toggleSelected} />;
  };

  const aggregatedItem = state
    .filter(({selected}) => selected)
    .map(({id}) => data.find(({id: dataId}) => id === dataId)!)
    .map(itemData => itemData?.value)
    .join(' ');

  return (
    <>
      <Screen style={{maxHeight: '100%'}}>
        <TextInput
          mode="outlined"
          placeholder="Dummy manual input"
          value={aggregatedItem}
        />
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
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
        onPress={onScan}
      />
    </>
  );
}
