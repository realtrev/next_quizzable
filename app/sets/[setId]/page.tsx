"use client";
import PocketBase, { BaseAuthStore } from "pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading, { LoadingCircle } from "../../components/Loading";
import Image from "next/image";
import CardElem from "./cards";
// import css from flip.css
import "./flip.css";

import type { User, Card, StudySet } from "../../../lib/types";
import { usePocket } from "../../contexts/PocketContext";
import Link from "next/link";

import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

async function getSetData(setId: string, pb?: PocketBase) {
  if (!pb) pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const set = await pb
    .collection("sets")
    .getOne<StudySet>(setId)
    .catch(() => undefined);

  return set;
}

function Page({ props }: { props: { setId: string } }) {
  const router = useRouter();
  const { user, pb } = usePocket();

  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  const [studySetData, setStudySetData] = useState(
    undefined as StudySet | undefined
  );

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSetData(props.setId, pb)
      .then((set) => {
        setStudySetData(set);

        if (user && set && set.author === user.id) {
          setIsAuthor(true);
        }

        if (user && set && user.favoriteSets.includes(set.id)) {
          setIsFavorited(true);
        }

        setLoading(false);
      })
      .catch(console.error);
  }, [props.setId]);

  async function toggleFavorite() {
    if (!user) {
      console.error("No user data found");
      return;
    }

    if (!studySetData) {
      console.error("No set data found");
      return;
    }

    // toggle the favorite state
    const response = (await pb
      .send(`/api/quizzable/favorite/${studySetData.id}`, {
        method: "PUT",
      })
      .catch(console.error)) as {
      code: number;
      data: { set: string; favorited: boolean };
      message: string;
    };

    if (response) {
      setIsFavorited(response.data.favorited);
    }

    return response.data.favorited;
  }

  async function deleteSet() {
    console.log("Deleting set");
    if (!user) {
      console.error("No user data found");
      return;
    }

    if (!studySetData) {
      console.error("No set data found");
      return;
    }

    // delete the set

    const response = (await pb
      .send(`/api/quizzable/sets/${studySetData.id}`, {
        method: "DELETE",
      })
      .catch(console.error)) as {
      code: number;
      data: object;
      message: string;
    };

    if (response) {
      router.push("/home");
    }
  }

  if (loading) {
    return (
      <main className="body flex h-96 items-center justify-center">
        <LoadingCircle />
      </main>
    );
  }

  if (!studySetData) {
    return <div className="body">Set data not found</div>;
  }

  return (
    <main className="body items-center pb-10">
      <div className="my-10 flex w-full items-center justify-between">
        <h2>{studySetData.title}</h2>
        <div className="flex shrink items-center justify-center gap-5">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-background-4 bg-background-3 transition-colors duration-200 ease-in-out hover:border-transparent hover:bg-primary"
            onClick={toggleFavorite}
          >
            {isFavorited ? (
              <HeartIcon className="h-6 w-6" />
            ) : (
              <SolidHeartIcon className="h-6 w-6" />
            )}
          </button>
          {isAuthor && (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-background-4 bg-background-3 transition-colors duration-200 ease-in-out hover:border-transparent hover:bg-primary"
              onClick={deleteSet}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      <p className="mb-5">{studySetData.description}</p>
      <section className="flex w-full gap-5">
        <div>
          <div className="grid max-h-fit grid-cols-2 gap-5">
            {[
              { label: "Flashcards", url: "/flashcards" },
              { label: "Writing", url: "/writing" },
              { label: "Quiz", url: "/quiz" },
              { label: "Test", url: "/test" },
              { label: "Matching", url: "/matching" },
              { label: "Timed", url: "/timed" },
              { label: "Arcade", url: "/arcade" },
              { label: "Desk Mode", url: "/desk" },
            ].map((item) => (
              <Link
                key={item.label}
                className="hover:blurry-shadow-sm col-span-1 row-span-1 flex h-28 w-28 flex-col items-center justify-center rounded-md border border-background-3 bg-background-2 shadow-primary transition-all duration-200 ease-in-out hover:border-transparent hover:bg-primary"
                href={`/sets/${studySetData.id}${item.url}`}
              >
                <h4 className="text-white">{item.label}</h4>
              </Link>
            ))}
          </div>
        </div>
        <div className="grow">
          <div className="flex h-[31.75rem] items-center justify-center rounded-xl border border-background-4 bg-background-3">
            <h2>testing123</h2>
          </div>
        </div>
      </section>
      <section className="mt-10 flex w-full gap-5">
        {studySetData.expand.cards &&
          studySetData.expand.cards.map((card) => (
            <div key={card.id} className="flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl">{card.term}</h3>
                <h3 className="text-2xl">{card.definition}</h3>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

export default Page;
