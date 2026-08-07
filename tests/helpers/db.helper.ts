import { prisma } from "../../src/config/prisma";

export async function cleanupUser(
  email: string
) {
  await prisma.user.deleteMany({
    where: {
      email,
    },
  });
}

export async function cleanupAll() {
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.user.deleteMany();
}