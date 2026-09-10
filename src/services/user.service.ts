import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export interface CreateUserInput {
  email: string
  name?: string
  passwordHash?: string
  role?: UserRole
}

export interface UpdateUserInput {
  email?: string
  name?: string
  passwordHash?: string
  role?: UserRole
}

export class UserService {
  // 1. GET ALL
  static async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        applications: true,
      },
    })
  }

  // 2. GET BY ID
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    })
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  // 3. CREATE
  static async createUser(data: CreateUserInput) {
    if (!data.email || data.email.trim() === "") {
      throw new Error("Email is required")
    }

    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash || "temporary_hash_placeholder",
        role: data.role || UserRole.ADOPTER,
      },
    })
  }

  // 4. UPDATE
  static async updateUser(id: string, data: UpdateUserInput) {
    await this.getUserById(id)
    return await prisma.user.update({
      where: { id },
      data,
    })
  }

  // 5. DELETE
  static async deleteUser(id: string) {
    await this.getUserById(id)
    return await prisma.user.delete({
      where: { id },
    })
  }
}