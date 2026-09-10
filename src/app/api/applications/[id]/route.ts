import { NextRequest, NextResponse } from "next/server"
import { ApplicationService } from "@/services/application.service"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const app = await ApplicationService.getApplicationById(id)
    return NextResponse.json(app, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Application not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedApp = await ApplicationService.updateStatus(id, body)
    return NextResponse.json(updatedApp, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ApplicationService.deleteApplication(id)
    return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Application not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}