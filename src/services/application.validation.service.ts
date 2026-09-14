import { prisma } from "@/lib/prisma"
import { createApplicationSchema, CreateApplicationInput } from "@/lib/validations/schemas"

export class ApplicationService {
  static async createApplication(input: CreateApplicationInput) {
    const validatedData = createApplicationSchema.parse(input)

    return await prisma.application.create({
      data: {
        status: "SUBMITTED",
        adopter: {
          connect: { id: validatedData.userId },
        },
        pet: {
          connect: { id: validatedData.petId },
        },
      },
    })
  }

  static async getApplicationsForUser(userId: string) {
    return await prisma.application.findMany({
      where: { adopterId: userId },
      include: { pet: true },
    })
  }
}