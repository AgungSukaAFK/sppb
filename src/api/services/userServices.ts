import pool from "@/lib/mysql2";

export const userServices = {
  getUserByUserid: async (userid: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT * FROM user WHERE userid = ?`,
      [userid]
    );

    return table;
  },
  getAllUser: async (offset: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT * FROM user LIMIT 10 OFFSET ${offset}`
    );
    return table;
  },
  searchUser: async (searchQuery: string, offset: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT userid, nama, email, phone, role FROM user where userid LIKE ? OR nama LIKE ? OR email LIKE ? LIMIT 10 OFFSET ${offset}`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );
    return table;
  },
};
