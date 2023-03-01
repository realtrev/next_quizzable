import { useRouter } from "next/navigation";

import { usePocket } from "../contexts/PocketContext";
import { LoadingPage } from "./Loading";

export const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = usePocket();

  const router = useRouter();

  if (isLoggedIn) {
    // console.log("User is logged in");
    router.push("/home");
    return <LoadingPage />;
  }

  // console.log("User not logged in");

  return <>{children}</>;
};

export default RequireGuest;
