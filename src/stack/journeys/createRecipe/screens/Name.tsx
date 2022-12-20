import {useFocusEffect} from '@react-navigation/native';
import React, {useRef} from 'react';
import {TextInput, View, Button} from 'react-native';
import {CreateRecipeProps} from '../types';

export function NameScreen({navigation}: CreateRecipeProps<'Name'>) {
  // const [dataset, setDataset] = useState<string[]>([]);
  // useEffect(() => {
  //   const newLocal = route.params.data.text.map(value => value.text);
  //   setDataset(newLocal);
  // }, [setDataset, route]);

  const ref = useRef<TextInput>(null);

  const navigateToScanDescription = () => {
    navigation.navigate('Description', {
      recipe: {name: ref.current?.props.value},
    });
  };

  useFocusEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button title="Next" onPress={() => navigateToScanDescription()} />
      ),
    });
  });

  return (
    <View>
      <TextInput placeholder="Recipe name here" ref={ref} />
      <Button title="Scan again" />
    </View>
  );
  // return (
  //   <SingleItemAggregator
  //     itemType="name"
  //     data={dataset}
  //     onSubmit={navigateToScanDescription}
  //     casing="title"
  //   />
  // );
}
