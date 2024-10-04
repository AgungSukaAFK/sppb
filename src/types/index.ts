export type User = {
  id?: number;
  userid?: string;
  nama?: string;
  email?: string;
  phone?: string;
  role: "user" | "admin";
  date_created?: string;
};
