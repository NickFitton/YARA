"use client";

import { FileText } from "lucide-react";
import { TabCard } from "./TabCard";
import { z } from "zod";
import { updateRecipeSchema } from "@yara/api/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RecipePageData } from "../types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const basicInformationSchema = updateRecipeSchema.pick({
  name: true,
  description: true,
});

export default function BasicInformationEditor({ recipe }: RecipePageData) {
  const form = useForm<z.infer<typeof basicInformationSchema>>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      name: recipe.name,
      description: recipe.description,
    },
  });

  const onSubmit = (values: z.infer<typeof basicInformationSchema>) => {
    console.log(values);
  };

  return (
    <TabCard
      title="Basic Information"
      subtitle="Edit the core details of your recipe"
      tabValue="basic"
      Icon={FileText}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </TabCard>
  );
}
