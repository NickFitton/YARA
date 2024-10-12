import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ReadRecipeDto } from 'src/recipes/dto/read-recipe.dto';

const RECIPE_DATA = {
  name: 'Recipe name',
  description: 'Recipe description',
  ingredients: [
    { name: 'spaghetti (or any pasta of your choice)', quantity: '200g' },
    { name: 'butter', quantity: '4 tablespoons' },
    { name: 'cloves garlic (minced)', quantity: '3' },
    { name: 'olive oil', quantity: '1 tablespoon' },
    { name: 'Salt and pepper', quantity: 'to taste' },
    { name: 'grated Parmesan cheese', quantity: '1/4 cup' },
    { name: 'Fresh parsley (optional)', quantity: '' },
  ],
  instructions: [
    {
      order: 1,
      step: 'Cook the Pasta: Bring a large pot of salted water to a boil. Add the pasta and cook according to package instructions until al dente. Reserve 1/4 cup of pasta water and drain the rest',
    },
    {
      order: 2,
      step: 'Make the Garlic Butter Sauce: In a large pan, melt the butter and olive oil over medium heat. Add the minced garlic and cook for about 1-2 minutes, until fragrant (be careful not to burn the garlic).',
    },
    {
      order: 3,
      step: 'Combine Pasta and Sauce: Add the cooked pasta to the garlic butter sauce. Toss well to coat. If the pasta seems dry, add a bit of the reserved pasta water to loosen it up.',
    },
    {
      order: 4,
      step: 'Season and Serve: Season with salt and pepper to taste. Sprinkle with grated Parmesan cheese and garnish with fresh parsley if desired.',
    },
  ],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/recipes (POST)', async () => {
    const { id, ingredients, instructions } = await createRecipe(app);

    expect(id).toBeDefined();
    expect(ingredients).toHaveLength(7);
    expect(ingredients[0].id).toBeDefined();

    expect(instructions).toHaveLength(4);
    expect(instructions[0].id).toBeDefined();
  });

  it('/recipes (GET)', async () => {
    const { id: createdId } = await createRecipe(app);
    const recipes = await findAllRecipes(app);

    expect(recipes.find(({ id }) => id === createdId)).toBeDefined();
  });

  it('/recipes/:id (GET)', async () => {
    const postResponse = await createRecipe(app);
    const body = await findRecipeById(app, postResponse.id);

    expect(RECIPE_DATA.name).toEqual(body.name);
    expect(postResponse).toEqual(body);
  });

  it('/recipes/:id (PATCH)', async () => {
    const postResponse = await createRecipe(app);

    await request(app.getHttpServer())
      .patch(`/recipes/${postResponse.id}`)
      .send({ name: 'A different name' })
      .expect(204);

    const { name, description } = await findRecipeById(app, postResponse.id);

    expect(name).toBe('A different name');
    expect(description).toBe(RECIPE_DATA.description);
  });

  it('/recipes/:id (DELETE)', async () => {
    const { id: createdId } = await createRecipe(app);
    const findAll = await findAllRecipes(app);
    expect(findAll.find(({ id }) => id === createdId)).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/recipes/${createdId}`)
      .expect(204);

    await request(app.getHttpServer()).get(`/recipes/${createdId}`).expect(404);

    const findAllAgain = await findAllRecipes(app);
    expect(findAllAgain.find(({ id }) => id === createdId)).not.toBeDefined();
  });
});

async function createRecipe(
  app: INestApplication<any>,
): Promise<ReadRecipeDto> {
  const { body } = await request(app.getHttpServer())
    .post('/recipes')
    .send(RECIPE_DATA)
    .expect(201);
  return body;
}

async function findAllRecipes(
  app: INestApplication<any>,
): Promise<ReadRecipeDto[]> {
  const { body } = await request(app.getHttpServer())
    .get('/recipes')
    .expect(200);
  return body;
}

async function findRecipeById(
  app: INestApplication<any>,
  id: string,
): Promise<ReadRecipeDto> {
  const { body } = await request(app.getHttpServer())
    .get(`/recipes/${id}`)
    .expect(200);
  return body;
}
