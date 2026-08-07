import prisma from "../db/prisma";
import { userRepository } from "../repositories/user.repository";
import { buildUserSorting } from "../utils/sorting";
async function main() {
  const users =
  await userRepository.findAll(
    0,
    10 ,
      {} ,
        buildUserSorting({})


  );

  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });