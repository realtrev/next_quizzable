"use client";
import { useRouter } from "next/navigation";

import { usePocket } from "../contexts/PocketContext";
import { LoadingPage } from "./Loading";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = usePocket();

  const router = useRouter();

  if (!isLoggedIn) {
    // console.log("User not logged in");
    router.push("/login");
    return <LoadingPage />;
  }

  // console.log("User is logged in");

  return <>{children}</>;
};

export default RequireAuth;
