// The Controller / Route Layer
// In Next.js, API routes act as the Controller layer.
// They parse incoming HTTP requests, hand the data to PetService, and return JSON
// responses with HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).
// And for operating on a specific pet by ID 

import { NextRequest, NextResponse } from "next/server"
import { PetService } from "@/services/pet.service"

// GET /api/pets/[id] -> Fetch a single pet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pet = await PetService.getPetById(id)
    return NextResponse.json(pet, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Pet not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

// PUT /api/pets/[id] -> Update a pet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedPet = await PetService.updatePet(id, body)
    return NextResponse.json(updatedPet, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// DELETE /api/pets/[id] -> Delete a pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await PetService.deletePet(id)
    return NextResponse.json({ message: "Pet deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Pet not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}