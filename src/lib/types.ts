export const COURSES = [
  'B.Sc.',
  'B.Com.',
  'B.B.A.',
  'B.C.A.',
  'B.A.',
] as const;

export type CourseType = (typeof COURSES)[number];

export const YEARS = ['I Year', 'II Year', 'III Year'] as const;
export type YearType = (typeof YEARS)[number];

export const BLOOD_GROUPS = [
  'A+ve',
  'A-ve',
  'B+ve',
  'B-ve',
  'O+ve',
  'O-ve',
  'AB+ve',
  'AB-ve',
] as const;
export type BloodGroupType = (typeof BLOOD_GROUPS)[number];

export interface StudentCardRecord {
  id: string;
  name: string;
  dob: string;
  mobile: string;
  address: string;
  course: CourseType | string;
  year: YearType | string;
  regNo: string;
  aadhaarNo: string;
  bloodGroup: BloodGroupType | string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  name: string;
  dob: string;
  mobile: string;
  address: string;
  course: string;
  year: string;
  regNo: string;
  aadhaarNo: string;
  bloodGroup: string;
  photoUrl: string;
}

export interface FacultyStats {
  total: number;
  byCourse: Record<string, number>;
  byYear: Record<string, number>;
}
