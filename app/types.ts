type Set = {
  id: string;
  title: string;
  description: string;
  created: string;
  updated: string;
  author: string;
  visibility: string;
  cards: Array<string>;
  published: boolean;
  expand: {
    author: User;
    cards: Array<Card> | null;
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
  image: string | null;
};

type User = {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  expand: {
    favoriteSets: Array<Set> | null;
    sets: Array<Set> | null;
  };
  id: string;
  name: string;
  sets: Array<string>;
  favoriteSets: Array<string>;
  updated: string;
  username: string;
  verified: boolean;
};

// edited set is the same as server set but with, isEdited: boolean
type EditedSet = Set & { isEdited: boolean; isDeleted: boolean };

// edited card is the same as card but with, isEdited: boolean
type EditedCard = Card & { isEdited: boolean; isDeleted: boolean };

export type { Set, Card, User, EditedCard, EditedSet };
