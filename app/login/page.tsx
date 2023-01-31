"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { getAuthData } from "../auth";
import { useEffect, useState } from "react";
import Loading from "../loading";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pb = new PocketBase("https://quizzable.trevord.live");

  async function handleLogin(type: "email" | "google") {
    // handle email login
    if (type === "email") {
      return;
    }

    // handle google login
    if (type === "google") {
      console.log("Logging in with Google");

      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "";

      // get a list of auth methods
      const provider = await getAuthData("google");
      if (!provider) {
        console.error("No auth provider found");
        return;
      }

      // save the state to local storage
      localStorage.setItem("provider", JSON.stringify(provider));

      const authUrl = provider.authUrl || "";

      // redirect to auth URL
      window.location.href = `${authUrl}${encodeURIComponent(redirectUri)}`;
    }
  }

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
      <div className="min-h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
          <h1 className="select-none text-6xl font-medium tracking-tight text-primary">
            Quizzable
          </h1>
          <div>
            <p className="mt-6 select-none text-lg font-semibold text-subheading">
              Log in
            </p>
          </div>
          <div className="flex flex-col">
            <div>
              <button
                type="button"
                className="flex h-12 w-80 items-center justify-center rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 hover:bg-offwhite focus:border-primary"
                onClick={() => handleLogin("google")}
              >
                <span className="ml-5">Continue with Google</span>
              </button>
            </div>
            <div>
              <p className="mt-6 w-full select-none text-center text-xs font-medium text-gray-500">
                OR
              </p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="select-none text-xs font-bold text-subheading"
              >
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email or username"
                className="block h-12 w-80 rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="select-none text-xs font-bold text-subheading"
              >
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="block h-12 w-80 rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 focus:border-primary"
              />
            </div>
            <div>
              <button
                type="button"
                className="mt-2 flex h-12 w-80 items-center justify-center rounded bg-primary px-3 text-sm font-medium text-white outline-none transition-all duration-200 placeholder:text-gray-300 hover:brightness-75 focus:border-primary focus:brightness-75"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
