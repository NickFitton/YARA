import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  ChefHat,
  Users,
  Utensils,
  AlertTriangle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { RecipePageData } from "./types";

function DietaryLabelIcon({
  status,
}: Pick<RecipePageData["recipe"]["dietaryLabels"][0], "status">) {
  switch (status) {
    case "warning":
      return <AlertTriangle className="h-3 w-3 text-amber-500" />;
    case "okay":
      return <Check className="h-3 w-3 text-green-500" />;
  }
}

export default function RecipeOverview({ recipe }: RecipePageData) {
  // Determine recipe complexity score (1-5) based on number of ingredients, steps, and cooking time
  const getComplexityScore = () => {
    const ingredientsScore =
      recipe.ingredients.length > 10
        ? 2
        : recipe.ingredients.length > 5
          ? 1
          : 0;
    const stepsScore =
      recipe.instructions.length > 8
        ? 2
        : recipe.instructions.length > 4
          ? 1
          : 0;
    const timeScore = recipe.totalTime > 60 ? 2 : recipe.totalTime > 30 ? 1 : 0;

    return Math.min(ingredientsScore + stepsScore + timeScore, 5);
  };

  const complexityScore = getComplexityScore();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {/* Quick Stats */}
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Prep Time</p>
                  <p className="font-medium">{recipe.prepTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Cook Time</p>
                  <p className="font-medium">{recipe.cookTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-medium">{recipe.difficulty}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">Complexity</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full ${i < complexityScore ? "bg-orange-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {complexityScore <= 1
                  ? "Very Simple"
                  : complexityScore === 2
                    ? "Simple"
                    : complexityScore === 3
                      ? "Moderate"
                      : complexityScore === 4
                        ? "Complex"
                        : "Very Complex"}
              </p>
            </div>
          </div>

          {/* Key Ingredients & Equipment */}
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              What You&apos;ll Need
            </h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Key Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.keyIngredients.map(({ id, name }) => (
                    <Badge key={id} variant="outline" className="bg-orange-50">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Equipment:</p>
                <div className="space-y-1">
                  {recipe.equipment.map((item: string) => (
                    <div key={item} className="flex items-center gap-2">
                      <Utensils className="h-3 w-3 text-orange-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Info & Actions */}
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Dietary Information</h3>
            <div className="mb-4 space-y-1">
              {recipe.dietaryLabels.map(({ label, status }) => (
                <div key={label} className="flex items-center gap-2">
                  <DietaryLabelIcon status={status} />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <Link href={`/cook/${recipe.id}`}>Start Cooking</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
