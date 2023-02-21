import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { User } from "./types";

function Navbar(props: {
  user?: User;
  searchDefault?: string;
  onSearch?: (query, category, page) => void;
}) {
  const router = useRouter();

  const currentPage = window.location.pathname;

  function search(query: string, category = "sets") {
    if (query.trim() === "") return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);

    if (props.onSearch) props.onSearch(query, category, 0);
  }

  useEffect(() => {
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.value = props.searchDefault ?? "";
  }, []);

  return (
    <nav className="flex h-16 w-full items-center justify-center gap-10 border-b border-gray-200 px-5">
      <button onClick={() => router.push("/home")} className="shrink-0">
        <h1 className="text-3xl text-blue-500">Quizzable</h1>
      </button>
      <ul className="flex shrink-0 justify-center gap-5">
        {[{ name: "Home", link: "/home" }].map((item, i) => {
          const current = currentPage === item.link ? true : false;

          return (
            <li>
              <button key={i} onClick={() => router.push(item.link)}>
                <h1
                  className={`${
                    current
                      ? "font-bold text-blue-500"
                      : "font-normal text-gray-500"
                  } text-lg  transition-all duration-200 hover:text-blue-700`}
                >
                  {item.name}
                </h1>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex grow items-center justify-center gap-2">
        <input
          className="h-10  grow rounded-md border border-gray-300 px-4"
          placeholder="Search"
          id="search"
          onKeyDown={(e) => {
            if (e.key === "Enter" && document.getElementById("search")?.value) {
              search(document.getElementById("search")?.value);
            }
          }}
          onSubmit={(e) => {
            e.preventDefault();
            search(document.getElementById("search")?.value);
          }}
        />
        <button
          className="h-10 shrink-0 rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
          onClick={() => console.log("search")}
        >
          <h1>Search</h1>
        </button>
      </div>
      <div id="account" className="flex shrink-0 justify-center gap-5">
        {props.user ? (
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white transition-all duration-200 hover:bg-blue-700">
            <h1 className="text-xl">{props.user.username.substring(0, 1)}</h1>
          </button>
        ) : (
          // login
          <button
            className="h-10 rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
            onClick={() => router.push("/login")}
          >
            <h1>Login</h1>
          </button>
        )}
        <button
          className="h-10 rounded-md bg-orange-300 px-4 font-bold text-gray-700 transition-all duration-200 hover:bg-orange-400"
          onClick={() => router.push("/login")}
        >
          <h1>View Other Projects</h1>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
