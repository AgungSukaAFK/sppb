import pool from "@/lib/mysql2";
import { User } from "@/types";
import { ResultSetHeader } from "mysql2";

export const userServices = {
  getUserByUserid: async (userid: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT userid, nama, email, phone, role, date_created  FROM user WHERE userid = ?`,
      [userid]
    );

    return table;
  },
  getPasswordByUserid: async (userid: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT password  FROM user WHERE userid = ?`,
      [userid]
    );

    return table;
  },
  getAllUser: async (offset: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT userid, nama, email, phone, role, date_created FROM user LIMIT 10 OFFSET ${offset}`
    );
    return table;
  },
  searchUser: async (searchQuery: string, offset: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT userid, nama, email, phone, role FROM user where userid LIKE ? OR nama LIKE ? OR email LIKE ? OR role LIKE ? LIMIT 10 OFFSET ${offset}`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
      ]
    );
    return table;
  },
  insertUser: async ({
    userid,
    nama,
    role,
    password,
  }: {
    userid: string;
    nama: string;
    role: string;
    password: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `INSERT INTO user (userid, nama, role, password) VALUES (?, ?, ?, ?)`,
      [userid, nama, role, password]
    );
    return table;
  },
  updateUser: async (userid: string, data: User): Promise<ResultSetHeader> => {
    delete data?.userid;
    let query = `UPDATE user SET `;
    for (const [key, value] of Object.entries(data)) {
      query += `${key} = "${value}", `;
    }
    query = query.slice(0, -2) + ` WHERE userid = "${userid}"`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [ResultSetHeader, any] = await pool.query(query);
    return table;
  },
  deleteUser: async (userid: string): Promise<ResultSetHeader> => {
    const [table]: [ResultSetHeader, unknown] = await pool.query(
      `DELETE FROM user WHERE userid = ?`,
      [userid]
    );
    return table;
  },
};
