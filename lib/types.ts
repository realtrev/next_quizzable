interface Set extends Record<string, any> {
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
}

interface Card extends Record<string, any> {
  id: string;
  term: string;
  definition: string;
  created: string;
  updated: string;
  set: string;
  expand: object;
  image: string | null;
}

interface User extends Record<string, any> {
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
}

// edited set is the same as server set but with, isEdited: boolean
interface EditedSet extends Set {
  isEdited: boolean;
  isDeleted: boolean;
}

// edited card is the same as card but with, isEdited: boolean
interface EditedCard extends Card {
  isEdited: boolean;
  isDeleted: boolean;
}

export type { Set, Card, User, EditedCard, EditedSet };
