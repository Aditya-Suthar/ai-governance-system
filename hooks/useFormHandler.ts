import { useState, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

interface UseFormHandlerOptions<T> {
  schema?: z.ZodSchema;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
}

export function useFormHandler<T>({
  schema,
  onSubmit,
  onSuccess,
}: UseFormHandlerOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (formData: unknown) => {
      try {
        setIsLoading(true);
        setErrors({});

        // Validate with schema if provided
        let validatedData = formData;
        if (schema) {
          const result = schema.safeParse(formData);
          if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
              const path = error.path.join('.');
              fieldErrors[path] = error.message;
            });
            setErrors(fieldErrors);
            toast.error('Please fix the errors in the form');
            return;
          }
          validatedData = result.data;
        }

        // Call submit handler
        await onSubmit(validatedData as T);
        
        // Success callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
        console.error('Form submission error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [schema, onSubmit, onSuccess]
  );

  return {
    isLoading,
    errors,
    handleSubmit,
  };
}
