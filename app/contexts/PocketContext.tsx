import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase from "pocketbase";
import type { RecordAuthResponse, AuthProviderInfo } from "pocketbase";
import { useInterval } from "usehooks-ts";
import jwtDecode from "jwt-decode";
import { getCookie } from "cookies-next";

import type { User } from "../../lib/types";
import { LoadingPage } from "../components/Loading";
import CustomAuthStore from "./CustomAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "";
const FIVE_MINUTES_MS: number = 5 * 60 * 1000;
const TWO_MINUTES_MS: number = 2 * 60 * 1000;

interface PocketbaseContext {
  pb: PocketBase;
  token: string | null;
  user: User | null;
  getAuthProvider: (name: string) => AuthProviderInfo | undefined;
  authProviders: string[];
  isLoggedIn: boolean;
  register: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<User>>;
  login: {
    withPassword: (
      email: string,
      password: string
    ) => Promise<RecordAuthResponse<User>>;
    withGoogle: (code?: string, codeVerifier?: string) => Promise<void>;
  };
  logout: () => void;
}

const PocketContext = createContext<PocketbaseContext>(
  null as unknown as PocketbaseContext
);

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL, new CustomAuthStore()), []);
  pb.autoCancellation(false);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(
    (pb.authStore.model as unknown as User) ?? null
  );
  const [authData, setAuthData] = useState<AuthProviderInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProviders, setAuthProviders] = useState<string[]>([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [completedAuthorization, setCompletedAuthorization] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // This code runs when the component is mounted
  useEffect(() => {
    // Update the isLoggedIn value and refresh the session
    if (pb.authStore.isValid) {
      // Refresh the session
      refreshSession()
        .then(() => {
          // Wait for the session to be refreshed and then set the isLoggedIn value
          setLoggedIn(true);
          setCompletedAuthorization(true);
        })
        .catch((error) => {
          // If there is an error, log it and set the isLoggedIn value
          console.error(error);
          setLoggedIn(false);
          setCompletedAuthorization(true);
          setLoadingMessage("A problem occurred while refreshing the session.");
        });
    } else {
      setLoggedIn(false);
      setCompletedAuthorization(true);
    }

    // Get the auth providers
    pb.collection("users")
      .listAuthMethods()
      .then((data) => setAuthData(data.authProviders))
      .catch((error) => {
        console.error(error);
        setLoadingMessage("A problem occurred while connecting to the server.");
      });

    // Listen for changes to the auth store
    return pb.authStore.onChange((token: string, model) => {
      console.log("Auth store changed", token, model);
      // Set the token and user
      setToken(token);
      setUser(model as unknown as User);

      // Update the isLoggedIn value
      if (pb.authStore.isValid) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }, true);
  }, []);

  // Create a simple map of auth providers
  useEffect(() => {
    authData?.map((provider) => {
      setAuthProviders((prev) => [...prev, provider.name]);
    });
  }, [authData]);

  // Register a new user
  const register = useCallback(
    async (email: string, password: string) => {
      const user: RecordAuthResponse<User> = await pb
        .collection("users")
        .create({ email, password, passwordConfirm: password });
      return user;
    },
    [pb]
  );

  // Login options: withPassword, withGoogle
  const login = {
    withPassword: useCallback(
      async (email: string, password: string) => {
        const user: RecordAuthResponse<User> = await pb
          .collection("users")
          .authWithPassword(email, password);
        return user;
      },
      [pb]
    ),

    withGoogle: useCallback(
      async (code?: string, codeVerifier?: string) => {
        setLoading(true);
        if (code && codeVerifier) {
          const redirectUrl = process.env.NEXT_PUBLIC_OAUTH2_URL || "";
          console.log("Redirect URL:", redirectUrl);

          await pb
            .collection("users")
            .authWithOAuth2("google", code, codeVerifier, redirectUrl)
            .then((data) => {
              console.log("User:", data);
              pb.authStore.save(data.token, data.record);
              setUser(data.record as unknown as User);
              setLoggedIn(true);
              setLoading(false);
            })
            .catch((error: string) => {
              setLoggedIn(false);
              throw new Error(error ?? "Error logging in with Google");
            });
          return;
        }

        const google = getAuthProvider("google");

        if (google === undefined) {
          throw new Error("Google auth not enabled");
        }

        localStorage.setItem("googleCodeVerifier", google.codeVerifier);

        const callbackUrl = process.env.NEXT_PUBLIC_OAUTH2_URL || "";

        window.location.href = `${google.authUrl}${encodeURIComponent(
          callbackUrl
        )}`;
      },
      [authData, pb]
    ),
  };

  const getAuthProvider = useCallback(
    (name: string) => {
      return authData?.find((provider: AuthProviderInfo) => {
        return provider.name === name;
      });
    },
    [authData]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
    setLoggedIn(false);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.token) return;

    const decoded = jwtDecode<{ exp: number }>(pb.authStore.token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = tokenExpiration + FIVE_MINUTES_MS;
    if (tokenExpiration < expirationWithBuffer) {
      return await pb
        .collection("users")
        .authRefresh()
        .then((data) => {
          console.log(data.record);
          pb.authStore.save(data.token, data.record);
          setUser(data.record as unknown as User);
        })
        .catch((err) => {
          console.error(err);
          setLoadingMessage("A problem occurred while refreshing the session.");
        });
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined" && loading) {
      // console log cookies
      // console.log("Cookies:", getCookies());
      const model = getCookie("user");
      const cookieToken = getCookie("token");
      console.log(model ? "Found user cookie" : "No user cookie found");
      console.log(cookieToken ? "Found token cookie" : "No token cookie found");
      if (typeof model !== "object" || typeof cookieToken !== "string") {
        return;
      }
      pb.authStore.save(cookieToken.toString(), model);
    }
  }, [loading]);

  // Refresh the session every 2 minutes
  useInterval(refreshSession, token ? TWO_MINUTES_MS : null);

  // Manage whether to show the loading screen or not
  useEffect(() => {
    if (authProviders && authData && loading && completedAuthorization) {
      console.log(authProviders);
      if (isLoggedIn && user === null) {
        console.log("User is logged in but user is null");
        return;
      }

      if (!isLoggedIn && user !== null) {
        console.log("User is not logged in but user is not null");
        setLoggedIn(true);
      }
      setLoading(false);
    }
  }, [
    authData,
    authProviders,
    completedAuthorization,
    loading,
    isLoggedIn,
    user,
  ]);

  if (loading) {
    return <LoadingPage message={loadingMessage} />;
  }

  return (
    <PocketContext.Provider
      value={
        {
          pb,
          token,
          user,
          authProviders,
          getAuthProvider,
          register,
          login,
          isLoggedIn,
          logout,
        } as PocketbaseContext
      }
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
