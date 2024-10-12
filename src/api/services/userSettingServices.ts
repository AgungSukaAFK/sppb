import pool from "@/lib/mysql2";
import { ResultSetHeader } from "mysql2";

export const userSettingServices = {
  getByUserid: async (userid: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT preference FROM user_setting WHERE userid = ?`,
      [userid]
    );
    return table;
  },
  updateTheme: async (
    userid: string,
    theme: string
  ): Promise<ResultSetHeader> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table]: [any[], any] = await pool.query(
      `SELECT preference FROM user_setting WHERE userid = ?`,
      [userid]
    );

    const previousSetting = table[0].preference;
    const newSetting = {
      ...previousSetting,
      theme: theme,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [table2]: [ResultSetHeader, any] = await pool.query(
      `UPDATE user_setting SET preference = ? WHERE userid = ?`,
      [JSON.stringify(newSetting), userid]
    );

    return table2;
  },
};
