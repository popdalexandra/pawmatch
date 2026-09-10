import { NextRequest, NextResponse } from "next/server"
import { ShelterService } from "@/services/shelter.service"

// GET /api/shelters -> List all shelters
export async function GET() {
  try {
    const shelters = await ShelterService.getAllShelters()
    return NextResponse.json(shelters, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST /api/shelters -> Create a new shelter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newShelter = await ShelterService.createShelter(body)
    return NextResponse.json(newShelter, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}