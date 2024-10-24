import pool from "@/lib/mysql2";
import { Approval } from "@/types";
import { ResultSetHeader } from "mysql2";

export const approvalServices = {
  create: async (data: Approval) => {
    const [table]: [ResultSetHeader, unknown] = await pool.query(
      "INSERT INTO approval (userid, nama, role, status, comment, pengajuanid) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.userid,
        data.nama,
        data.role,
        data.status,
        data.comment,
        data.pengajuanid?.toString(),
      ]
    );

    return table;
  },
};
// TODO: Edit and delete pengajuan by user (requester)
