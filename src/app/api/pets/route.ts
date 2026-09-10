//The Controller / Route Layer 
// In Next.js, API routes act as the Controller layer. 
// They parse incoming HTTP requests, hand the data to PetService, and return JSON 
// responses with HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).

import { NextRequest, NextResponse } from "next/server"
import { PetService } from "@/services/pet.service"

// GET /api/pets -> Fetch all pets
export async function GET() {
  try {
    const pets = await PetService.getAllPets()
    return NextResponse.json(pets, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST /api/pets -> Create a new pet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newPet = await PetService.createPet(body)
    return NextResponse.json(newPet, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}