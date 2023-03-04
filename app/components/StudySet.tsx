"use client";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { useRouter } from "next/navigation";
import type { User } from "../../lib/types";

function StudySet(props: {
  studySet: {
    title: string;
    description: string;
    terms: number;
    author: User;
    id: string;
  };
}) {
  const router = useRouter();

  const studySet = props.studySet;

  return (
    <Link
      href={`/sets/${studySet.id}`}
      className="hover:blurry-shadow-sm group col-span-1 flex h-56 flex-col justify-between rounded-md border border-background-4 bg-background-3 px-6 py-6 shadow-primary-dark transition-all duration-200 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-primary"
    >
      <div className="grow">
        <h4 className="flex items-center gap-2 text-white">
          {studySet.title}{" "}
          <ArrowRightIcon className="h-5 w-5 text-xl text-background-text duration-200 group-hover:translate-x-2 group-hover:text-white" />
        </h4>
        <p className="mt-2 h-[3rem] text-sm text-paragraph">
          {studySet.description}
        </p>
      </div>
      <div>
        <p className="mt-2 text-sm text-paragraph">
          {studySet.terms} term{studySet.terms === 1 ? "" : "s"} •{" "}
          <button
            aria-label="View user profile"
            onClick={() => router.push(`/users/${studySet.author.id}`)}
            className="text-paragraph hover:text-white"
          >
            {studySet.author.username}
          </button>
        </p>
      </div>
    </Link>
  );
}

export default StudySet;
