"use client";

import { LucideProps } from "lucide-react";
import {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

function BaseField<
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

export function TextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <BaseField
      {...fieldProps}
      render={({ field }) => <Input placeholder={placeholder} {...field} />}
    />
  );
}

export function NumberField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <BaseField
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

export function TextAreaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder = "", ...fieldProps }: FieldProps<TFieldValues, TName>) {
  return (
    <BaseField
      {...fieldProps}
      render={({ field }) => <Textarea placeholder={placeholder} {...field} />}
    />
  );
}

export function SelectField<
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

export const Field = {
  Select: SelectField,
  TextArea: TextAreaField,
  Text: TextField,
  Number: NumberField,
};
