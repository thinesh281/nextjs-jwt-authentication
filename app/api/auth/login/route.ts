import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // This is the tool that talks to our database
import bcrypt from "bcryptjs"; // This is the security tool used to check passwords
import { signToken, setAuthCookie } from "@/lib/auth"; // Custom tools to create "VIP passes" (tokens)

// This function handles a "POST" request, which is what happens when someone submits a login form
export async function POST(req: NextRequest) {
  try {
    // --- STEP 1: RECEIVE DATA ---
    // Grab the email and password the user typed into the login box
    const { email, password } = await req.json();

    // --- STEP 2: BASIC CHECK ---
    // If they left either field blank, stop immediately and tell them they are required
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 } // "400" means the user made a mistake in their request
      );
    }

    // --- STEP 3: FIND THE USER ---
    // Look through our digital filing cabinet (database) to see if this email exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user is found with that email, stop and say "Invalid credentials"
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 } // "401" means "Unauthorized"
      );
    }

    // --- STEP 4: CHECK THE PASSWORD ---
    // We don't store real passwords; we store "hashes" (scrambled versions).
    // This line unscrambles/compares the typed password with the one in our records.
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    // If the password doesn't match the one in the database, stop here
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // --- STEP 5: CREATE THE "VIP PASS" ---
    // The user is valid! We now create a "Token" (a digital pass)
    // that remembers who they are and what their role (admin/user) is.
    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    // --- STEP 6: PREPARE THE SUCCESS MESSAGE ---
    // Create the final "Success" packet to send back to the user's browser
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 } // "200" means "Everything is OK"
    );

    // --- STEP 7: GIVE THE PASS TO THE BROWSER ---
    // Attach the "VIP Pass" (token) to the browser's cookies.
    // This allows the user to stay logged in as they click around the site.
    setAuthCookie(response, token);

    // Final Step: Send the response back!
    return response;
  } catch (error) {
    // --- STEP 8: THE SAFETY NET ---
    // If anything unexpected breaks (like the database crashing),
    // log the error for developers to see and give the user a generic error message.
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 } // "500" means "Something went wrong on our side"
    );
  }
}
