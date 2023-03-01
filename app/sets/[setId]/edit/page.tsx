"use client";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Loading from "../../../Loading";

import type { User, EditedSet, EditedCard } from "../../../types";
import Navbar from "../../../Navbar";

function Page({ params }: { params: { setId: string } }) {
  const router = useRouter();
  const pb = new PocketBase("https://quizzable.trevord.live");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null as User | null);
  const [lastSave, setLastSave] = useState(-1 as number);
  const [saving, setSaving] = useState(false as boolean);

  const [cardData, setCardData] = useState(
    new Array(3).fill({}).map(() => ({
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
    })) as EditedCard[]
  );

  const [set, setSet] = useState({
    id: "",
    title: "",
    description: "",
    visibility: "public",
    published: false,
    created: "",
    updated: "",
    author: "",
    expand: {
      author: {} as User,
      cards: [] as EditedCard[],
    },
    cards: [],
    isEdited: true,
    isDeleted: false,
  } as EditedSet);

  useEffect(() => {
    console.log(params.setId);

    const func = async function () {
      // check if the user is already logged in
      const user = pb.authStore;
      if (!user.isValid) {
        router.push("/login");
      } else {
        console.log(user.model);
        const id = user.model?.id;
        if (!id) {
          console.error("No user id found");
          return;
        }
        const newUserData: User = await pb
          .collection("users")
          .getOne(user.model?.id, {
            expand: "favoriteSets,favoriteSets.author,sets,sets.author",
          });

        setUserData(newUserData);

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

        if (!newUserData || response.author !== newUserData.id) {
          console.error("User is not the author of this set");
          router.push(`/sets/${params.setId}`);
          return;
        }

        setSet(response);
        setCardData((response?.expand?.cards as EditedCard[]) ?? []);

        setLoading(false);
      }
    };
    func().catch(console.error);
  }, []);

  function editSet(
    value: string | boolean,
    field: "title" | "description" | "visibility" | "published"
  ) {
    setSet({ ...set, [field]: value, isEdited: true });
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
      return undefined;
    }
    setCardData(
      cardData.map((cardInMap, i) =>
        i === index
          ? { ...cardInMap, [field]: event.target?.value, isEdited: true }
          : cardInMap
      )
    );
    return cardData[index] as EditedCard;
  }

  function deleteCard(card: EditedCard) {
    console.log("DELETING CARD", card);
    // find the card in the array
    let newCardData = cardData;
    const index = cardData.findIndex((c) => c.id === card.id);
    if (index === -1) {
      console.error("Card not found");
      return;
    }

    newCardData = newCardData.map((cardInMap, i) =>
      i === index
        ? { ...cardInMap, isDeleted: true, isEdited: true }
        : cardInMap
    );
    // If the card as an id of "" then it has never been saved and can be removed from the array
    if (card.id === "") {
      // delete the card at the index from the array
      newCardData = newCardData.filter((_, i) => i !== index);
    }
    setCardData(newCardData);
    saveSet(set.id, newCardData).catch(console.error);
  }

  //   when set data is changed, update the title and description
  useEffect(() => {
    if (set?.title) {
      const titleElement = document.getElementById("title") as HTMLInputElement;
      titleElement.value = set.title;
    }
    if (set?.description) {
      const descriptionElement = document.getElementById(
        "description"
      ) as HTMLInputElement;
      descriptionElement.value = set.description;
    }
    if (set?.visibility) {
      // pass
    }
  }, [set]);

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

  async function saveSet(
    setId: string = set.id,
    newCardData: EditedCard[] = cardData
  ) {
    // PUT is for updating, POST is for creating
    const method = setId !== "" ? "PUT" : "POST";

    console.log("SAVING", {
      ...set,
      expand: {
        ...set.expand,
        cards: newCardData,
      },
    });

    // send the request
    const response: { message: string; data: EditedSet; code: number } =
      (await pb
        .send("/api/quizzable/sets/" + setId, {
          method: method,
          body: {
            ...set,
            expand: {
              ...set.expand,
              cards: newCardData,
            },
          },
        })
        .catch((err) => {
          return err as { message: string; data: EditedSet; code: number };
        })) as { message: string; data: EditedSet; code: number };

    if (response.code !== 200) {
      console.error(response);
      return response;
    }

    // if the request failed, return
    // get the new set from the response
    const newSet = response.data;
    console.log(newSet);
    // set get the data of the set
    const newSetData: EditedSet = await pb
      .collection("sets")
      .getOne(newSet.id, {
        expand: "cards",
      });
    newSetData.isEdited = false;
    console.log(newSetData);
    if (newSetData?.expand?.cards) {
      // Add the isdeleted and isedited fields to the cards
      newSetData.expand.cards = newSetData.expand.cards.map((card) => ({
        ...card,
        isDeleted: false,
        isEdited: false,
      }));
    }
    setCardData(
      (newSetData?.expand?.cards as EditedCard[]) ?? ([] as EditedCard[])
    );
    setSet({
      ...set,
      ...newSetData,
    });

    return response;
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar user={userData} />

      <section className="mx-auto flex max-w-6xl gap-5 p-10">
        <main className="grow">
          <div className="grid grid-cols-2 gap-5">
            <label className="col-span-1 flex h-10 items-center justify-center rounded-md bg-gray-100">
              <h1 className="font-normal">Term</h1>
            </label>
            <label className="col-span-1 flex h-10 items-center justify-center rounded-md bg-gray-100">
              <h1 className="font-normal">Definition</h1>
            </label>
            {cardData?.map((card: EditedCard, i: number) => (
              <CardElement
                editCard={editCard}
                deleteCard={deleteCard}
                saveSet={async (autoSave?: boolean) => {
                  await saveSet();
                }}
                key={i}
                card={card}
              />
            ))}
            <button
              className="col-span-2 flex h-16 items-center justify-center rounded-md bg-gray-100 transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
              onClick={() => {
                setCardData([
                  ...(cardData ?? []),
                  {
                    id: "",
                    term: "",
                    definition: "",
                    image: "",
                    set: "",
                    isEdited: true,
                    isDeleted: false,
                  } as EditedCard,
                ]);
                console.log(cardData);
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
              id="title"
              onChange={(e) => editSet(e.target.value, "title")}
            />

            <textarea
              className="block h-[7.5rem] w-full resize-none appearance-none rounded-md border border-gray-300 bg-gray-100 py-2 px-4 leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
              placeholder="Enter a description..."
              id="description"
              onChange={(e) => editSet(e.target.value, "description")}
            />

            <div
              className={
                "grid h-10 gap-3 " +
                (set.published ? "grid-cols-2" : "grid-cols-3")
              }
            >
              <button
                className="col-span-1 h-full rounded-md bg-gray-400 px-4 font-bold text-white transition-all duration-200 hover:bg-gray-600"
                onClick={() => {
                  if (set.published) {
                    router.push(`/sets/${set.id}`);
                  } else {
                    router.push("/home");
                  }
                }}
              >
                <h1>Cancel</h1>
              </button>
              <button
                className="col-span-1 h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
                onClick={() => {
                  setTimeout(async () => {
                    const res = await saveSet(set.id, cardData);
                    if (res?.code !== 200) {
                      console.error(res);
                    }
                  }, 0);
                }}
              >
                <h1>Save</h1>
              </button>
              {!set.published ? (
                <button
                  className="col-span-1 h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:bg-blue-700"
                  onClick={() => {
                    editSet(true, "published");
                    setTimeout(async () => {
                      const res = await saveSet(set.id, cardData);
                      if (res?.code === 200) {
                        router.push(`/sets/${set.id}`);
                      } else {
                        console.error(res);
                      }
                    }, 0);
                  }}
                >
                  <h1>Publish</h1>
                </button>
              ) : null}
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
  ): EditedCard | undefined;
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
          card.term = e.target.value;
          card = props.editCard(e, card, "term") ?? card;
        }}
        value={card.term}
      />
      <div className="col-span-1 flex gap-5">
        <input
          className=" h-10 grow appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 font-normal leading-normal outline-none hover:border-gray-400 focus:border-blue-500 focus:bg-gray-200"
          type="text"
          placeholder="Enter a definition..."
          onChange={(e) => {
            card.definition = e.target.value;
            card = props.editCard(e, card, "definition") ?? card;
          }}
          value={card.definition}
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
