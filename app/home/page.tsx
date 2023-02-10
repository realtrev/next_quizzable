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
  cards: Array<string>;
  expand: {
    author: User;
    cards: Array<Card>;
  };
};

type Card = {
  id: string;
  term: string;
  definition: string;
  created: string;
  updated: string;
  set: string;
  expand: object;
  image: string;
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
  const termCount = props.set.cards.length;

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

function CreateStudySet() {
  const router = useRouter();

  return (
    <button
      className="col-span-1 flex h-44 w-96 grow-0 flex-col items-center justify-center rounded-md border border-gray-200 p-4 transition-all duration-300 hover:bg-offwhite hover:shadow"
      onClick={() => router.push(`/sets/create`)}
    >
      <h1 className="w-0 min-w-full truncate text-center text-xl font-semibold text-gray-500">
        Create a new set
      </h1>
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
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!userData) {
    return <div className="min-h-screen w-full">User data not found</div>;
  }

  if (!userData.expand.favoriteSets) {
    userData.expand.favoriteSets = [];
  }

  if (!userData.expand.sets) {
    userData.expand.sets = [];
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <button
        className="my-3 mx-auto text-center"
        onClick={() => router.push("/home")}
      >
        <h1 className="text-4xl text-blue-500">Quizzable</h1>
      </button>
      <h2 className="text-xl text-gray-600">Welcome, {userData.username}</h2>
      <div className="m-5 grid w-[49.25rem] grid-cols-2 gap-5">
        <h1 className="col-span-2 text-left text-2xl">Favorited Sets</h1>
        {userData.expand.favoriteSets.map((set: Set) => {
          return <ButtonToStudySet set={set} key={set.id} />;
        })}
        {
          // if the user has no favorited sets, show a button to create a new set
          userData.expand.favoriteSets.length === 0 && (
            <div className="col-span-2 flex h-44 w-full items-center">
              <h1 className="text-md w-0 min-w-full select-none text-center font-normal text-gray-400">
                You don't have any favorited sets yet.
              </h1>
            </div>
          )
        }
      </div>
      <div className="m-5 grid w-[49.25rem] grid-cols-2 gap-5">
        <h1 className="col-span-2 text-left text-2xl">Your Sets</h1>
        <CreateStudySet />
        {userData.expand.sets.map((set: Set) => {
          return <ButtonToStudySet set={set} key={set.id} />;
        })}
      </div>
    </main>
  );
}

export default Page;
