"use client";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

import { useRouter } from "next/navigation";

function StudySet(props: {
  studySet: {
    title: string;
    description: string;
    terms: number;
    author: string;
  };
}) {
  const router = useRouter();

  const studySet = props.studySet;

  return (
    <Link
      href="#"
      className="feature-card hover:blurry-shadow-sm group col-span-1 flex flex-col justify-between border border-background-4 bg-background-3 py-6 shadow shadow-gray-900 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-primary hover:shadow-primary-dark"
    >
      <div className="h-36">
        <h4 className="flex items-center gap-2">
          {studySet.title}{" "}
          <BsArrowRight className="text-xl text-background-text duration-200 group-hover:translate-x-2 group-hover:text-white" />
        </h4>
        <p className="h-[3rem] text-paragraph">{studySet.description}</p>
      </div>
      <div>
        <p>
          {studySet.terms} terms •{" "}
          <button
            aria-label="View user profile"
            onClick={() => router.push(`/users/${studySet.author}`)}
            className="text-white"
          >
            {studySet.author}
          </button>
        </p>
      </div>
    </Link>
  );
}

export default StudySet;
