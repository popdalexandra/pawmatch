import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthService } from "@/services/auth.service"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Mock the Prisma client module
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcryptjs to keep tests fast and predictable
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$2a$10$mockedhashedpassword"),
  },
}))

describe("AuthService - Registration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw an error if the user email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user-id",
      email: "test@example.com",
    } as never)

    await expect(
      AuthService.register({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("User with this email already exists")

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    })
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it("should hash the password and create a new user successfully", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      role: "ADOPTER",
      createdAt: new Date(),
    } as never)

    const result = await AuthService.register({
      email: "test@example.com",
      password: "password123",
    })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    })
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        passwordHash: "$2a$10$mockedhashedpassword",
        role: "ADOPTER",
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    expect(result).toEqual({
      id: "user-123",
      email: "test@example.com",
      role: "ADOPTER",
      createdAt: expect.any(Date),
    })
  })
})