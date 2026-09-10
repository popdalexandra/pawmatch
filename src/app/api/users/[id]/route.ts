import { NextRequest, NextResponse } from "next/server"
import { UserService } from "@/services/user.service"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await UserService.getUserById(id)
    return NextResponse.json(user, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "User not found"
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
    const updatedUser = await UserService.updateUser(id, body)
    return NextResponse.json(updatedUser, { status: 200 })
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
    await UserService.deleteUser(id)
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "User not found"
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}