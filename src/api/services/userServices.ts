import pool from "@/lib/mysql2";

export const userServices = {
  getUserByUserid: async (userid: string) => {
    const [table]: [any[], any] = await pool.query(
      `SELECT * FROM user WHERE userid = ?`,
      [userid]
    );

    return table;
  },
};
