"use client";
import PocketBase from "pocketbase";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingPage } from "../../../components/Loading";

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

      const redirectUri = process.env.NEXT_PUBLIC_OAUTH2_URL;

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

  return <LoadingPage />;
}

export default Page;
