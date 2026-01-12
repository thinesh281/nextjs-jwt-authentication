import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req: NextRequest) {
  try {
    // 1. Get the current user from the token in cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const { name, password } = await req.json();

    const updateData: any = { name };

    // 2. If a password was provided, hash it
    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    // 3. Update in database
    await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
