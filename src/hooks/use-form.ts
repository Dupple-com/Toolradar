"use client";

import { useState, useCallback } from "react";

interface UseFormOptions<T> {
  onSubmit?: (data: T) => Promise<void>;
  validate?: (data: T) => string | null;
}

interface UseFormReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  reset: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * A reusable form hook that handles common form state patterns.
 *
 * @example
 * const { formData, updateField, isLoading, handleSubmit } = useForm({
 *   name: "",
 *   email: "",
 * }, {
 *   onSubmit: async (data) => {
 *     await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
 *   }
 * });
 */
export function useForm<T extends Record<string, unknown>>(
  initialData: T,
  options: UseFormOptions<T> = {}
): UseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user makes changes
  }, []);

  const reset = useCallback(() => {
    setFormData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (options.validate) {
        const validationError = options.validate(formData);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      if (options.onSubmit) {
        setIsLoading(true);
        setError(null);
        try {
          await options.onSubmit(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [formData, options]
  );

  return {
    formData,
    setFormData,
    updateField,
    isLoading,
    setIsLoading,
    error,
    setError,
    reset,
    handleSubmit,
  };
}
