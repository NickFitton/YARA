"use client";

import {
  ChefHat,
  FileText,
  Puzzle,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { TabCard } from "./TabCard";
import { z } from "zod";
import { updateRecipeSchema } from "@yara/api/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RecipePageData } from "../types";
import { Form } from "@/components/ui/form";
import { updateRecipe } from "./update.action";
import { toast } from "@/hooks/use-toast";
import { Field } from "@/components/organisms/fields/Field";
import { useStaleFormUpdate } from "./hooks";

const incompleteSchema = z.object({
  prep: z.number().min(1).optional(),
  cook: z.number().min(1).optional(),
  servings: z.number().min(1).optional(),
  difficulty: z.number().min(1).max(5).optional(),
});
const basicInformationSchema = updateRecipeSchema
  .pick({
    name: true,
    description: true,
  })
  .merge(incompleteSchema);

const emptyNumberValue = "" as unknown as number;

export default function BasicInformationEditor({ recipe }: RecipePageData) {
  const defaultValues = {
    name: recipe.name,
    description: recipe.description,
    prep: emptyNumberValue,
    cook: emptyNumberValue,
    servings: emptyNumberValue,
    difficulty: emptyNumberValue,
  };
  const form = useForm<z.infer<typeof basicInformationSchema>>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: { ...defaultValues },
  });

  const onSubmit = async (values: z.infer<typeof basicInformationSchema>) => {
    const response = await updateRecipe(recipe.id, values);
    toast({
      title: "Changes saved",
      description: "Basic Information updated",
    });
    console.log(response);
  };
  useStaleFormUpdate(form, onSubmit);

  return (
    <TabCard
      title="Basic Information"
      subtitle="Edit the core details of your recipe"
      tabValue="basic"
      Icon={FileText}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field.Text control={form.control} name="name" label="Recipe Name" />
          <Field.TextArea
            control={form.control}
            name="description"
            label="Description"
          />
          <div className="grid grid-cols-4 gap-5">
            <Field.Number
              control={form.control}
              name="prep"
              label="Prep Time"
              Icon={UtensilsCrossed}
            />
            <Field.Number
              control={form.control}
              name="cook"
              label="Cook Time"
              Icon={ChefHat}
            />
            <Field.Number
              control={form.control}
              name="servings"
              label="Servings"
              Icon={Users}
            />
            <Field.Select
              control={form.control}
              name="difficulty"
              label="Difficulty"
              Icon={Puzzle}
            />
          </div>
        </form>
      </Form>
    </TabCard>
  );
}
