import prisma from "../db/prisma";
import { userService } from "../services/user.service";

async function main() {
  console.log("🚀 Starting service test...");

  const users = await userService.getAllUsers();

  console.log("Users:", users);

}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });