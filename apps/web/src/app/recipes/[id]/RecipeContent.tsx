"use client";
import { createSwapy, Swapy } from "swapy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReadRecipeDto } from "@yara/api/recipe";
import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">Ingredients</h2>
          <IngredientActions
            state={state}
            onEdit={editIngredients}
            onSave={() => console.log("on ingredients save")}
            onCancel={view}
          />
        </div>
        <Card className="p-4">
          <CardContent className={state === "view" ? "p-0 pl-px ml-px" : "p-0"}>
            <ul className="flex flex-col gap-2" ref={container}>
              {recipe.ingredients.map((ingredient) => {
                return (
                  <li
                    data-swapy-slot={ingredient.id}
                    key={ingredient.id}
                    className={
                      state === "editIngredients"
                        ? "list-none marker:text-orange-500"
                        : "list-disc marker:text-orange-500 ml-5"
                    }
                  >
                    <div data-swapy-item={ingredient.id} className="flex gap-2">
                      {state === "editIngredients" ? (
                        <GripVertical className="my-auto h-4 text-orange-500" />
                      ) : null}
                      <Input
                        value={ingredient.quantity}
                        className={
                          state === "editIngredients" ? "w-24" : "w-24 ml-2"
                        }
                        disabled={state === "view"}
                      />
                      <Input
                        value={ingredient.name}
                        disabled={state === "view"}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
      <section id="instructions">
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">Instructions</h2>
          <InstructionActions
            state={state}
            onEdit={() => setState("editInstructions")}
            onSave={() => console.log("on instructions save")}
            onCancel={() => setState("view")}
          />
        </div>
        <Card className="p-4">
          <CardContent className="pb-0">
            <ol className="flex flex-col gap-2">
              {recipe.instructions.map((instruction) => {
                switch (state) {
                  case "editIngredients":
                  default:
                    return (
                      <li
                        key={instruction.id}
                        className="list-decimal marker:text-orange-500"
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
        <div className="flex gap-2">
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
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
        <div className="flex gap-2">
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      );
    default:
      return (
        <Button variant="link" onClick={onEdit}>
          Edit
        </Button>
      );
  }
}
