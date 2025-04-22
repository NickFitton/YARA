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
  UseFormReturn,
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
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRecipe } from "./update.action";
import { toast } from "@/hooks/use-toast";

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

function NumberField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field }) => (
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]+"
          placeholder={placeholder}
          {...field}
        />
      )}
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
>({
  control,
  name,
  Icon,
  label,
}: {
  label: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  name: TName;
  control: Control<TFieldValues>;
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormLabel className="flex gap-1 items-center">
            {Icon ? <Icon className="w-4 h-4 text-orange-500" /> : null}
            {label}
          </FormLabel>
          <Select onValueChange={onChange} defaultValue={value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="1" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {new Array(5).fill(0).map((_, i) => (
                <SelectItem key={i} value={i + 1 + ""}>
                  {i + 1}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
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

const emptyNumberValue = "" as unknown as number;

function useFormInactivity<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (formData: T) => Promise<void> | void
) {
  const formValues = form.watch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSubmit(formValues);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onSubmit, formValues]);
}

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
  useFormInactivity(form, onSubmit);

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
          <div className="grid grid-cols-4 gap-5">
            <NumberField
              control={form.control}
              name="prep"
              label="Prep Time"
              Icon={UtensilsCrossed}
            />
            <NumberField
              control={form.control}
              name="cook"
              label="Cook Time"
              Icon={ChefHat}
            />
            <NumberField
              control={form.control}
              name="servings"
              label="Servings"
              Icon={Users}
            />
            <SelectField
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
