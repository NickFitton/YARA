"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RecipePageData } from "./types";
import { ReadIngredientDto, ReadInstructionDto } from "@yara/api/recipe";

export default function RecipeContent({ recipe }: RecipePageData) {
  const [servings, setServings] = useState(recipe.servings);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);

  const displayedIngredients = showAllIngredients
    ? recipe.ingredients
    : recipe.ingredients.slice(0, 6);

  const displayedInstructions = showAllInstructions
    ? recipe.instructions
    : recipe.instructions.slice(0, 3);

  const scaleIngredient = (ingredient: ReadIngredientDto) => {
    // This is a simple scaling implementation
    // In a real app, you'd want more sophisticated ingredient parsing and scaling
    const amount =
      parseFloat(ingredient.quantity) * (servings / recipe.servings);
    if (isNaN(amount)) {
      return `${ingredient.quantity} ${ingredient.name}`;
    }
    return `${amount} ${ingredient.name}`;
  };

  return (
    <div className="space-y-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setServings(Math.max(1, servings - 1))}
            disabled={servings <= 1}
          >
            -
          </Button>
          <span className="min-w-[40px] text-center">{servings}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setServings(servings + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {displayedIngredients.map((ingredient, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                {scaleIngredient(ingredient)}
              </li>
            ))}
          </ul>

          {recipe.ingredients.length > 6 && (
            <Button
              variant="ghost"
              className="mt-4 w-full text-orange-500 hover:text-orange-600"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
            >
              {showAllIngredients ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show All {recipe.ingredients.length} Ingredients
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
      <h2 className="mb-4 text-2xl font-bold">Instructions</h2>
      <div className="space-y-4">
        {displayedInstructions.map((instruction: ReadInstructionDto) => (
          <Card key={instruction.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  {instruction.order}
                </div>
                <p>{instruction.step}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {recipe.instructions.length > 3 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAllInstructions(!showAllInstructions)}
          >
            {showAllInstructions ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show All {recipe.instructions.length} Steps
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
