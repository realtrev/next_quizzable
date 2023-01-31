"use client";
import PocketBase from "pocketbase";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthData } from "../../../auth";

function Page() {
  const params = useSearchParams();
  const router = useRouter();

  function connect() {
    const code = params.get("code");

    const providerString = localStorage.getItem("provider") || "{}";

    if (typeof providerString !== "string") {
      throw "Failed to get provider from local storage";
    }

    try {
      const provider = JSON.parse(providerString);

      const codeVerifier = provider.codeVerifier;

      if (typeof code !== "string") {
        throw "Failed to get code from provider";
      }

      if (typeof codeVerifier !== "string") {
        throw "Failed to get code verifier from provider";
      }

      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

      if (typeof redirectUri !== "string") {
        throw "Failed to get provider name from provider";
      }

      const pb = new PocketBase("https://quizzable.trevord.live");
      pb.collection("users")
        .authWithOAuth2("google", code, codeVerifier, redirectUri)
        .then((authData) => {
          const content = document.getElementById("content");
          if (!content) {
            throw "Failed to get content element";
          }
          content.innerText = "Authenticated";
          router.push("/home");
        })
        .catch((err: string) => {
          const content = document.getElementById("content");
          if (!content) {
            throw "Failed to get content element";
          }
          content.innerText = `Failed to exchange code.\n ${err}`;
        });
    } catch (err) {
      console.error(err);
      const content = document.getElementById("content");
      if (!content) {
        throw "Failed to get content element";
      }
      content.innerText = `Failed to parse provider.`;
      console.error(err);
    }
  }

  connect();

  return (
    <div className="bg-white">
      <div id="content">Redirecting...</div>
    </div>
  );
}

export default Page;
