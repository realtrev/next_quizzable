"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [searchData, setSearchData] = useState("");

  const router = useRouter();

  return (
    <input
      value={searchData}
      onChange={(e) => {
        setSearchData(e.target.value);
      }}
      className={
        "flex h-10 w-full items-center justify-center rounded-md border border-background-4 bg-background-3 px-4 text-sm text-white shadow-primary outline-none ring-0 duration-200 placeholder:text-gray-400 hover:border-transparent  hover:border-primary focus:border-primary"
      }
      placeholder="Search Quizzable"
    />
  );
}
