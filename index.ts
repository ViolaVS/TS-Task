//---Challenge 1: The Blind Parser

interface UserData {
  user: {
    name: string;
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function checkUserData(data: unknown): UserData | null {
  if (!isObject(data)) return null;
  if (!isObject(data.user)) return null;

  if (typeof data.user.name !== 'string') return null;

  return {
    user: {
      name: data.user.name,
    },
  };
}

function getUserNameFromJSON(jsonString: string): string | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    const data = checkUserData(parsed);
    return data?.user.name ?? null;
  } catch {
    return null;
  }
}

//---Challenge 2: Context-Aware Returns

type UserWithId = {
  id: number;
  status: string;
};

type UserWithName = {
  username: string;
  status: string;
};

function fetchUser(identifier: number): UserWithId;
function fetchUser(username: string): UserWithName;

function fetchUser(identifier: number | string): UserWithId | UserWithName {
  if (typeof identifier === 'number') {
    return { id: identifier, status: 'active' };
  } else {
    return { username: identifier, status: 'active' };
  }
}

//---Challenge 3: Modeling the Unknown
type PersonalInfo = {
  firstName: string;
  lastName: string;
  age: number;
  phone: string | null;
};

type Role = 'user' | 'editor';

type User = {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  personalInfo: PersonalInfo;
  roles: Role[];
  lastLogin?: string;
};

//---Challenge 4: Eliminating Impossible States

type LoadingState = {
  status: 'loading';
};

type SuccessState = {
  status: 'success';
  data: string[];
};

type ErrorState = {
  status: 'error';
  errorMessage: string;
};

type State = LoadingState | SuccessState | ErrorState;

function renderUI(state: State) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data.join(', ')}`;
    case 'error':
      return `Error: ${state.errorMessage.toUpperCase()}`;
    default:
      let _unreachable: never = state;
      throw new Error(`Unhandled state: ${_unreachable}`);
  }
}

//---Challenge 5: The Flexible Extractor

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

//---Challenge 6: The DRY Architecture

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

type CreatePayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
type UpdatePayload = { id: Product['id'] } & Partial<Omit<Product, 'id'>>;
type ClientPreview = Readonly<Pick<Product, 'id' | 'title' | 'price'>>;

//---Challenge 7: The Amnesic Array
interface Cat {
  type: 'cat';
  meow: () => void;
}
interface Dog {
  type: 'dog';
  bark: () => void;
}

const animals: (Cat | Dog | undefined | null)[] = [
  { type: 'cat', meow: () => console.log('Meow') },
  null,
  { type: 'dog', bark: () => console.log('Woof') },
  undefined,
];

const isCat = (animal: Cat | Dog | undefined | null): animal is Cat => {
  return !!animal && animal.type === 'cat';
};
const isNonNullable = <T>(data: T): data is NonNullable<T> => {
  return data !== null && data !== undefined;
};

//---Challenge 8: The Deep Freeze

interface AppConfig {
  version: string;
  settings: {
    theme: string;
    features: {
      beta: boolean;
    };
  };
}

const config: DeepReadonly<AppConfig> = {
  version: '1.0',
  settings: {
    theme: 'light',
    features: { beta: true },
  },
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

//---Challenge 9: The Dynamic Emitter

interface StoreState {
  theme: string;
  volume: number;
  isMuted: boolean;
}

type ChangeEvent = {
  [T in keyof StoreState as `${T & string}Changed`]: StoreState[T];
};

function subscribe<T extends keyof ChangeEvent>(
  event: T,
  callback: (val: ChangeEvent[T]) => void,
) {}

//---Challenge 10: The Core Extractor

function fetchUserProfile() {
  return Promise.resolve({ id: 1, avatarUrl: 'https://...' });
}

type Awaited_<T> = T extends Promise<infer U> ? Awaited_<U> : T;

type ProfileData = Awaited_<ReturnType<typeof fetchUserProfile>>;
type T1 = Awaited_<Promise<string>>;
type T2 = Awaited_<Promise<Promise<number>>>;
type T3 = Awaited_<boolean>;
