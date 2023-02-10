"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../loading";
import { BiImport, BiShow } from "react-icons/bi";
import { BsKeyboard } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";

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

  return (
    <div className="min-h-screen w-full">
      <section className="flex h-16 w-full items-center justify-center">
        <button
          className="my-3 mx-auto text-center"
          onClick={() => router.push("/home")}
        >
          <h1 className="text-4xl text-blue-500">Quizzable</h1>
        </button>
      </section>
      <section className="mx-auto flex max-w-6xl gap-5 p-10">
        <main className="grow">
          <div className="grid grid-cols-2 gap-5">
            <label className="col-span-1 flex h-10 items-center justify-center rounded-md bg-gray-100">
              <h1 className="font-normal">Term</h1>
            </label>
            <label className="col-span-1 flex h-10 items-center justify-center rounded-md bg-gray-100">
              <h1 className="font-normal">Definition</h1>
            </label>
            <CardElement />
            <CardElement />
            <CardElement />
          </div>
        </main>
        <aside className="w-3/12 shrink-0">
          <div className="flex flex-col gap-5">
            <input
              className="block h-10 w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
              type="text"
              placeholder="Give your set a title!"
            />

            <textarea
              className="block h-[7.5rem] w-full resize-none appearance-none rounded-md border border-gray-300 bg-gray-100 py-2 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
              placeholder="Enter a description..."
            />

            <div className="grid grid-cols-4 gap-3">
              <button className="col-span-1 flex aspect-square items-center justify-center rounded-md bg-blue-500 font-bold text-white transition-all duration-200 hover:bg-blue-700">
                <h1 className="text-2xl">
                  <MdOutlineSwapHoriz />
                </h1>
                {/* swap term and definitions */}
              </button>
              <button className="col-span-1 flex aspect-square items-center justify-center rounded-md bg-blue-500 font-bold text-white transition-all duration-200 hover:bg-blue-700">
                <h1 className="text-2xl">
                  <BiImport />
                </h1>
                {/* import */}
              </button>
              <button className="col-span-1 flex aspect-square items-center justify-center rounded-md bg-blue-500 font-bold text-white transition-all duration-200 hover:bg-blue-700">
                <h1>
                  <h1 className="text-2xl">
                    <BiShow />
                  </h1>
                </h1>
                {/* visibility */}
              </button>
              <button className="col-span-1 flex aspect-square items-center justify-center rounded-md bg-blue-500 font-bold text-white transition-all duration-200 hover:bg-blue-700">
                <h1 className="text-2xl">
                  <BsKeyboard />
                </h1>
                {/* shortcut menu */}
              </button>
            </div>

            <div className="grid h-10 grid-cols-2 gap-3">
              <button className="col-span-1 h-full rounded-md bg-gray-400 px-4 font-bold text-white transition-all duration-200 hover:bg-gray-600">
                <h1>Cancel</h1>
              </button>
              <button className="col-span-1 h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700">
                <h1>Create Set</h1>
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function CardElement() {
  return (
    <div className="col-span-2 h-40 rounded-md border border-gray-300 bg-gray-100 p-5 transition-shadow hover:shadow-md">
      Card
    </div>
  );
}

export default Page;
