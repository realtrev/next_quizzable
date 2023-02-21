"use client";
import PocketBase from "pocketbase";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthData } from "../../../auth";
import { useState } from "react";
import Loading from "../../../loading";

function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  function connect() {
    const code = params.get("code");

    const providerString = localStorage.getItem("provider") || "{}";

    if (typeof providerString !== "string") {
      console.error("Failed to get provider from local storage");
      router.push("/login");
      return;
    }

    try {
      const provider = JSON.parse(providerString) as {
        codeVerifier: string;
      };

      const codeVerifier = provider.codeVerifier;

      console.log(codeVerifier);

      if (typeof code !== "string") {
        console.error("Failed to get code from provider");
        router.push("/login");
        return;
      }

      if (typeof codeVerifier !== "string") {
        console.error("Failed to get code verifier from provider");
        router.push("/login");
        return;
      }

      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

      if (typeof redirectUri !== "string") {
        console.error("Failed to get redirect uri from env");
        router.push("/login");
        return;
      }

      const pb = new PocketBase("https://quizzable.trevord.live");
      pb.collection("users")
        .authWithOAuth2("google", code, codeVerifier, redirectUri)
        .then((authData) => {
          router.push("/home");
        })
        .catch((err: string) => {
          router.push("/login");
          console.error(err);
        });
    } catch (err) {
      router.push("/login");
      console.error(err);
    }
  }

  try {
    connect();
  } catch (err) {
    console.error(err);
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loading />
    </div>
  );
}

export default Page;
