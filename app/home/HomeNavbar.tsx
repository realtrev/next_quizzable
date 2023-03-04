import Link from "next/link";
import UserDisplay from "./UserDisplay";
import SearchBar from "./SearchBar";

export default function HomeNavbar() {
  return (
    <nav className="body flex items-center justify-between gap-10 py-5">
      <div className="flex shrink-0 flex-row items-center gap-5">
        <Link className="wordmark" href="/home">
          Quizzable
        </Link>
        <Link href="/home" className="button">
          Home
        </Link>
      </div>

      <SearchBar />

      <div className="flex shrink-0 flex-row items-center gap-5">
        <Link href="/support" className="button primary">
          Support Quizzable
        </Link>
        <UserDisplay />
      </div>
    </nav>
  );
}
