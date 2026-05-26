import { prisma } from "./db";
import { MOCK_COLLEGES, College } from "./mock-data";

// Simple in-memory storage for saved colleges when database is unreachable/offline
// Keeps user actions working flawlessly
const inMemorySaved = new Set<string>(); // Format: "userId:collegeId"

export async function getAllColleges(
  search?: string,
  location?: string,
  minFees?: number,
  maxFees?: number
): Promise<College[]> {
  try {
    // Attempt DB fetch
    const dbColleges = await prisma.college.findMany();
    
    // If DB is empty, use mock data as seed trigger or fallback
    const list = dbColleges.length > 0 ? dbColleges : MOCK_COLLEGES;
    
    // Apply filters
    return filterColleges(list, search, location, minFees, maxFees);
  } catch (error) {
    console.warn("Database fetch failed, falling back to mock data:", error instanceof Error ? error.message : error);
    return filterColleges(MOCK_COLLEGES, search, location, minFees, maxFees);
  }
}

export async function getCollegeById(id: string): Promise<College | null> {
  try {
    const college = await prisma.college.findUnique({
      where: { id },
    });
    if (college) return college;
    
    // Try mock fallback
    return MOCK_COLLEGES.find((c) => c.id === id) || null;
  } catch (error) {
    console.warn(`Database fetch for id ${id} failed, using mock:`, error instanceof Error ? error.message : error);
    return MOCK_COLLEGES.find((c) => c.id === id) || null;
  }
}

export async function getSavedColleges(userId: string): Promise<College[]> {
  if (!userId) return [];
  try {
    const savedRelations = await prisma.savedCollege.findMany({
      where: { userId },
    });
    
    const savedIds = savedRelations.map((r) => r.collegeId);
    
    // Fetch details
    const all = await getAllColleges();
    return all.filter((c) => savedIds.includes(c.id));
  } catch (error) {
    console.warn("Saved colleges DB query failed, using in-memory fallback:", error instanceof Error ? error.message : error);
    // In-memory fallback
    const savedIds = Array.from(inMemorySaved)
      .filter((item) => item.startsWith(`${userId}:`))
      .map((item) => item.split(":")[1]);
      
    const all = await getAllColleges();
    return all.filter((c) => savedIds.includes(c.id));
  }
}

export async function toggleSavedCollege(userId: string, collegeId: string): Promise<{ saved: boolean }> {
  if (!userId) throw new Error("Unauthorized");
  
  try {
    // Check if exists
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existing) {
      // Remove it
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId,
            collegeId,
          },
        },
      });
      return { saved: false };
    } else {
      // Add it
      await prisma.savedCollege.create({
        data: {
          userId,
          collegeId,
        },
      });
      return { saved: true };
    }
  } catch (error) {
    console.warn("Database saved toggle failed, using in-memory fallback:", error instanceof Error ? error.message : error);
    
    const key = `${userId}:${collegeId}`;
    if (inMemorySaved.has(key)) {
      inMemorySaved.delete(key);
      return { saved: false };
    } else {
      inMemorySaved.add(key);
      return { saved: true };
    }
  }
}

export async function isCollegeSaved(userId: string, collegeId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });
    return !!existing;
  } catch {
    const key = `${userId}:${collegeId}`;
    return inMemorySaved.has(key);
  }
}

// Private filter helper
function filterColleges(
  list: College[],
  search?: string,
  location?: string,
  minFees?: number,
  maxFees?: number
): College[] {
  let filtered = [...list];

  if (search) {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(s) || c.courses.toLowerCase().includes(s)
    );
  }

  if (location) {
    const loc = location.toLowerCase().trim();
    filtered = filtered.filter((c) => c.location.toLowerCase().includes(loc));
  }

  if (minFees !== undefined) {
    filtered = filtered.filter((c) => c.fees >= minFees);
  }

  if (maxFees !== undefined) {
    filtered = filtered.filter((c) => c.fees <= maxFees);
  }

  return filtered;
}
