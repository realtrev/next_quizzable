"use client";
import PocketBase from "pocketbase";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthData } from "../auth";
import { useEffect, useState } from "react";
import Loading from "../Loading";

import type { User, Set } from "../types";
import Navbar from "../Navbar";

function ButtonToStudySet(props: { set: Set }, key: number) {
  const router = useRouter();

  const { id, title, description } = props.set;
  const author = props.set.expand.author;
  const termCount = props.set.cards.length;
  // get results per page from ENV

  return (
    <button
      className="hover:bg-offwhite col-span-1 flex h-44 w-96 grow-0 flex-col rounded-md border border-gray-200 p-4 transition-all duration-300 hover:shadow"
      onClick={() => router.push(`/sets/${id}`)}
      key={key}
    >
      <h1 className="w-0 min-w-full truncate text-left text-xl font-semibold">
        {title}
      </h1>
      <h4 className="w-0 min-w-full truncate text-left text-sm font-medium text-gray-600">
        {termCount} {termCount === 1 ? "Term" : "Terms"}
      </h4>
      <div className="flex-grow" />
      <h3 className="w-0 min-w-full truncate text-left text-sm text-gray-600">
        {author.username}
      </h3>
    </button>
  );
}

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);

  const [searchResults, setSearchResults] = useState({ items: [] } as {
    items: Set[] | User[] | unknown[];
  });
  const [searchQuery, setSearchQuery] = useState("" as string);
  const [searchType, setSearchType] = useState("sets" as "sets" | "users");
  const [searchPage, setSearchPage] = useState(0);

  const resultsPerPage = parseInt(
    process.env.NEXT_PUBLIC_RESULTS_PER_PAGE ?? "10"
  );

  useEffect(() => {
    const func = async function () {
      // check if the user is already logged in
      const user = pb.authStore;
      if (user.isValid) {
        console.log(user.model);
        const id = user.model?.id;
        if (!id) {
          console.error("No user id found");
          return;
        }
        setUserData(
          await pb.collection("users").getOne(user.model?.id, {
            expand: "favoriteSets,favoriteSets.author,sets,sets.author",
          })
        );
      }

      // Get the search query from the URL
      const query = searchParams.get("q");
      const type = searchParams.get("c") ?? "sets";
      const page = searchParams.get("p") ?? "0";
      let pageNumber = 0;

      if (!query) {
        console.error("No search query found");
        router.push("/home");
        return;
      }

      if (page && !isNaN(parseInt(page))) {
        setSearchPage(parseInt(page));
        pageNumber = parseInt(page);
      } else {
        setSearchPage(0);
      }

      if (!type || (type !== "sets" && type !== "users")) {
        console.error("No search type found");
        router.push("/home");
        return;
      }

      setSearchType(type);

      await handleSearch(query.trim(), type, pageNumber);

      setLoading(false);
    };
    func().catch(console.error);
  }, []);

  async function handleSearch(
    query: string,
    type: "sets" | "users",
    page: number
  ) {
    console.log("searching for", query);
    if (type === "sets") {
      const sets = (await pb.collection("sets").getList(page, resultsPerPage, {
        expand: "author",
        filter: `title ~ "${query}" || description ~ "${query}" || author.username ~ "${query}"`,
      })) as { items: unknown[] };
      console.log(sets);

      setSearchType("sets");
      setSearchResults(sets);
      setSearchQuery(query);
      return sets;
    }

    if (type === "users") {
      const users = await pb.collection("users").getList(page, resultsPerPage, {
        filter: `username ~ "${query}"`,
      });
      console.log(users);

      setSearchType("users");
      setSearchResults(users);
      setSearchQuery(query);
      return users;
    }
  }

  if (loading || !searchResults.items) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar
        user={userData ?? undefined}
        searchDefault={searchQuery}
        onSearch={handleSearch}
      />

      <div className="m-5 grid w-[49.25rem] grid-cols-2 gap-5">
        <h1 className="col-span-2 text-left text-2xl">
          Search for {searchQuery}
        </h1>
        {searchResults?.items.map((result, index) => {
          if (searchType === "sets") {
            return (
              <ButtonToStudySet
                set={result as Set}
                key={"res" + index.toString()}
              />
            );
          }
        })}
        {searchResults?.items.length === 0 ? (
          <h1 className="col-span-2 flex h-36 select-none items-center justify-center text-center text-4xl text-gray-300">
            No results found
          </h1>
        ) : null}
      </div>
    </main>
  );
}

export default Page;
