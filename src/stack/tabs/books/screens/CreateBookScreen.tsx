import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Alert, SafeAreaView} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import {useCreateBook} from '../../../../db/hooks/bookHooks';

import {ScrollScreen} from '../../../../components/Screen/Screen';
import {Column} from '../../../../components/Column/Column';
import {BookStackParamList} from '../BookStackParam';
import {BookModel} from '../../../../db/models/Book';
import {DBRecord} from '../../../../db/models/shared';

type BookFields = Omit<BookModel, keyof DBRecord>;

type FieldName = keyof BookFields;

const useCreateForm = () => {
  const {createBook: create} = useCreateBook();
  const navigation = useNavigation<NavigationProp<BookStackParamList>>();
  const createBook = (book: BookFields) => {
    create(book)
      .then(() => {
        navigation.goBack();
      })
      .catch(e => {
        Alert.alert(JSON.stringify(e));
      });
  };

  return {createBook};
};

export function CreateBookScreen() {
  const {createBook} = useCreateForm();
  const [formState, setFormState] = useState<Omit<BookFields, 'recipes'>>({
    name: '',
    description: '',
    author: '',
    publisher: '',
    imageLocation: '',
  });
  const updateForm = (key: FieldName) => (value: BookFields[FieldName]) =>
    setFormState(pState => ({...pState, [key]: value}));

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollScreen>
        <Column space={8} style={{marginBottom: 64}}>
          <TextInput
            mode="outlined"
            label="Name"
            value={formState.name}
            onChangeText={updateForm('name')}
          />
          <TextInput
            mode="outlined"
            label="Description"
            multiline
            value={formState.description}
            onChangeText={updateForm('description')}
          />
          <TextInput
            mode="outlined"
            label="Author"
            value={formState.author}
            onChangeText={updateForm('author')}
          />
          <TextInput
            mode="outlined"
            label="Publisher"
            value={formState.publisher}
            onChangeText={updateForm('publisher')}
          />
          <View style={{paddingTop: 8}}>
            <Button onPress={() => createBook(formState)} mode="contained">
              Create
            </Button>
          </View>
        </Column>
      </ScrollScreen>
    </SafeAreaView>
  );
}
