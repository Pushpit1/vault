import { Prisma } from "../generated/prisma";
import { userRepository } from "../repositories/user.repository";
import { hashPassword } from "../utils/auth/password";
export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }
const hashedPassword = await hashPassword(data.password);

  return userRepository.create({
  ...data,
  password: hashedPassword,
});

}
};