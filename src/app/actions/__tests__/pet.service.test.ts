import { describe, it, expect, vi, beforeEach } from "vitest"
import { PetService } from "@/services/pet.service"


vi.mock("@/lib/prisma", () => ({
  prisma: {
    pet: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

describe("PetService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw an error if pet name is empty", async () => {
    await expect(
      PetService.createPet({
        name: "",
        species: "Dog",
        age: 2,
        shelterId: "shelter-1",
      })
    ).rejects.toThrow("Pet name is required")
  })

  it("should throw an error if pet age is negative", async () => {
    await expect(
      PetService.createPet({
        name: "Max",
        species: "Dog",
        age: -1,
        shelterId: "shelter-1",
      })
    ).rejects.toThrow("Pet age cannot be negative")
  })
})