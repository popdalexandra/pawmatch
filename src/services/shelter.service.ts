import { prisma } from "@/lib/prisma"

export interface CreateShelterInput {
  name: string
  location: string
  contactEmail?: string
  phone?: string
}

export interface UpdateShelterInput {
  name?: string
  location?: string
  contactEmail?: string
  phone?: string
}

export class ShelterService {
  // 1. GET ALL
  static async getAllShelters() {
    return await prisma.shelter.findMany({
      include: {
        pets: true, // Includes all linked pets in the response!
      },
    })
  }

  // 2. GET BY ID
  static async getShelterById(id: string) {
    const shelter = await prisma.shelter.findUnique({
      where: { id },
      include: {
        pets: true,
      },
    })
    if (!shelter) {
      throw new Error("Shelter not found")
    }
    return shelter
  }

  // 3. CREATE
  static async createShelter(data: CreateShelterInput) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Shelter name is required")
    }
    if (!data.location || data.location.trim() === "") {
      throw new Error("Shelter location is required")
    }

    return await prisma.shelter.create({
      data,
    })
  }

  // 4. UPDATE
  static async updateShelter(id: string, data: UpdateShelterInput) {
    // Verify shelter exists first
    await this.getShelterById(id)

    return await prisma.shelter.update({
      where: { id },
      data,
    })
  }

  // 5. DELETE
  static async deleteShelter(id: string) {
    await this.getShelterById(id)

    return await prisma.shelter.delete({
      where: { id },
    })
  }
}