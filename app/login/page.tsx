"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import Link from "next/link";

import RequireGuest from "../components/RequireGuest";

import "./page.css";
import { LoadingCircle, LoadingPage } from "../components/Loading";
import { ClientResponseError } from "pocketbase";

function Page() {
  const pocket = usePocket();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const google = pocket.getAuthProvider("google");
  if (!google) {
    console.error("Google auth provider not found");
    return (
      <LoadingPage message="The site is not working correctly. Please try again later." />
    );
  }

  const urlError = searchParams.get("error");
  if (urlError) {
    console.error("Error from auth provider", urlError);
    setError(urlError);
  }

  const googleUrl =
    google?.authUrl +
    encodeURIComponent(`${process.env.NEXT_PUBLIC_OAUTH2_URL || ""}`);

  // Login Page
  return (
    <RequireGuest>
      <div className="min-h-screen w-full cursor-default bg-background-1">
        <main className="mx-auto flex min-h-screen w-96 flex-col items-center justify-center text-center">
          <h6>LOGIN</h6>
          <h2>Welcome back</h2>
          <p className="mt-2 text-sm">
            Continue with Google or enter your username and password to log in.
          </p>
          <div className="my-10 flex w-full flex-col">
            {
              // Google
              pocket.authProviders.includes("google") ? (
                <button
                  onClick={() => {
                    console.log("Setting code verifier");
                    localStorage.setItem("codeVerifier", google.codeVerifier);
                    localStorage.setItem("oauth2", "google");
                    window.location.href = googleUrl;
                  }}
                  className="button hover:blurry-shadow-sm hover:text-white-900 flex h-12 w-full items-center justify-center rounded-md bg-background-4 text-base text-white shadow-primary duration-200 hover:border-transparent hover:bg-primary"
                >
                  Continue with Google
                </button>
              ) : null
            }

            {
              // Splitter
              pocket.authProviders.length > 0 ? (
                <div className="my-10 flex items-center justify-center gap-5">
                  <div className="h-0 grow border-t border-background-3" />
                  <h6 className="my-0 shrink-0">OR</h6>
                  <div className="h-0 grow border-t border-background-3" />
                </div>
              ) : null
            }

            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLoginError("");
                setError("");
              }}
              className={
                "flex h-12 w-full items-center justify-center rounded-md border border-background-4 bg-background-3 px-4 text-sm text-white shadow-primary outline-none ring-0 duration-200 placeholder:text-gray-400 hover:border-transparent  hover:border-primary focus:border-primary" +
                (loginError ? " border-red-500" : "")
              }
              placeholder="Username"
            />
            <div className="mt-1 mb-4 flex">
              {error ? (
                <p className="text-sm text-red-500">{loginError.toString()}</p>
              ) : null}
            </div>
            <input
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setError("");
              }}
              className={
                "flex h-12 w-full items-center justify-center rounded-md border border-background-4 bg-background-3 px-4 text-sm text-white shadow-primary outline-none ring-0 duration-200 placeholder:text-gray-400 hover:border-transparent  hover:border-primary focus:border-primary" +
                (passwordError ? " border-red-500" : "")
              }
              placeholder="Password"
            />
            <div className="mt-1 mb-4 flex">
              {error ? (
                <p className="text-sm text-red-500">
                  {passwordError.toString() || error.toString()}
                </p>
              ) : null}
            </div>
            <button
              onClick={async () => {
                setError("");
                setLoadingLogin(true);
                try {
                  const data = await pocket.login.withPassword(
                    username,
                    password
                  );
                } catch (err) {
                  const error = err as ClientResponseError;
                  if (!error.data) {
                    console.error(err);
                    setError("An unknown error occurred");
                  } else {
                    console.log(error.data);
                    const data = error.data as {
                      message: string;
                      code: number;
                      data:
                        | {
                            identity:
                              | {
                                  code: string;
                                  message: string;
                                }
                              | undefined;
                            password:
                              | {
                                  code: string;
                                  message: string;
                                }
                              | undefined;
                          }
                        | undefined;
                    };
                    if (data.message === "Failed to authenticate.") {
                      setError("Invalid login credentials");
                    } else {
                      setError(data.message);
                    }
                    setLoginError(data?.data?.identity?.message ?? "");
                    setPasswordError(data?.data?.password?.message ?? "");
                  }
                  setLoadingLogin(false);
                }
              }}
              className={`font-nav blurry-shadow-sm hover:text-white-900 flex h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-secondary to-tertiary text-base font-medium text-white shadow-tertiary outline-none duration-200`}
              disabled={loadingLogin}
            >
              {loadingLogin ? <LoadingCircle /> : "Log in"}
            </button>
          </div>
        </main>
      </div>
    </RequireGuest>
  );
}

export default Page;
