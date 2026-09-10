const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.studentCard.findUnique({
    where: { regNo: 'U15HS2450135' },
  });

  if (!existing) {
    await prisma.studentCard.create({
      data: {
        name: 'Purushotham S. R.',
        dob: '14/12/2006',
        mobile: '6361455101',
        address: 'Molakalmuru, Chitradurga , Belagavi.',
        course: 'B.Sc.',
        year: 'I Year',
        regNo: 'U15HS2450135',
        aadhaarNo: '700236298556',
        bloodGroup: 'AB+ve',
        photoUrl: '',
      },
    });
    console.log('Seeded sample student: Purushotham S. R.');
  } else {
    console.log('Sample student already present in database.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
