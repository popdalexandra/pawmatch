import { describe, it, expect, vi, beforeEach } from "vitest"
import { ApplicationService } from "@/services/application.service"
import { prisma } from "@/lib/prisma"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe("ApplicationService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw an error if userId is missing", async () => {
    await expect(
      ApplicationService.createApplication({
        userId: "",
        petId: "pet-1",
      })
    ).rejects.toThrow("Both userId and petId are required")
  })

  it("should throw an error if petId is missing", async () => {
    await expect(
      ApplicationService.createApplication({
        userId: "user-1",
        petId: "",
      })
    ).rejects.toThrow("Both userId and petId are required")
  })

  it("should create an application when data is valid", async () => {
    const mockAppPayload = {
      id: "app-1",
      adopterId: "user-1",
      petId: "pet-1",
      status: "SUBMITTED",
    }

    vi.mocked(prisma.application.create).mockResolvedValue(mockAppPayload as never)

    const result = await ApplicationService.createApplication({
      userId: "user-1",
      petId: "pet-1",
    })

    expect(prisma.application.create).toHaveBeenCalledWith({
      data: {
        adopter: { connect: { id: "user-1" } },
        pet: { connect: { id: "pet-1" } },
      },
    })
    expect(result).toEqual(mockAppPayload)
  })
})