"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Loading from "../../loading";

import type { User, EditedSet, EditedCard } from "../../types";

function Page({ params }: { params: { setId: string } }) {
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);

  let cardData = new Array(3).fill({}).map(() => ({
    term: "",
    definition: "",
    id: "",
    setId: "",
    created: "",
    updated: "",
    set: "",
    expand: {},
    image: "",
    isEdited: true,
    isDeleted: false,
  })) as EditedCard[];

  let set = {
    id: "",
    title: "",
    description: "",
    visibility: "public",
    created: "",
    updated: "",
    author: "",
    expand: {
      author: {} as User,
      cards: cardData,
    },
    cards: [],
    isEdited: true,
    isDeleted: false,
  } as EditedSet;

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

  function editSet(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "description" | "visibility"
  ) {
    set[field] = event.target?.value;
    set.isEdited = true;
  }

  function editCard(
    event: ChangeEvent<HTMLInputElement>,
    card: EditedCard,
    field: "term" | "definition" | "image"
  ) {
    // find the card in the array
    const index = cardData.findIndex((c) => c.id === card.id);
    if (index === -1) {
      console.error("Card not found");
      return;
    }
    cardData[index][field] = event.target.value;
    cardData[index].isEdited = true;
    return cardData[index] as EditedCard;
  }

  function deleteCard(card: EditedCard) {
    // find the card in the array
    const index = cardData.findIndex((c) => c.id === card.id);
    if (index === -1) {
      console.error("Card not found");
      return;
    }
    cardData[index].isDeleted = true;
  }

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

      window.set = set;
    window.pb = pb;

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
            {cardData.map((card: EditedCard, i: number) => (
              <CardElement
                editCard={editCard}
                deleteCard={deleteCard}
                saveSet={(autoSave?: boolean) => {
                  console.log("Save");
                }}
                key={i}
                card={card}
              />
            ))}
            <button
              className="col-span-2 flex h-16 items-center justify-center rounded-md bg-gray-100 transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
              onClick={() => {
                console.log("Create card");
              }}
            >
              <h1 className="font-normal">Create Card</h1>
            </button>
          </div>
        </main>
        <aside className="w-3/12 shrink-0">
          <div className="flex flex-col gap-5">
            <input
              className="block h-10 w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
              type="text"
              placeholder="Give your set a title!"
              onChange={(e) => editSet(e, "title")}
            />

            <textarea
              className="block h-[7.5rem] w-full resize-none appearance-none rounded-md border border-gray-300 bg-gray-100 py-2 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
              placeholder="Enter a description..."
              onChange={(e) => editSet(e, "description")}
            />

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

function CardElement(props: {
  editCard(
    event: ChangeEvent<HTMLInputElement>,
    card: EditedCard,
    field: "term" | "definition" | "image"
  ): EditedCard;
  deleteCard(card: EditedCard): void;
  saveSet(autoSave?: boolean): void;
  card: EditedCard;
}) {
  let card = props.card;
  return (
    <div className="p10 col-span-2 grid grid-cols-2 gap-5 rounded-md border border-gray-300 bg-gray-100 p-5 transition-shadow hover:shadow-md">
      {/* term input */}
      <input
        className="col-span-1 h-10 appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
        type="text"
        placeholder="Enter a term..."
        onChange={(e) => {
          card = props.editCard(e, card, "term");
        }}
        onBlur={() => {
          props.saveSet(true);
        }}
      />
      <div className="col-span-1 flex gap-5">
        <input
          className=" h-10 grow appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 font-normal leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
          type="text"
          placeholder="Enter a definition..."
          onChange={(e) => {
            card = props.editCard(e, card, "definition");
          }}
          onBlur={() => {
            card.isEdited = true;
            props.saveSet(true);
          }}
        />
        <button
          className="h-10 w-10 rounded-md bg-red-500 text-white"
          onClick={() => props.deleteCard(card)}
        >
          <h1 className="text-md">X</h1>
        </button>
      </div>
    </div>
  );
}

export default Page;
