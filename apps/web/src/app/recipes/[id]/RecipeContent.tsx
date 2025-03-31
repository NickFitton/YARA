"use client";
import { createSwapy, Swapy } from "swapy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReadRecipeDto } from "@yara/api/recipe";
import { useEffect, useRef, useState } from "react";

type ContentState = "view" | "editIngredients" | "editInstructions";
export function RecipeContent({ recipe }: { recipe: ReadRecipeDto }) {
  const [state, setState] = useState<ContentState>("view");
  const swapy = useRef<Swapy | null>(null);
  const container = useRef<HTMLUListElement | null>(null);

  const editIngredients = () => {
    setState("editIngredients");
    swapy?.current?.enable(true);
  };
  const view = () => {
    setState("view");
    swapy?.current?.enable(false);
  };

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current, { enabled: false });

      // Your event listeners
      swapy.current.onSwap((event) => {
        console.log("swap", event);
      });
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);
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
              {recipe.instructions.map((instruction) => {
                switch (state) {
                  case "editIngredients":
                  default:
                    return (
                      <li
                        key={instruction.id}
                        className="list-decimal marker:text-orange-500 ml-5"
                      >
                        {instruction.step}
                      </li>
                    );
                }
              })}
            </ol>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

type ActionProps = {
  state: ContentState;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};
function IngredientActions({ state, onEdit, onCancel, onSave }: ActionProps) {
  switch (state) {
    case "editIngredients":
      return (
        <>
          <Button onClick={onSave}>Save</Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </>
      );
    default:
      return (
        <Button variant="link" onClick={onEdit}>
          Edit
        </Button>
      );
  }
}

function InstructionActions({ state, onEdit, onCancel, onSave }: ActionProps) {
  switch (state) {
    case "editInstructions":
      return (
        <>
          <Button onClick={onSave}>Save</Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </>
      );
    default:
      return (
        <Button variant="link" onClick={onEdit}>
          Edit
        </Button>
      );
  }
}
