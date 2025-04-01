import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadRecipeDto } from "@yara/api/recipe";

export function RecipeContent({ recipe }: { recipe: ReadRecipeDto }) {
  return (
    <main className="flex flex-col gap-8 mt-4 mb-4">
      <section id="ingredients">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {recipe.ingredients.map((ingredient) => {
                return (
                  <li
                    key={ingredient.id}
                    className={"list-disc marker:text-orange-500 ml-5"}
                  >
                    {ingredient.quantity} - {ingredient.name}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
      <section id="instructions">
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-2">
              {recipe.instructions.map((instruction) => (
                <li
                  key={instruction.id}
                  className="list-decimal marker:text-orange-500 ml-5"
                >
                  {instruction.step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
