//integrate .parse() into service methods so invalid data is intercepted at runtime before reaching Prisma.

import { prisma } from "@/lib/prisma"
import { createPetSchema, CreatePetInput } from "@/lib/validations/schemas"

export class PetService {
  static async createPet(input: CreatePetInput) {
    const validatedData = createPetSchema.parse(input)

    return await prisma.pet.create({
      data: validatedData,
    })
  }

  static async getPetById(id: string) {
    return await prisma.pet.findUnique({
      where: { id },
      include: { shelter: true },
    })
  }

  static async listAvailablePets() {
    return await prisma.pet.findMany({
      where: { status: "AVAILABLE" },
    })
  }
}