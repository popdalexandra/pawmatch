import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export interface RegisterUserInput {
  email: string
  password: string
  role?: UserRole
}

export class AuthService {
  private static SALT_ROUNDS = 10

  /**
   * Registers a new user with a hashed password
   */
  static async register(data: RegisterUserInput) {
    const { email, password, role } = data

    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address")
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password securely
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS)

    // Create user record
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || UserRole.ADOPTER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return user
  }
}