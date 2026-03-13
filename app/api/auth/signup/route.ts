import { NextRequest, NextResponse } from "next/server"
import { resend } from "@/lib/resend";
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { hashPassword, generateToken } from "@/lib/auth"
import { signupSchema } from "@/lib/validation"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { name, email, password, role, phone } = validation.data

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      emailVerified: false,
      emailVerificationToken,
      emailVerificationTokenExpires,
    })

    await user.save()

    // Send verification email (logs link in dev)
    await sendVerificationEmail(user)
    // Create response
    return NextResponse.json(
{
        message: "Account created. Please verify your email before logging in.",
              user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}