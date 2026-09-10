import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isFacultyAuthenticated } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.studentCard.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error: unknown) {
    console.error('Fetch student by id failed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve student record' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Student records are strictly immutable and cannot be deleted.' },
    { status: 403 }
  );
}
