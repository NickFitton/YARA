import {NavigationProp} from '@react-navigation/native';
import React, {useLayoutEffect} from 'react';
import {Button, View, Text} from 'react-native';
import {Column} from '../../../components/Column/Column';
import {useRecipeStorage} from '../recipeHooks';
import {RecipeStackParamList} from '../RecipesStack';

export const RecipesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'RecipesRoot'>;
}) => {
  const {recipes} = useRecipeStorage();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Scan Name')} title="New" />
      ),
    });
  }, [navigation]);

  return (
    <View style={{padding: 24, height: '100%'}}>
      {recipes.length === 0 ? (
        <Column
          style={{
            height: '100%',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          space={8}>
          <Text style={{color: '#000', textAlign: 'center'}}>
            You don't have any recipes yet
          </Text>
          <Button
            title="Create a Recipe"
            onPress={() => navigation.navigate('Scan Name')}
          />
        </Column>
      ) : (
        recipes.map(recipe => {
          return (
            <View
              key={recipe.name}
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
              <Text style={{color: '#000'}}>{recipe.name}</Text>
              <Text style={{color: '#000'}}>{recipe.description}</Text>
            </View>
          );
        })
      )}
    </View>
  );
};
