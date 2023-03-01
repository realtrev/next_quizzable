"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { usePocket } from "../contexts/PocketContext";

import { LoadingPage } from "../components/Loading";

function Page() {
  const pocket = usePocket();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check local storage for oauth2
  const oauth2 = localStorage.getItem("oauth2");
  if (oauth2) {
    // Handle callback
    console.log("Handling callback", oauth2);
    if (oauth2 === "google") {
      const codeVerifier = localStorage.getItem("codeVerifier") ?? undefined;

      // Check if code or code verifier is not found
      if (searchParams.has("code") || !codeVerifier) {
        console.log("Code or code verifier not found");
        router.push("/login");
      }

      // Get code from URL
      const code = searchParams.get("code") ?? undefined;

      // Attempt to login with Google
      pocket.login
        .withGoogle(code, codeVerifier)
        .then(() => {
          // Remove oauth2 and code verifier from local storage
          localStorage.removeItem("oauth2");
          localStorage.removeItem("codeVerifier");
          router.push("/home");
        })
        .catch((err: unknown) => {
          console.error(err);
          return (
            <LoadingPage message="An error occurred while logging you in." />
          );
        });
    }
  } else {
    return <LoadingPage message="An error occurred while logging you in." />;
  }

  return <LoadingPage message="Logging in with Google..." />;
}

export default Page;
