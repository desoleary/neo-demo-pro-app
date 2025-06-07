import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodSchema } from 'zod';

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
}

export interface FormSchema<T extends z.ZodTypeAny> {
  fields: FieldConfig[];
  validation: T;
}

export function DynamicForm<T extends z.ZodTypeAny>({
  schema,
  onSubmit,
}: {
  schema: FormSchema<T>;
  onSubmit: (values: z.infer<T>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({ resolver: zodResolver(schema.validation) });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {schema.fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type}
            className="border p-1"
            {...register(field.name as any)}
          />
          {errors[field.name as keyof typeof errors] && (
            <span role="alert" className="text-red-500 text-sm">
              {(errors as any)[field.name]?.message as string}
            </span>
          )}
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-1">
        Submit
      </button>
    </form>
  );
}
