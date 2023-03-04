import type { Record } from "pocketbase";

interface StudySet extends Record {
  title: string;
  description: string;
  visibility: "public" | "unlisted" | "private";
  cards: Record[];
  author: string;
  published: boolean;
  expand: {
    cards?: Card[];
    author?: User;
  };
}

interface Card extends Record {
  term: string;
  definition: string;
  created: string;
  updated: string;
  set: string;
  image: string | null;
}

interface User extends Record {
  username: string;
  email: string;
  sets: string[];
  favoriteSets: string[];
  expand: {
    sets?: StudySet[];
    favoriteSets?: StudySet[];
  };
}

export type { StudySet, Card, User };
