import Loading from "../components/Loading";
import Link from "next/link";

function Page() {
  return (
    <div className="flex min-h-screen w-full cursor-default flex-col items-center justify-center gap-5 bg-background-1">
      <Loading />
      <h4 className="mx-10 w-1/2 text-center text-white">
        This page is under construction.
      </h4>
      <Link href="/" className="button primary">
        Return Home
      </Link>
    </div>
  );
}

export default Page;
