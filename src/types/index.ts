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

export interface Pengajuan {
  id?: number;
  judul?: string;
  requester?: { userid?: string; nama?: string };
  level?:
    | "purchasing"
    | "supervisor"
    | "manager"
    | "director"
    | "finance"
    | "history";
  created?: string;
  updated?: string;
  status?:
    | "pending"
    | "review"
    | "approved"
    | "denied"
    | "buying"
    | "success"
    | "cancelled";
  lampiran?: [{ name: string; size: number; key: string }];
  barang?: Barang[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type Approval = {
  userid?: string;
  nama?: string;
  role?:
    | "user"
    | "purchasing"
    | "supervisor"
    | "manager"
    | "director"
    | "finance"
    | "admin";
  date?: string;
  pengajuanid?: number;
  status?: "approved" | "denied" | "review";
  comment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type Barang = {
  id?: number;
  kategori?: string;
  nama?: string;
  satuan?: string;
  vendor?: Vendor;
  created?: string;
  updated?: string;
  harga?: number;
  qty?: number;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type Vendor = {
  id?: number;
  nama?: string;
  email?: string;
  phone?: string;
  created?: string;
  address?: string;
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
