import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"

export interface CreateApplicationInput {
  userId: string
  petId: string
  notes?: string
}

export interface UpdateApplicationStatusInput {
  status: ApplicationStatus
}

export class ApplicationService {
  // 1. GET ALL
  static async getAllApplications() {
    return await prisma.application.findMany({
      include: {
        adopter: true, // Updated from 'user' to 'adopter'
        pet: true,
      },
    })
  }

  // 2. GET BY ID
  static async getApplicationById(id: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        adopter: true, // Updated from 'user' to 'adopter'
        pet: true,
      },
    })
    if (!application) {
      throw new Error("Adoption application not found")
    }
    return application
  }

  // 3. CREATE
  static async createApplication(data: CreateApplicationInput) {
    if (!data.userId || !data.petId) {
      throw new Error("Both userId and petId are required")
    }

    return await prisma.application.create({
      data: {
        adopter: {
          connect: { id: data.userId },
        },
        pet: {
          connect: { id: data.petId },
        },
      },
    })
  }

  // 4. UPDATE STATUS
  static async updateStatus(id: string, data: UpdateApplicationStatusInput) {
    await this.getApplicationById(id)
    return await prisma.application.update({
      where: { id },
      data: {
        status: data.status,
      },
    })
  }

  // 5. DELETE
  static async deleteApplication(id: string) {
    await this.getApplicationById(id)
    return await prisma.application.delete({
      where: { id },
    })
  }
}