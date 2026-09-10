import { NextRequest, NextResponse } from "next/server"
import { ApplicationService } from "@/services/application.service"

export async function GET() {
  try {
    const apps = await ApplicationService.getAllApplications()
    return NextResponse.json(apps, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newApp = await ApplicationService.createApplication(body)
    return NextResponse.json(newApp, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}