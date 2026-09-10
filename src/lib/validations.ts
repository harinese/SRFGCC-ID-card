import { z } from 'zod';
import { COURSES, YEARS, BLOOD_GROUPS } from './types';

export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters'),
  dob: z
    .string()
    .trim()
    .min(4, 'Valid date of birth is required'),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian phone number'),
  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(300, 'Address must be under 300 characters'),
  course: z.enum(COURSES, {
    errorMap: () => ({ message: 'Please select a valid course' }),
  }),
  year: z.enum(YEARS, {
    errorMap: () => ({ message: 'Please select a valid academic year' }),
  }),
  regNo: z
    .string()
    .trim()
    .min(3, 'Registration number is required')
    .max(30, 'Registration number is too long')
    .transform((val) => val.toUpperCase()),
  aadhaarNo: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^\d{12}$/.test(val), {
      message: 'Aadhaar number must be exactly 12 digits',
    }),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: 'Please select a valid blood group' }),
  }),
  photoUrl: z
    .string()
    .min(10, 'Student photograph is required'),
});

export type StudentSchemaType = z.infer<typeof studentSchema>;
