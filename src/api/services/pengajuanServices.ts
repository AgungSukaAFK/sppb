import pool from "@/lib/mysql2";
import { Approval, Pengajuan } from "@/types";
import { ResultSetHeader } from "mysql2";

// Semua fungsi jika berhasil akan mengembalikan:
// ResultSetHeader untuk menangani manipulasi data
// any[] untuk menangani ambil data

export const pengajuanServices = {
  // All - Ambil pengajuan
  get: async (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      "SELECT * FROM pengajuan WHERE id = ?",
      [id.toString()]
    );

    return table;
  },
  // User - Buat pengajuan baru
  create: async (data: Pengajuan) => {
    const [table]: [ResultSetHeader, unknown] = await pool.query(
      "INSERT INTO pengajuan (judul, requester, barang) VALUES (?, ?, ?)",
      [data.judul, JSON.stringify(data.requester), JSON.stringify(data.barang)]
    );

    return table;
  },
  // User - Cancel pengajuan
  cancel: async (id: Pengajuan["id"]) => {
    const [table]: [ResultSetHeader, unknown] = await pool.query(
      "UPDATE pengajuan SET status = ? WHERE id = ?",
      ["cancelled", id!.toString()]
    );

    return table;
  },
  // Approval purchasing
  approvalPurchasing: async (
    data: Pengajuan,
    approval: Approval,
    level: string
  ) => {
    const [table]: [ResultSetHeader, unknown] = await pool.query(
      "UPDATE pengajuan SET barang = ?, level = ? WHERE id = ?",
      [JSON.stringify(data.barang), level, data.id]
    );
    return table;
  },
};
