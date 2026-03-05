import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Complaint } from '@/lib/models/Complaint';
import { getAuthUser } from '@/lib/auth';

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

    // Only authorities can access admin endpoints
    if (user.role !== 'authority') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    // Build filter query
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: await Complaint.countDocuments(),
      pending: await Complaint.countDocuments({ status: 'Pending' }),
      inProgress: await Complaint.countDocuments({ status: 'In Progress' }),
      resolved: await Complaint.countDocuments({ status: 'Resolved' }),
    };

    return NextResponse.json(
      { complaints, stats },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin complaints error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
