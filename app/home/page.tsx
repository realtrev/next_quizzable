"use client";
import RequireAuth from "../components/RequireAuth";
import { usePocket } from "../contexts/PocketContext";

export default function Page() {
  const { user } = usePocket();

  return (
    <RequireAuth>
      <div>{JSON.stringify(user)}</div>
    </RequireAuth>
  );
}
