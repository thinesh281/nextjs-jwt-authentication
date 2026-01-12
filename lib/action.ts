"use server";

import { clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/"); // Perform the redirect here
}
