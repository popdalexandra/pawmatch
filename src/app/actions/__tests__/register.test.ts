import { describe, it, expect, vi, beforeEach } from "vitest"
import { registerAdopter } from "../register"
import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe("registerAdopter Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns an error if email or password are missing", async () => {
    const formData = new FormData()
    formData.append("email", "")
    formData.append("password", "")

    const result = await registerAdopter(formData)
    expect(result.error).toBe("Email and password are required.")
  })

  it("returns an error if user already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "user-1",
      email: "existing@example.com",
    } as unknown as User)

    const formData = new FormData()
    formData.append("email", "existing@example.com")
    formData.append("password", "Password123!")

    const result = await registerAdopter(formData)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
    })
    expect(result.error).toBe("An account with this email already exists.")
  })

  it("creates user and profile on valid registration", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: "user-new",
      email: "new@example.com",
    } as unknown as User)

    const formData = new FormData()
    formData.append("email", "new@example.com")
    formData.append("password", "Password123!")

    const result = await registerAdopter(formData)

    expect(prisma.user.create).toHaveBeenCalledTimes(1)
    expect(result.success).toBe(true)
  })
})