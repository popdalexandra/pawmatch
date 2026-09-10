"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole, HousingType, EnergyLevel } from "@prisma/client"

export async function registerAdopter(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  // 1. Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "An account with this email already exists." }
  }

  // 2. Hash password securely
  const passwordHash = await bcrypt.hash(password, 10)

  // 3. Create User and AdopterProfile atomically
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.ADOPTER,
      adopterProfile: {
        create: {
          housingType: HousingType.APARTMENT,
          hasYard: false,
          hasChildren: false,
          hasPets: false,
          activityLevel: EnergyLevel.MEDIUM,
          location: "Not specified",
        },
      },
    },
  })

  return { success: true }
}