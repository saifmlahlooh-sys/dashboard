"use server";

import { cookies } from "next/headers";

export async function loginWithPin(pin: string) {
  if (pin === "3133") {
    cookies().set("dashboard_pin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "رمز الدخول غير صحيح" };
}

export async function logoutPin() {
  cookies().delete("dashboard_pin_auth");
  cookies().delete("sb-access-token");
  return { success: true };
}
