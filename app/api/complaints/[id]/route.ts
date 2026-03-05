import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Complaint } from '@/lib/models/Complaint';
import { User } from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';
import { updateComplaintStatusSchema } from '@/lib/validation';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check authentication
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    const complaint = await Complaint.findById(id).populate('userId', 'name email phone');
    
    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check authorization - user can view their own complaints or authorities can view all
    if (user.role === 'citizen' && complaint.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { complaint },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check authentication
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only authorities can update complaints
    if (user.role !== 'authority') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = updateComplaintStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: validation.data.status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Complaint updated successfully', complaint },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
