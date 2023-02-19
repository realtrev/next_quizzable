"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../loading";
import Image from "next/image";
import CardElem from "./cards";
// import css from flip.css
import "./flip.css";

import type { User, Set, EditedSet } from "../../types";

function Page({ params }: { params: { setId: string } }) {
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);
  const [setData, setSetData] = useState(null as EditedSet | null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    console.log(params.setId);

    const func = async function () {
      const response: EditedSet = await pb
        .collection("sets")
        .getOne(params.setId, {
          expand: "author,cards",
        });

      if (!response) {
        console.error("Set not found");
        return;
      }

      console.log(response);
      setSetData(response);

      // check if the user is already logged in
      const user = pb.authStore;
      if (user.isValid && user.model) {
        console.log(user.model);
        const id = user.model?.id;
        if (!id) {
          console.error("No user id found");
          // return;
        }

        const newUserData: User = await pb
          .collection("users")
          .getOne(user.model.id, {
            expand: "favoriteSets,favoriteSets.author,sets,sets.author",
          });

        setUserData(newUserData);

        if (newUserData && response.author === newUserData.id) {
          setIsAuthor(true);
          console.log("User is set author");
        }

        // Check if the set is favorited, by whether the set id is in the user's favoriteSets array
        if (newUserData.favoriteSets) {
          if (newUserData.favoriteSets.some((set) => set === response.id)) {
            setIsFavorited(true);
          }
        }
      }
      setLoading(false);
    };
    func().catch(console.error);
  }, []);

  async function toggleFavorite() {
    if (!userData) {
      console.error("No user data found");
      return;
    }

    if (!setData) {
      console.error("No set data found");
      return;
    }

    // toggle the favorite state
    const response = (await pb
      .send(`/api/quizzable/favorite/${setData.id}`, {
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
    if (!userData) {
      console.error("No user data found");
      return;
    }

    if (!setData) {
      console.error("No set data found");
      return;
    }

    // delete the set

    const response = (await pb
      .send(`/api/quizzable/sets/${setData.id}`, {
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
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!setData) {
    return <div className="min-h-screen w-full">Set data not found</div>;
  }

  return (
    <main className="min-h-screen w-full">
      <section className="flex h-16 w-full items-center justify-center">
        <button
          className="my-3 mx-auto text-center"
          onClick={() => router.push("/home")}
        >
          <h1 className="text-4xl text-blue-500">Quizzable</h1>
        </button>
      </section>
      <section className="mx-auto flex max-w-4xl flex-col gap-5 p-10">
        <h1 className="text-left text-3xl font-bold">{setData.title}</h1>
        <div className="grid hidden h-12 w-full grid-cols-5 flex-row justify-between gap-2">
          {[
            {
              title: "Flashcards",
              link: `/sets/${setData.id}/flashcards`,
            },
            {
              title: "Quiz",
              link: `/sets/${setData.id}/quiz`,
            },
            {
              title: "Match",
              link: `/sets/${setData.id}/match`,
            },
            {
              title: "Arcade",
              link: `/sets/${setData.id}/arcade`,
            },
            {
              title: "Endless",
              link: `/sets/${setData.id}/game`,
            },
          ].map((item: { title: string; link: string }, i: number) => (
            <button
              className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
              onClick={() => router.push(item.link)}
              key={i}
            >
              <h1>{item.title}</h1>
            </button>
          ))}
        </div>
        <CardElem cards={setData.expand.cards} />
      </section>
      <section className="mx-auto flex max-w-4xl justify-between gap-4 p-10">
        <div className="flex gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500"></div>
          <div className="flex flex-col justify-center">
            <h1 className="m-0 p-0 text-left text-xs font-normal text-gray-500">
              Created by
            </h1>
            <h1 className="m-0 p-0 text-left text-xl font-medium" id="author">
              {setData.expand.author.username}
            </h1>
          </div>
        </div>
        <div className="ml-auto flex gap-4">
          {userData ? (
            <button
              className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
              onClick={() => {
                toggleFavorite().catch(console.error);
              }}
            >
              <h1>
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </h1>
            </button>
          ) : (
            <button
              className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
              onClick={() => router.push(`/login?redirect=/sets/${setData.id}`)}
            >
              <h1>Login to favorite</h1>
            </button>
          )}
          <button
            className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
            onClick={() => console.log("share")}
          >
            <h1>Share</h1>
          </button>
          {isAuthor ? (
            <button
              className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
              onClick={() => router.push(`/sets/${setData.id}/edit`)}
            >
              <h1>Edit</h1>
            </button>
          ) : null}
          {isAuthor ? (
            <button
              className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
              onClick={() => deleteSet().catch(console.error)}
            >
              <h1>Delete</h1>
            </button>
          ) : null}
        </div>
      </section>
      <section className="mx-auto flex max-w-4xl flex-col gap-5 p-10">
        {setData?.expand?.cards?.map((card, i) => {
          return (
            <div
              key={i}
              className="grid w-full grid-cols-2 gap-5 rounded border border-gray-300 bg-offwhite p-5"
            >
              <h1 className="col-span-1">{card.term}</h1>
              <h1 className="col-span-1 font-normal text-gray-600">
                {card.definition}
              </h1>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Page;
