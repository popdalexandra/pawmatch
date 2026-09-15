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

// Mock bcryptjs to include both hash and compare
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$2a$10$mockedhashedpassword"),
    compare: vi.fn(),
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

describe("AuthService - Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw an error if user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    await expect(
      AuthService.login({
        email: "nonexistent@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid email or password")

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    })
    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it("should throw an error if password does not match", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      passwordHash: "$2a$10$mockedhashedpassword",
    } as never)

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      AuthService.login({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid email or password")

    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "$2a$10$mockedhashedpassword")
  })

  it("should return user object on valid credentials", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "$2a$10$mockedhashedpassword",
      role: "ADOPTER",
      createdAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await AuthService.login({
      email: "test@example.com",
      password: "correctpassword",
    })

    expect(bcrypt.compare).toHaveBeenCalledWith("correctpassword", "$2a$10$mockedhashedpassword")
    expect(result).toEqual({
      id: "user-123",
      email: "test@example.com",
      role: "ADOPTER",
      createdAt: expect.any(Date),
    })
  })
})