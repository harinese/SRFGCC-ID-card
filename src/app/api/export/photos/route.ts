import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { prisma } from '@/lib/db';
import { isFacultyAuthenticated } from '@/lib/auth';

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

    const zip = new JSZip();
    let count = 0;

    for (const student of students) {
      if (!student.photoUrl) continue;

      try {
        let base64Data = student.photoUrl;
        let ext = 'jpg';

        if (base64Data.startsWith('data:image/')) {
          const match = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
          if (match && match[1]) {
            ext = match[1] === 'jpeg' ? 'jpg' : match[1];
          }
          base64Data = base64Data.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, '');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const sanitizedName = student.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${student.regNo}_${sanitizedName}.${ext}`;

        zip.file(filename, buffer);
        count++;
      } catch (err) {
        console.error(`Failed to pack photo for ${student.regNo}:`, err);
      }
    }

    if (count === 0) {
      return NextResponse.json(
        { error: 'No student photos available to export for the selected filter.' },
        { status: 404 }
      );
    }

    const zipBuffer = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
    const timestamp = new Date().toISOString().split('T')[0];
    const zipFilename = `SRFGCC_Student_Photos_${course || 'All'}_${timestamp}.zip`;

    return new Response(zipBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error('Photos export failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate photos ZIP export' },
      { status: 500 }
    );
  }
}
