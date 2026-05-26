import { NextRequest, NextResponse } from "next/server";
import { getCollegeById } from "@/lib/colleges";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Await params object for dynamic routing in Next.js 15
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "College ID is required." },
        { status: 400 }
      );
    }

    // Retrieve college details from our abstraction layer (auto-falls back to mock if needed)
    const college = await getCollegeById(id);

    if (!college) {
      return NextResponse.json(
        { success: false, error: `College with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: college },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in GET /api/colleges/[id]:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve college details." },
      { status: 500 }
    );
  }
}
