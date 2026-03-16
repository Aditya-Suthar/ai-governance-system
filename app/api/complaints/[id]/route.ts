import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Complaint } from "@/lib/models/Complaint"
import { getAuthUser } from "@/lib/auth"
import { updateComplaintStatusSchema } from "@/lib/validation"
import mongoose from "mongoose"

/* =========================
   GET SINGLE COMPLAINT
========================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cleanId = id.trim()

    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return NextResponse.json({ error: "Invalid complaint ID" }, { status: 400 })
    }

    await connectDB()

    const complaint = await Complaint
    .findById(cleanId)
    .populate("userId", "name email phone")
    .lean()

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json(complaint, { status: 200 })

  } catch (error) {
    console.error("Get complaint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


/* =========================
   UPDATE COMPLAINT
========================= */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await params
    const cleanId = id.trim()

    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "authority") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return NextResponse.json({ error: "Invalid complaint ID" }, { status: 400 })
    }

    const body = await request.json()

    const validation = updateComplaintStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      )
    }

    await connectDB()

    const complaint = await Complaint.findByIdAndUpdate(
      cleanId,
      {
        status: validation.data.status,
        priority: validation.data.priority,
        category: validation.data.category,
      },
      { new: true }
    )

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Complaint updated successfully", complaint },
      { status: 200 }
    )

  } catch (error) {
    console.error("Update complaint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


/* =========================
   DELETE COMPLAINT
========================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cleanId = id.trim()

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
  return NextResponse.json(
    { error: "Invalid complaint ID" },
      { status: 400 }
    )
  }

    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "authority") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectDB()

    const deleted = await Complaint.findByIdAndDelete(cleanId)

    if (!deleted) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Complaint deleted successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Delete complaint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}