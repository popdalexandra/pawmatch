import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export interface RegisterUserInput {
  email: string
  password: string
  role?: UserRole
}

export interface LoginUserInput {
  email: string
  password: string
}

export class AuthService {
  private static SALT_ROUNDS = 10

  /**
   * Registers a new user with a hashed password
   */
  static async register(data: RegisterUserInput) {
    const { email, password, role } = data

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // 2. Hash password securely
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS)

    // 3. Create user record
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

  /**
   * Verifies user credentials during login
   */
  static async login(data: LoginUserInput) {
    const { email, password } = data

    // 1. Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Generic error message prevents account enumeration attacks
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // 2. Compare password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // 3. Return sanitized user object (excluding passwordHash)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }
  }
}