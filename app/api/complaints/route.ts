import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Complaint } from '@/lib/models/Complaint';
import { getAuthUser } from '@/lib/auth';
import { complaintSchema } from '@/lib/validation';
import { categorizeComplaint, assignPriority } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = complaintSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { title, description, location, category } = body

    // Connect to database
    await connectDB();

    // Assign priority based on AI logic
    const priority = assignPriority(title, description, category);

    // Create complaint
    const complaint = new Complaint({
      userId: user.userId,
      title,
      description,
      location,
      category,
      priority,
      status: 'Pending',
    });

    await complaint.save();

    return NextResponse.json(
      {
        message: 'Complaint created successfully',
        complaint: {
          id: complaint._id,
          title: complaint.title,
          status: complaint.status,
          priority: complaint.priority,
          category: complaint.category,
          createdAt: complaint.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    const complaints = await Complaint.find({ userId: user.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { complaints },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get complaints error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
