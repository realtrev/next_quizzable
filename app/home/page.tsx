"use client";
import { usePocket } from "../contexts/PocketContext";

export default function Page() {
  const { user } = usePocket();

  return <div>{JSON.stringify(user)}</div>;
}
