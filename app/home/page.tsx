"use client";
import Link from "next/link";
import { usePocket } from "../contexts/PocketContext";
import { useState, useEffect } from "react";
import { LoadingCircle } from "../components/Loading";
import StudySet from "../components/StudySet";
import type { User, StudySet as StudySetType } from "../../lib/types";

export default function Page() {
  const { user, pb } = usePocket();
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState([] as StudySetType[]);
  const [favoriteSets, setFavoriteSets] = useState([] as StudySetType[]);

  useEffect(() => {
    if (user) {
      pb.collection("users")
        .getOne(user.id, {
          expand: "sets,sets.author,favoriteSets,favoriteSets.author",
        })
        .then((data) => {
          if (
            data.expand.favoriteSets &&
            data.expand.favoriteSets instanceof Array
          ) {
            setFavoriteSets(data.expand.favoriteSets as StudySetType[]);
          } else {
            console.error("No favorite sets found");
          }

          if (data.expand.sets && data.expand.sets instanceof Array) {
            setSets(data.expand.sets as StudySetType[]);
          } else {
            console.error("No sets found");
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  return (
    <div className="body py-40">
      <h6 className="text-gray-400">Your Favorite Sets</h6>
      <div>
        {loading ? (
          <div className="flex h-36 w-full items-center justify-center">
            <LoadingCircle />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {favoriteSets.map((set) => {
              return (
                <StudySet
                  key={set.id}
                  studySet={{
                    id: set.id.toString(),
                    title: set.title,
                    description: set.description,
                    terms: set.cards.length,
                    author: set.expand.author as User,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      <h6 className="mt-10 text-gray-400">Your Sets</h6>
      <div>
        {loading ? (
          <div className="flex h-36 w-full items-center justify-center">
            <LoadingCircle />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            <Link
              href={`/sets/create`}
              className="hover:blurry-shadow-sm col-span-1 flex h-56 items-center justify-center rounded-md border border-background-4 bg-background-3 p-6 shadow-primary-dark transition-all duration-200 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-primary"
            >
              <h4 className="text-white">Create a new set</h4>
            </Link>
            {sets.map((set) => {
              return (
                <StudySet
                  key={set.id}
                  studySet={{
                    id: set.id.toString(),
                    title: set.title,
                    description: set.description,
                    terms: set.cards.length,
                    author: set.expand.author as User,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
