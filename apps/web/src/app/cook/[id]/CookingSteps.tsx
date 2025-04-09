"use client";

import { RecipePageData } from "@/app/recipes/[id]/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ReadIngredientDto } from "@yara/api/recipe";
import { UtensilsCrossed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type StepProps = {
  currentNumber: number;
};

function StepIndicator({
  currentNumber,
  stepCount,
}: {
  stepCount: number;
} & StepProps) {
  const stepBubbles = new Array(stepCount * 2 + 1).fill(0).map((_, i) => i);
  console.log(stepBubbles);
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 items-center">
        {stepBubbles.map((i) => {
          const number = i / 2;
          const isStep = i % 2 === 0;
          return isStep ? (
            <div
              key={number}
              className={`w-8 h-8 ${number <= currentNumber ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500"} flex justify-center items-center rounded-full`}
            >
              {number === 0 ? (
                <UtensilsCrossed className="w-4" />
              ) : (
                <span className="align-middle">{number}</span>
              )}
            </div>
          ) : (
            <div key={number + "-divider"} className="w-4 border-b-2"></div>
          );
        })}
      </div>
    </div>
  );
}

function Ingredient({ name, quantity, id }: ReadIngredientDto) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {name}
        </label>
        <p className="text-sm text-muted-foreground">{quantity}</p>
      </div>
    </div>
  );
}

function Equipment({ equipment }: { equipment: string }) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id={equipment} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={equipment}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {equipment}
        </label>
      </div>
    </div>
  );
}

function Prep(props: RecipePageData) {
  return (
    <div>
      <p>
        Before you start cooking, make sure you&apos;ve got everything ready:
      </p>
      <section>
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {props.recipe.ingredients.map((ingredient) => (
            <Ingredient key={ingredient.id} {...ingredient} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold">Equipment</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {props.recipe.equipment.map((equipment) => {
            return <Equipment key={equipment} equipment={equipment} />;
          })}
        </div>
      </section>
    </div>
  );
}
function Step(props: RecipePageData & { step: number }) {
  const instruction = props.recipe.instructions.find(
    ({ order }) => order === props.step
  )!;
  return (
    <div className="flex flex-col gap-4">
      <section>
        <p>{instruction.step}</p>
      </section>
      <section>
        <h3 className="font-semibold">Ingredients for this step:</h3>
        <div className="flex gap-2 p-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-800">
            Salt
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-800">
            Pepper
          </Badge>
        </div>
      </section>
      <section>
        <h3 className="font-semibold">Ingredients for this step:</h3>
        <div className="flex gap-2 p-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            Whisk
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            Burner
          </Badge>
        </div>
      </section>
    </div>
  );
}

function InstructionCard({
  recipe,
  currentNumber,
}: StepProps & RecipePageData) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentNumber === 0
              ? "Prepare Your Ingredients"
              : `Step ${currentNumber}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentNumber === 0 ? (
            <Prep recipe={recipe} />
          ) : (
            <Step recipe={recipe} step={currentNumber} />
          )}
        </CardContent>
      </Card>
      <Actions
        currentNumber={currentNumber}
        steps={recipe.instructions.length}
      />
    </div>
  );
}

function Actions({ currentNumber, steps }: StepProps & { steps: number }) {
  const isFirstStep = currentNumber === 0;
  const isLastStep = currentNumber === steps;
  console.log(isLastStep, currentNumber, steps);
  const r = useRouter();
  return (
    <div className="grid grid-cols-[1fr_auto_1fr]">
      {isFirstStep ? (
        <div />
      ) : (
        <Button
          className="h-12"
          variant="outline"
          onClick={() => r.replace(`?s=${currentNumber - 1}`)}
        >
          Previous
        </Button>
      )}
      <div className="w-20"></div>
      {isLastStep ? (
        <div />
      ) : (
        <Button
          className="h-12 font-semibold"
          onClick={() => r.replace(`?s=${currentNumber + 1}`)}
        >
          Next
        </Button>
      )}
    </div>
  );
}

export default function CookingSteps({ recipe }: RecipePageData) {
  const searchParams = useSearchParams();
  const stepCount = recipe.instructions.length;
  const step = Math.min(
    Math.max(parseInt(searchParams.get("s") ?? "0"), 0),
    stepCount
  );
  return (
    <div className="flex flex-col gap-8 ml-8 mr-8">
      <StepIndicator stepCount={stepCount} currentNumber={step} />
      <InstructionCard recipe={recipe} currentNumber={step} />
    </div>
  );
}
