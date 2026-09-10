import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { studentSchema } from '@/lib/validations';
import { isFacultyAuthenticated } from '@/lib/auth';
import { COURSES, YEARS } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const result = studentSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, dob, mobile, address, course, year, regNo, aadhaarNo, bloodGroup, photoUrl } =
      result.data;

    // Check for duplicate registration number
    const existingReg = await prisma.studentCard.findUnique({
      where: { regNo },
    });

    if (existingReg) {
      return NextResponse.json(
        { error: `Registration number ${regNo} is already registered.` },
        { status: 409 }
      );
    }

    // Check for duplicate Aadhaar number
    const existingAadhaar = await prisma.studentCard.findUnique({
      where: { aadhaarNo },
    });

    if (existingAadhaar) {
      return NextResponse.json(
        { error: 'A student with this Aadhaar number is already registered.' },
        { status: 409 }
      );
    }

    const newStudent = await prisma.studentCard.create({
      data: {
        name,
        dob,
        mobile,
        address,
        course,
        year,
        regNo,
        aadhaarNo,
        bloodGroup,
        photoUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Student details registered successfully',
        data: newStudent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving student details' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authenticated = await isFacultyAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized faculty access' },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const course = url.searchParams.get('course')?.trim() || '';
    const year = url.searchParams.get('year')?.trim() || '';

    const where: any = {};

    if (course && course !== 'all') {
      where.course = course;
    }

    if (year && year !== 'all') {
      where.year = year;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { regNo: { contains: search } },
        { mobile: { contains: search } },
        { aadhaarNo: { contains: search } },
      ];
    }

    const [students, totalCount, allStudents] = await Promise.all([
      prisma.studentCard.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.studentCard.count({ where }),
      prisma.studentCard.findMany({
        select: { course: true, year: true },
      }),
    ]);

    // Build aggregations for stats
    const byCourse: Record<string, number> = {};
    for (const c of COURSES) {
      byCourse[c] = 0;
    }
    const byYear: Record<string, number> = {};
    for (const y of YEARS) {
      byYear[y] = 0;
    }

    for (const s of allStudents) {
      if (byCourse[s.course] !== undefined) {
        byCourse[s.course] += 1;
      } else {
        byCourse[s.course] = 1;
      }
      if (byYear[s.year] !== undefined) {
        byYear[s.year] += 1;
      } else {
        byYear[s.year] = 1;
      }
    }

    return NextResponse.json({
      students,
      total: totalCount,
      stats: {
        total: allStudents.length,
        byCourse,
        byYear,
      },
    });
  } catch (error: unknown) {
    console.error('Fetch students error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve students records' },
      { status: 500 }
    );
  }
}
