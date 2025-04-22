import { useEffect, useRef } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useStaleFormUpdate<T extends FieldValues>(
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
