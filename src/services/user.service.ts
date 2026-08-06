import { Prisma } from "../generated/prisma";
import { userRepository } from "../repositories/user.repository";
import {
  comparePassword,
  hashPassword,
} from "../utils/auth/password";
import { generateAccessToken } from "../utils/jwt/token";
import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(
  "Invalid email or password"
);
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
  "Invalid email or password"
);
    }

   const accessToken = generateAccessToken(
  user.id,
  user.email,
  user.role
);

return {
  accessToken,

  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  },
};


  },

  async getProfile(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
};