"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../loading";
import Image from "next/image";
import CardElem from "./cards";
// import css from flip.css
import "./flip.css";

import type { User, Set } from "../../types";

function Page({ params }: { params: { setId: string } }) {
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);
  const [setData, setSetData] = useState(null as Set | null);

  useEffect(() => {
    console.log(params.setId);

    const func = async function () {
      // check if the user is already logged in
      const user = pb.authStore;
      if (!user.isValid) {
        router.push("/login");
      } else {
        setLoading(false);
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

        setSetData(
          await pb.collection("sets").getOne(params.setId, {
            expand: "author,cards",
          })
        );

        if (!setData) {
          console.error("Set not found");
          return;
        }
      }
    };
    func().catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!userData) {
    return <div className="min-h-screen w-full">User data not found</div>;
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
        <div className="grid h-12 w-full grid-cols-4 flex-row justify-between gap-2">
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
              title: "Edit",
              link: `/sets/${setData.id}/edit`,
            },
            {
              title: "Delete",
              link: `/sets/${setData.id}/delete`,
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
    </main>
  );
}

export default Page;
