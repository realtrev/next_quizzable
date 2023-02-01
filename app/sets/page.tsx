"use client";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  // router.push("/home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center"></main>
  );
}

export default Page;
