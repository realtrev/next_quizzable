import { ReactNode } from "react";
import PocketBase from "pocketbase";
import { StudySet } from "../../../lib/types";
import HomeNavbar from "../../home/HomeNavbar";
import Footer from "../../home/Footer";
import Page from "./page";

async function getSetData(setId: string) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const set = await pb
    .collection("sets")
    .getOne<StudySet>(setId)
    .catch(() => undefined);

  return set;
}

export async function generateMetadata({
  params,
}: {
  params: { setId: string };
}) {
  const set = await getSetData(params.setId);

  if (set && set.title && set.description) {
    return {
      title: set.title + " | Quizzable",
      description:
        set.description +
        " Study this set, and many more like it, on Quizzable!",
    };
  }

  return {
    title: "404 | Quizzable",
    description: "The set you are looking for does not exist.",
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: { setId: string };
  children: ReactNode;
}) {
  const studySet = await getSetData(params.setId);

  if (!studySet) {
    return (
      <div className="min-h-screen w-full bg-background-1">
        <HomeNavbar />

        <div className="body">
          <h2>The set you are looking for does not exist.</h2>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background-1">
      <HomeNavbar />

      <Page props={params} />

      <Footer />
    </div>
  );
}
