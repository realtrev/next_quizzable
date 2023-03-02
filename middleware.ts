import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase, { Record } from "pocketbase";
import CustomAuthStore from "./app/contexts/CustomAuthStore";

// Configure the pages that require auth and the pages that require guest

// These pages require the user to be logged in
// If the user is not logged in, they will be redirected to authRedirect
const requireAuth = ["/home", "/settings", "/profile"];
const authRedirect = "/login";

// These pages require the user to be logged out
// If the user is logged in, they will be redirected to guestRedirect
const requireGuest = ["/signup", "/login", "/"];
const guestRedirect = "/home";

export async function middleware(req: NextRequest) {
  const targetUrl = req.nextUrl.pathname;
  let authorized = false;

  // Connect to pocketbase
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL,
    new CustomAuthStore()
  );

  if (targetUrl === "/logout") {
    console.log("Logging out");
    req.cookies.delete("user");
    req.cookies.delete("token");
    pb.authStore.clear();
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // Get the user from pocketbase
  const userString = req.cookies.get("user")?.value;
  const token = req.cookies.get("token")?.value;

  const user = userString ? (JSON.parse(userString) as Record) : null;

  // If the user is logged in, refresh the auth
  if (user && token) {
    pb.authStore.save(token, user);

    await pb.collection("users").authRefresh();
    if (pb.authStore.isValid) {
      authorized = true;
    } else {
      pb.authStore.clear();
    }
  }

  // If the user is not authorized and the page requires guest, redirect to guestRedirect
  if (authorized && requireGuest.includes(targetUrl)) {
    return NextResponse.redirect(new URL(guestRedirect, req.nextUrl.origin));
  }

  // If the user is not authorized and the page requires auth, redirect to authRedirect
  if (!authorized && requireAuth.includes(targetUrl)) {
    return NextResponse.redirect(new URL(authRedirect, req.nextUrl.origin));
  }
}

export const config = {
  // Join the arrays to create the full list of pages that require auth check
  matcher: requireAuth.concat(requireGuest),
};
