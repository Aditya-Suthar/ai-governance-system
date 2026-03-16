import { NextRequest, NextResponse } from 'next/server';
import geocoder from "@/lib/geocoder";
import { connectDB } from '@/lib/db';
import { Complaint } from '@/lib/models/Complaint';
import { getAuthUser } from '@/lib/auth';
import { complaintSchema } from '@/lib/validation';
import { categorizeComplaint, assignPriority } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
let user = await getAuthUser()

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

    const { title, description, location, category, state, district, ward, image } = validation.data;

    // Connect to database
    await connectDB();

    // Assign priority based on AI logic
    const priority = assignPriority(title, description, category);

    // Spam detection
let spamProbability = 0;
let isSpam = false;

const text = (title + " " + description).toLowerCase();

if (text.includes("buy now") || text.includes("visit my site") || text.includes("http")) {
  spamProbability = 90;
}

if (text.length < 10) {
  spamProbability = 70;
}

if (spamProbability > 70) {
  isSpam = true;
}

    // AI image validation
if (image) {
  const aiCheck = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llava",
      prompt: `
A user submitted a civic complaint.

Title: "${title}"
Description: "${description}"

Check if the uploaded image matches this complaint.

Return ONLY JSON:

{
  "valid": true/false,
  "reason": "short explanation"
}
`,
      images: [image],
      stream: false
    })
  });

  const aiData = await aiCheck.json();

  try {
    const parsed = JSON.parse(aiData.response);

    if (!parsed.valid) {
      return NextResponse.json(
        { error: "Image does not match complaint", reason: parsed.reason },
        { status: 400 }
      );
    }

  } catch {
    console.log("AI validation skipped");
  }
}
    // Convert location to coordinates
let latitude = null;
let longitude = null;

try {
const geo = await geocoder.geocode(`${district}, ${state}, India`);console.log("GEOCODER RESULT:", geo);
  if (geo.length > 0) {
    latitude = geo[0].latitude || null;
    longitude = geo[0].longitude || null;
  }
} catch (err) {
  console.error("Geocoding failed:", err);
}

    // Create complaint
          const complaint = await Complaint.create({
  userId: user.userId,
  title,
  description,
  location,
  state,
  district,
  ward,
  category,
  priority,
  latitude,
  longitude,
  spamProbability,
  isSpam
});

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

    let complaints;

if (user.role === "authority") {
  complaints = await Complaint.find().sort({ createdAt: -1 });
} else {
  complaints = await Complaint.find({ userId: user.userId }).sort({ createdAt: -1 });
}

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
