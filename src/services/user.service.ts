import { Prisma } from "../generated/prisma";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  return userRepository.create(data);
}
};