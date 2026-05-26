import { NextRequest, NextResponse } from "next/server";
import { getAllColleges } from "@/lib/colleges";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const maxFeesStr = searchParams.get("maxFees");
    
    // Parse max fees parameter safely if provided
    let maxFees: number | undefined = undefined;
    if (maxFeesStr) {
      const parsed = parseInt(maxFeesStr, 10);
      if (!isNaN(parsed)) {
        maxFees = parsed;
      }
    }

    // Fetch filtered colleges through our abstraction layer
    const colleges = await getAllColleges(search, location, undefined, maxFees);

    // Return structured typed response
    return NextResponse.json(
      { 
        success: true, 
        count: colleges.length,
        data: colleges 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/colleges:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to retrieve colleges data." 
      },
      { status: 500 }
    );
  }
}
