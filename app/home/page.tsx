"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { getAuthData } from "../auth";
import { useEffect, useState } from "react";
import Loading from "../loading";

type Set = {
  id: string;
  title: string;
  description: string;
  created: string;
  updated: string;
  author: string;
  content: {
    termlang: string;
    deflang: string;
    pairs: Array<[string, string]>; // [question, answer]
  };
  expand: {
    author: User;
  };
};

type User = {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  expand: {
    favoriteSets: Array<Set>;
    sets: Array<Set>;
  };
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
};

function ButtonToStudySet(props: { set: Set; key: string }) {
  const router = useRouter();

  const { id, title, description } = props.set;
  const author = props.set.expand.author;
  const termCount = props.set.content.pairs.length;

  console.log(author);

  return (
    <button
      className="col-span-1 flex h-44 w-96 grow-0 flex-col rounded-md border border-gray-200 p-4 transition-all duration-300 hover:bg-offwhite hover:shadow"
      onClick={() => router.push(`/sets/${id}`)}
      key={props.key}
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
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);

  useEffect(() => {
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
      }
    };
    func().catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Loading />
      </div>
    );
  }

  if (!userData) {
    return <div className="min-h-screen w-full">User data not found</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-xl text-gray-600">Welcome, {userData.username}</h2>
      <div className="m-5 grid grid-cols-2 gap-5">
        <h1 className="col-span-2 text-left text-2xl">Favorited Sets</h1>
        {userData.expand.favoriteSets.map((set: Set) => {
          return <ButtonToStudySet set={set} key={set.id} />;
        })}
      </div>
      <div className="m-5 grid grid-cols-2 gap-5">
        <h1 className="col-span-2 text-left text-2xl">Your Sets</h1>
        {userData.expand.sets.map((set: Set) => {
          return <ButtonToStudySet set={set} key={set.id} />;
        })}
      </div>
    </main>
  );
}

export default Page;
