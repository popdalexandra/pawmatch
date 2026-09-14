import { describe, it, expect, vi, beforeEach } from "vitest"
import { ZodError } from "zod"
import { createPetSchema } from "@/lib/validations/schemas"
import { PetService } from "@/services/pet.validation.service"
import { ApplicationService } from "@/services/application.validation.service"
import { prisma } from "@/lib/prisma"

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pet: { create: vi.fn() },
    application: { create: vi.fn() },
  },
}))

describe("Task: Schema Definition Unit Tests", () => {
  it("should validate a correct pet payload", () => {
    const validPet = {
      name: "Buddy",
      species: "Dog",
      age: 2,
      housingRequirement: "HOUSE",
      childFriendly: true,
      dogFriendly: true,
      catFriendly: false,
      energyLevel: "HIGH",
      shelterId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const result = createPetSchema.safeParse(validPet)
    expect(result.success).toBe(true)
  })

  it("should fail validation for negative age or invalid UUID", () => {
    const invalidPet = {
      name: "Buddy",
      species: "Dog",
      age: -1,
      housingRequirement: "HOUSE",
      childFriendly: true,
      dogFriendly: true,
      catFriendly: false,
      energyLevel: "HIGH",
      shelterId: "invalid-uuid",
    }

    const result = createPetSchema.safeParse(invalidPet)
    expect(result.success).toBe(false)
  })
})

describe("Task: Service Layer Runtime Zod Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw ZodError and not call Prisma when PetService receives invalid input", async () => {
    const invalidPet = {
      name: "Max",
      species: "Dog",
      age: -5,
      housingRequirement: "HOUSE",
      childFriendly: true,
      dogFriendly: true,
      catFriendly: false,
      energyLevel: "HIGH",
      shelterId: "123e4567-e89b-12d3-a456-426614174000",
    }

    await expect(PetService.createPet(invalidPet as never)).rejects.toThrow(ZodError)
    expect(prisma.pet.create).not.toHaveBeenCalled()
  })

  it("should successfully parse valid input and create pet in Prisma", async () => {
    const validPet = {
      name: "Max",
      species: "Dog",
      age: 3,
      housingRequirement: "HOUSE" as const,
      childFriendly: true,
      dogFriendly: true,
      catFriendly: false,
      energyLevel: "HIGH" as const,
      shelterId: "123e4567-e89b-12d3-a456-426614174000",
    }

    vi.mocked(prisma.pet.create).mockResolvedValue({ id: "pet-1", ...validPet } as never)

    const result = await PetService.createPet(validPet)

    expect(prisma.pet.create).toHaveBeenCalledWith({ data: validPet })
    expect(result.id).toBe("pet-1")
  })

  it("should throw ZodError when ApplicationService receives empty strings", async () => {
    const invalidApp = { userId: "", petId: "" }

    await expect(ApplicationService.createApplication(invalidApp)).rejects.toThrow(ZodError)
    expect(prisma.application.create).not.toHaveBeenCalled()
  })
})