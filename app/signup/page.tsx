"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pb = new PocketBase("https://quizzable.trevord.live");

  useEffect(() => {
    // check if the user is already logged in
    const user = pb.authStore;
    if (user?.isValid) {
      router.push("/home");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background-1">
        <Loading />
      </div>
    );
  }

  return (
    <div className="cursor-default bg-background-1">
      <main className="min-h-screen w-full"></main>
    </div>
  );
}

export default Page;
