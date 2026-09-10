import { NextRequest, NextResponse } from "next/server"
import { ShelterService } from "@/services/shelter.service"

// GET /api/shelters/[id] -> Get shelter by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const shelter = await ShelterService.getShelterById(id)
    return NextResponse.json(shelter, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Shelter not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

// PUT /api/shelters/[id] -> Update shelter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedShelter = await ShelterService.updateShelter(id, body)
    return NextResponse.json(updatedShelter, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// DELETE /api/shelters/[id] -> Delete shelter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ShelterService.deleteShelter(id)
    return NextResponse.json({ message: "Shelter deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Shelter not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}