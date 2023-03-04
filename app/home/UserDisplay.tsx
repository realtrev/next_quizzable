"use client";
import Link from "next/link";
import { usePocket } from "../contexts/PocketContext";

export default function UserDisplay() {
  const { isLoggedIn, user } = usePocket();

  // If the user is logged in, display a circle with their first initial.
  if (isLoggedIn) {
    return (
      <Link
        href="/profile"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-background-4 bg-background-3 text-white duration-200 hover:border-transparent hover:bg-primary"
      >
        {user?.username[0]}
      </Link>
    );
  }

  // If the user is not logged in, display a link to the login page.
  return (
    <Link href="/login" className="button primary">
      Login
    </Link>
  );
}
