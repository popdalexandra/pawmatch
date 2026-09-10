import { describe, it, expect, vi, beforeEach } from "vitest"
import { ShelterService } from "@/services/shelter.service"
import { prisma } from "@/lib/prisma"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    shelter: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe("ShelterService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw an error if shelter name is empty", async () => {
    await expect(
      ShelterService.createShelter({
        name: "",
        location: "Timișoara",
      })
    ).rejects.toThrow("Shelter name is required")
  })

  it("should throw an error if shelter location is empty", async () => {
    await expect(
      ShelterService.createShelter({
        name: "Happy Paws",
        location: "",
      })
    ).rejects.toThrow("Shelter location is required")
  })

  it("should create a shelter when input is valid", async () => {
    const mockShelter = {
      id: "shelter-1",
      name: "Happy Paws",
      location: "Timișoara",
    }

    vi.mocked(prisma.shelter.create).mockResolvedValue(mockShelter as never)

    const result = await ShelterService.createShelter({
      name: "Happy Paws",
      location: "Timișoara",
    })

    expect(prisma.shelter.create).toHaveBeenCalledWith({
      data: {
        name: "Happy Paws",
        location: "Timișoara",
      },
    })
    expect(result).toEqual(mockShelter)
  })
})