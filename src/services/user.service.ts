import { Prisma } from "../generated/prisma";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
    return userRepository.create(data);
  },
};