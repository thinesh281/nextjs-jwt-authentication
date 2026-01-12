import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // --- STEP 1: GET THE TOKEN ---
    // Look into the browser's "cookie jar" for the auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value; // Make sure this matches the name in setAuthCookie

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // --- STEP 2: DECODE THE PASS ---
    // Use your secret key to verify that the token is real and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    // --- STEP 3: FETCH FRESH DATA ---
    // Go to the database to get the most up-to-date name and email
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // --- STEP 4: SEND IT BACK ---
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    // If the token is expired or invalid, jwt.verify will throw an error
    console.error("Auth Me Error:", error);
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }
}
