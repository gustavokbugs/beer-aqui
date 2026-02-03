import { useForm as useReactHookForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export const useForm = <T extends Record<string, any>>(
  schema: ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) => {
  return useReactHookForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
};
