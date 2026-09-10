import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isFacultyAuthenticated } from '@/lib/auth';

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
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

    const students = await prisma.studentCard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Sl No',
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Permanent Address',
      'Course',
      'Academic Year',
      'Registration Number',
      'Aadhaar Number',
      'Blood Group',
      'Registration Date',
    ];

    const rows = students.map((s, index) => [
      escapeCsvCell(index + 1),
      escapeCsvCell(s.name),
      escapeCsvCell(s.dob),
      escapeCsvCell(s.mobile),
      escapeCsvCell(s.address),
      escapeCsvCell(s.course),
      escapeCsvCell(s.year),
      escapeCsvCell(s.regNo),
      escapeCsvCell(s.aadhaarNo),
      escapeCsvCell(s.bloodGroup),
      escapeCsvCell(new Date(s.createdAt).toLocaleDateString('en-GB')),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SRFGCC_ID_Cards_${course || 'All'}_${timestamp}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error('CSV export failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV export' },
      { status: 500 }
    );
  }
}
