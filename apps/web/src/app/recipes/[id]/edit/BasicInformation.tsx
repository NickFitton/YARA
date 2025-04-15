"use client";

import {
  ChefHat,
  FileText,
  LucideProps,
  Puzzle,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { TabCard } from "./TabCard";
import { z } from "zod";
import { updateRecipeSchema } from "@yara/api/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
  useForm,
} from "react-hook-form";
import { RecipePageData } from "../types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  label: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  name: TName;
  control: Control<TFieldValues>;
  placeholder?: string;
}

function Field<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  Icon,
  label,
  render,
}: {
  label: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  name: TName;
  control: Control<TFieldValues>;
  placeholder?: string;
} & Pick<ControllerProps<TFieldValues, TName>, "render">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem>
          <FormLabel className="flex gap-1 items-center">
            {Icon ? <Icon className="w-4 h-4 text-orange-500" /> : null}
            {label}
          </FormLabel>
          <FormControl>{render({ field, fieldState, formState })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field }) => <Input placeholder={placeholder} {...field} />}
    />
  );
}
function TextAreaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field }) => <Textarea placeholder={placeholder} {...field} />}
    />
  );
}

function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field }) => <Textarea placeholder={placeholder} {...field} />}
    />
  );
}

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1 items-center">
                  Recipe Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TextField control={form.control} name="name" label="Recipe Name" />
          <TextAreaField
            control={form.control}
            name="description"
            label="Description"
          />
          <div className="grid grid-cols-3 gap-5">
            <TextField
              control={form.control}
              name="prep"
              label="Prep Time"
              Icon={UtensilsCrossed}
            />
            <TextField
              control={form.control}
              name="cook"
              label="Cook Time"
              Icon={ChefHat}
            />
            <TextField
              control={form.control}
              name="servings"
              label="Servings"
              Icon={Users}
            />
          </div>
          <TextField
            control={form.control}
            name="difficulty"
            label="Difficulty"
            Icon={Puzzle}
          />
        </form>
      </Form>
    </TabCard>
  );
}
