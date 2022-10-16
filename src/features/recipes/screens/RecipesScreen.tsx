import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren, useLayoutEffect} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Column} from '../../../components/Column/Column';
import {useCreateRecipe, useRecipe, useRecipes} from '../recipeHooks';
import {RecipeStackParamList} from '../RecipeStackParam';

function RecipePreviewWrapper({id, children}: PropsWithChildren<{id: string}>) {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate({name: 'View Recipe', params: {id}})}
      style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 8,
        marginBottom: 16,
      }}>
      {children}
    </TouchableOpacity>
  );
}

function RecipePreview({id}: {id: string}) {
  const data = useRecipe(id);

  switch (data.status) {
    case 'error':
      return (
        <RecipePreviewWrapper id={id}>
          <Text>!!!</Text>
        </RecipePreviewWrapper>
      );
    case 'success':
      return (
        <RecipePreviewWrapper id={id}>
          <>
            <Text style={{color: '#000'}}>{data.data.name}</Text>
            <Text style={{color: '#000'}}>{data.data.description}</Text>
          </>
        </RecipePreviewWrapper>
      );
    case 'loading':
    default:
      return (
        <RecipePreviewWrapper id={id}>
          <ActivityIndicator size="large" />
        </RecipePreviewWrapper>
      );
  }
}

function ListEmpty() {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();
  return (
    <Column
      style={{
        height: '100%',
        padding: 24,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      space={8}>
      <Text style={{color: '#000', textAlign: 'center'}}>
        You don&apos;t have any recipes yet
      </Text>
      <Button
        title="Create a Recipe"
        onPress={() => navigation.navigate('Scan Name')}
      />
    </Column>
  );
}

export function RecipesScreen({
  navigation,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'RecipesRoot'>;
}) {
  const data = useRecipes();
  const {createRecipe} = useCreateRecipe();

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Scan Name')} title="New" />
      ),
    });
  }, [navigation]);

  const createTestRecipe = () => {
    createRecipe({
      name: 'Orange Rum Bundt Cake',
      description:
        "This Orange Rum Bundt Cake is a sweet, moist homemade cake flavored with dark spiced rum and bright, fresh orange zest. Dust the top with powdered sugar and it's the picture-perfect cake recipe for special occasions and sharing with friends.",
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 75,
      ingredients: [
        {type: 'parsed', quantity: 3, unit: 'cup', name: 'all-purpose flour'},
        {type: 'parsed', quantity: 0.5, unit: 'tsp', name: 'baking soda'},
        {type: 'parsed', quantity: 0.5, unit: 'tsp', name: 'salt'},
        {type: 'parsed', quantity: 1, unit: 'cup', name: 'unsalted butter'},
        {
          type: 'parsed',
          quantity: 2.75,
          unit: 'cup',
          name: 'extra fine granulated sugar',
        },
        {
          type: 'parsed',
          quantity: 4,
          name: 'eggs',
        },
        {
          type: 'parsed',
          quantity: 1,
          unit: 'tbsp',
          name: 'vanilla extract',
        },
        {type: 'parsed', quantity: 2, unit: 'tbsp', name: 'orange zest'},
        {type: 'raw', ingredient: '3/4 cup buttermilk'},
        {type: 'parsed', quantity: 0.5, unit: 'cup', name: 'dark spiced rum'},
      ],
      method: [
        {
          type: 'raw',
          step: 'Preheat oven to 325°F. Grease a 10-inch bundt pan with baking spray or butter and flour it. Set aside.',
        },
        {
          type: 'raw',
          step: 'In a medium bowl, whisk together flour, baking soda, and salt. Set aside.',
        },
        {
          type: 'raw',
          step: 'In large bowl of a stand mixer, cream butter and sugar until light and fluffy. Beat in eggs one at a time, then stir in vanilla and orange zest until well combined. Beat in flour mixture alternating with buttermilk and rum.',
        },
        {
          type: 'raw',
          step: 'Pour batter into prepared bundt pan. Bake for 55-65 minutes, until center is set and a toothpick inserted comes out clean.',
        },
        {
          type: 'raw',
          step: 'Allow cake to cool completely (in bundt pan) before inverting onto cake plate. Dust with powdered sugar before serving. Serve warm or room temperature.',
        },
      ],
    }).catch(Alert.alert);
  };

  switch (data.status) {
    case 'error':
      return (
        <View style={{height: '100%'}}>
          <View>
            <Text>Something went wrong</Text>
          </View>
        </View>
      );
    case 'success':
      return (
        <View style={{height: '100%'}}>
          <View style={{flex: 1}}>
            <Button title="Create Test Recipe" onPress={createTestRecipe} />
            <FlatList
              style={{padding: 16}}
              ListEmptyComponent={<ListEmpty />}
              data={data.data}
              renderItem={({item: {id}}) => <RecipePreview id={id} />}
            />
          </View>
        </View>
      );
    case 'loading':
    default:
      return (
        <View style={{height: '100%'}}>
          <View>
            <Text>Loading your recipes</Text>
          </View>
        </View>
      );
  }
}
