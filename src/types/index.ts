export type User = {
  id?: number;
  userid?: string;
  nama?: string;
  email?: string;
  phone?: string;
  role:
    | "user"
    | "purchasing"
    | "supervisor"
    | "manager"
    | "director"
    | "finance"
    | "admin";
  date_created?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type UserProperties =
  | "userid"
  | "nama"
  | "email"
  | "phone"
  | "role"
  | "date_created";

export type UserSettings = {
  theme: "nebula" | "jupiter" | "dark";
  email: boolean;
};
