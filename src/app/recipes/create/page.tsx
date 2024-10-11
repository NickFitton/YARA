"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { createRecipe } from "./create.action";

const createInstructionSchema = z.object({
  step: z.string().min(1, "Step is required"),
});

const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const createRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  instructions: z
    .array(createInstructionSchema)
    .min(1, "At least one instruction is required"),
  ephemeralInstruction: z.string().optional(),
  ingredients: z
    .array(createIngredientSchema)
    .min(1, "At least one ingredient is required"),
  ephemeralIngredient: z.object({
    name: z.string(),
    quantity: z.string(),
  }),
});
type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const externalCreateRecipeSchema = createRecipeSchema.extend({
  instructions: z.array(createInstructionSchema.extend({ order: z.number() })),
});
type ExternalCreateRecipeSchema = z.infer<typeof externalCreateRecipeSchema>;

const toExternal = ({
  instructions,
  ...rest
}: CreateRecipeSchema): ExternalCreateRecipeSchema => {
  const externalInstructions = instructions.map(({ step }, i) => ({
    step,
    order: i + 1,
  }));
  return { ...rest, instructions: externalInstructions };
};

export default function CreateRecipePage() {
  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: [],
      ingredients: [],
      ephemeralIngredient: {
        name: "",
        quantity: "",
      },
      ephemeralInstruction: "",
    },
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
    swap: swapInstructions,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    swap: swapIngredients,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const moveInstructionDown = (i: number) => swapInstructions(i, i + 1);
  const moveInstructionUp = (i: number) => swapInstructions(i, i - 1);
  const moveIngredientUp = (i: number) => swapIngredients(i, i - 1);
  const moveIngredientDown = (i: number) => swapIngredients(i, i + 1);

  const checkEphemeralIngredient = () => {
    const { name, quantity } = form.getValues().ephemeralIngredient;

    if (name?.trim() || quantity?.trim()) {
      appendIngredient({ name: name || "", quantity: quantity || "" });
      if (!name?.trim()) {
        setTimeout(
          () => form.setFocus(`ingredients.${ingredientFields.length}.name`),
          1
        );
      } else if (quantity?.trim()) {
        setTimeout(
          () =>
            form.setFocus(`ingredients.${ingredientFields.length}.quantity`),
          1
        );
      }
      form.setValue("ephemeralIngredient", { name: "", quantity: "" });
    }
  };

  const checkEphemeralInstruction = () => {
    const step = form.getValues().ephemeralInstruction;
    if (step?.trim()) {
      appendInstruction({ step });
      form.setValue("ephemeralInstruction", "");
      setTimeout(() => form.setFocus("ephemeralInstruction"), 1);
    }
  };

  async function onSubmit(data: CreateRecipeSchema) {
    console.log(data);
    const external = toExternal(data)
    
    try {
        const response = await createRecipe(external)
        console.log(response)
    }catch (e: unknown) {
        console.error(e);
    }

    
    // Here you would typically send the data to your backend
    alert("Recipe saved successfully!");
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Save New Recipe</CardTitle>
          <CardDescription>
            Fill in the details of your new recipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recipe name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter recipe description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <ul>
                  {ingredientFields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <span className="font-medium">•</span>
                      <div className="flex-grow flex flex-row gap-2">
                        <div className="w-32">
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 ? (
                                  <FormLabel>Quantity</FormLabel>
                                ) : null}
                                <FormControl>
                                  <Input placeholder="100g" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-grow">
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 ? (
                                  <FormLabel>Name</FormLabel>
                                ) : null}
                                <FormControl>
                                  <Input
                                    placeholder="Ingredient name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveIngredientUp(index)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index + 1 === ingredientFields.length}
                        onClick={() => moveIngredientDown(index)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                  <li className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">•</span>
                    <div className="flex-grow flex flex-row gap-2">
                      <div className="w-32">
                        <FormField
                          control={form.control}
                          name={`ephemeralIngredient.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  onBlur={checkEphemeralIngredient}
                                  placeholder="Quantity (100g)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-grow">
                        <FormField
                          control={form.control}
                          name={`ephemeralIngredient.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  onBlur={checkEphemeralIngredient}
                                  placeholder="Ingredient name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Instructions</h3>
                <ol>
                  {instructionFields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      <div className="flex-grow">
                        <FormField
                          control={form.control}
                          name={`instructions.${index}.step`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Enter recipe description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveInstructionUp(index)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index + 1 === instructionFields.length}
                        onClick={() => moveInstructionDown(index)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                  <li className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">
                      {instructionFields.length + 1}.
                    </span>
                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name={`ephemeralInstruction`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                onBlur={checkEphemeralInstruction}
                                placeholder="Describe step"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </li>
                </ol>
              </div>

              <Button type="submit">
                <Save className="h-4 w-4 mr-2" /> Save Recipe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
