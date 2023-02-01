"use client";
import PocketBase from "pocketbase";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthData } from "../../auth";
import { useEffect, useState } from "react";
import Loading from "../../loading";

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
            expand: "author",
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
      <div className="min-h-screen w-full">
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
    <main className="flex min-h-screen flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-2xl font-bold">
            {setData?.title || "Set"}
          </h1>
          <p className="text-md m-8 mt-3 w-3/4 text-center font-medium">
            {setData?.description || "Description"}
          </p>
          <h1 className="text-center text-xs font-medium text-gray-600">
            <span className="font-bold text-black">Author: </span>
            {setData.expand.author.username}
          </h1>
          <h1 className="text-center text-xs font-medium text-gray-600">
            <span className="font-bold text-black">Terms: </span>
            {setData.content.pairs.length}
          </h1>
        </div>
        <div className="grid grid-cols-2 items-center justify-center gap-2">
          <h1 className="col-span-1 w-96 text-center text-sm font-bold">
            Term
          </h1>
          <h1 className="col-span-1 w-96 text-center text-sm font-bold">
            Definition
          </h1>
          {setData.content.pairs.map((pair: [string, string], i: number) => (
            <div
              key={i}
              className="col-span-2 grid grid-cols-2 items-center justify-center rounded border border-gray-200 p-4 hover:bg-offwhite"
            >
              <h1 className="col-span-1 w-80 text-left text-lg font-bold">
                {pair[0]}
              </h1>
              <h1 className="col-span-1 w-80 text-left text-lg font-normal text-gray-600">
                {pair[1]}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Page;
