import { NextRequest, NextResponse } from "next/server"
import { UserService } from "@/services/user.service"

export async function GET() {
  try {
    const users = await UserService.getAllUsers()
    return NextResponse.json(users, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUser = await UserService.createUser(body)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Bad Request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}