"use client";
import { usePocket } from "../contexts/PocketContext";

export default function Page() {
  document.title = "Home | Quizzable";
  const { user } = usePocket();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-1 text-gray-100">
      <h2>Welcome, {user?.username}</h2>
      <h4>{user?.email}</h4>
    </div>
  );
}
