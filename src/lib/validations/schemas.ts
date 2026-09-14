import { z } from "zod"
import { UserRole, HousingType, EnergyLevel } from "@prisma/client"

// -----------------------------
// Authentication Schemas
// -----------------------------

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerAdopterSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.literal(UserRole.ADOPTER),
  profile: z.object({
    housingType: z.enum(HousingType, {
      message: "Invalid housing type",
    }),
    hasYard: z.boolean(),
    hasChildren: z.boolean(),
    hasPets: z.boolean(),
    activityLevel: z.enum(EnergyLevel, {
      message: "Invalid activity level",
    }),
    location: z.string().min(2, "Location is required"),
  }),
})

export const registerStaffSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.literal(UserRole.SHELTER_STAFF),
  shelterId: z.uuid({ message: "Invalid shelter ID format" }),
})

// Combined registration input discriminator
export const registerSchema = z.discriminatedUnion("role", [
  registerAdopterSchema,
  registerStaffSchema,
])

// -----------------------------
// Pet Schemas
// -----------------------------

export const createPetSchema = z.object({
  name: z.string().trim().min(1, "Pet name is required"),
  species: z.string().trim().min(1, "Species is required"),
  age: z.number().int().nonnegative("Pet age cannot be negative"),
  housingRequirement: z.enum(HousingType, {
    message: "Invalid housing type",
  }),
  childFriendly: z.boolean(),
  dogFriendly: z.boolean(),
  catFriendly: z.boolean(),
  energyLevel: z.enum(EnergyLevel, {
    message: "Invalid activity level",
  }),
  shelterId: z.uuid({ message: "Invalid shelter ID format" }),
})

// -----------------------------
// Application Schemas
// -----------------------------

export const createApplicationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  petId: z.string().min(1, "Pet ID is required"),
})

// -----------------------------
// TypeScript Types
// -----------------------------

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreatePetInput = z.infer<typeof createPetSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>