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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isFacultyAuthenticated(request);
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized. Faculty authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.studentCard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Student record deleted' });
  } catch (error: unknown) {
    console.error('Delete student failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete student record' },
      { status: 500 }
    );
  }
}
