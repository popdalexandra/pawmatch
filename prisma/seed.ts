import { PrismaClient, UserRole, HousingType, EnergyLevel, PetStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10)

  // 1. Create a Shelter
  const shelter = await prisma.shelter.create({
    data: {
      name: "Happy Paws Sanctuary",
      location: "Timișoara, RO",
      description: "Rescuing and rehoming pets across West Romania.",
    },
  })

  // 2. Create Staff User
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@happypaws.com",
      passwordHash,
      role: UserRole.SHELTER_STAFF,
      shelterStaff: {
        create: {
          shelterId: shelter.id,
        },
      },
    },
  })

  // 3. Create Adopter User
  await prisma.user.create({
    data: {
      email: "adopter@example.com",
      passwordHash,
      role: UserRole.ADOPTER,
      adopterProfile: {
        create: {
          housingType: HousingType.APARTMENT,
          hasYard: false,
          hasChildren: true,
          hasPets: false,
          activityLevel: EnergyLevel.MEDIUM,
          location: "Timișoara, RO",
        },
      },
    },
  })

  // 4. Create Initial Pets
  await prisma.pet.createMany({
    data: [
      {
        name: "Milo",
        species: "Dog",
        age: 2,
        housingRequirement: HousingType.APARTMENT,
        childFriendly: true,
        dogFriendly: true,
        catFriendly: false,
        energyLevel: EnergyLevel.HIGH,
        shelterId: shelter.id,
        status: PetStatus.AVAILABLE,
      },
      {
        name: "Luna",
        species: "Cat",
        age: 1,
        housingRequirement: HousingType.APARTMENT,
        childFriendly: true,
        dogFriendly: true,
        catFriendly: true,
        energyLevel: EnergyLevel.LOW,
        shelterId: shelter.id,
        status: PetStatus.AVAILABLE,
      },
    ],
  })

  console.log("Database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })