import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const user = await AuthService.login(validatedData);

    // Here you will attach your JWT / Session Cookie
    return NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Authentication failed";

    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}