//The service layer is responsible for handling the business logic of the application. 
//It acts as an intermediary between the controller and the data access layer 
// (in this case, Prisma). The service layer contains methods that encapsulate the 
// core functionality of the application, such as creating, reading, updating, and 
// deleting pets. It also includes validation and business rules to ensure that the
//  data being processed is valid and consistent.

import { prisma } from "@/lib/prisma"
import { HousingType, EnergyLevel } from "@prisma/client"

// Types for creating and updating pets
export interface CreatePetInput {
  name: string
  species: string
  age: number
  shelterId: string
  housingRequirement?: HousingType
  childFriendly?: boolean
  dogFriendly?: boolean
  catFriendly?: boolean
  energyLevel?: EnergyLevel
}

export interface UpdatePetInput {
  name?: string
  species?: string
  age?: number
  housingRequirement?: HousingType
  childFriendly?: boolean
  dogFriendly?: boolean
  catFriendly?: boolean
  energyLevel?: EnergyLevel
}

export class PetService {
  // 1. READ ALL
  static async getAllPets() {
    return await prisma.pet.findMany()
  }

  // 2. READ ONE
  static async getPetById(id: string) {
    const pet = await prisma.pet.findUnique({ where: { id } })
    if (!pet) {
      throw new Error("Pet not found")
    }
    return pet
  }

  // 3. CREATE
  static async createPet(data: CreatePetInput) {
    // Business Rule 1: Validation
    if (!data.name || data.name.trim() === "") {
      throw new Error("Pet name is required")
    }
    if (data.age < 0) {
      throw new Error("Pet age cannot be negative")
    }

return await prisma.pet.create({
      data: {
        name: data.name,
        species: data.species,
        age: data.age,
        shelterId: data.shelterId,
        housingRequirement: data.housingRequirement || HousingType.APARTMENT,
        childFriendly: data.childFriendly ?? true,
        dogFriendly: data.dogFriendly ?? true,
        catFriendly: data.catFriendly ?? true,
        energyLevel: data.energyLevel || EnergyLevel.MEDIUM,
      },
    })
  }

  // 4. UPDATE
  static async updatePet(id: string, data: UpdatePetInput) {
    // Ensure pet exists before updating
    await this.getPetById(id)

    return await prisma.pet.update({
      where: { id },
      data,
    })
  }

  // 5. DELETE
  static async deletePet(id: string) {
    await this.getPetById(id)

    return await prisma.pet.delete({
      where: { id },
    })
  }
}