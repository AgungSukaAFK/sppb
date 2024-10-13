import jsonResponse from "@/utils/jsonResponse";
import { userServices } from "../services/userServices";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jose";
import { User } from "@/types";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

async function checkToken(tokenName: string) {
  const token = cookies().get(tokenName)?.value;
  const decoded = await decrypt(token);
  if (decoded) {
    return decoded;
  } else {
    return false;
  }
}

export async function getUserFromRequest() {
  const token = await checkToken("session");
  if (token) {
    const user = await userServices.getUserByUserid(token.userid as string);
    if (user.length) {
      return user[0] as User;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const userController = {
  // All role
  getUserByUserid: async () => {
    const token = cookies().get("session")?.value;
    const decoded = await decrypt(token);
    if (decoded) {
      const userid = decoded.userid as string;
      const user = await userServices.getUserByUserid(userid);
      if (user.length) {
        delete user[0].password;
        return jsonResponse({
          message: "User found",
          data: user[0],
        });
      } else {
        return jsonResponse(
          {
            message: "User not found",
            data: null,
          },
          404
        );
      }
    } else {
      return jsonResponse({
        message: "Unauthorized token",
      });
    }
  },
  // Ini hanya admin, karena bisa mengakses seluruh user
  searchUserById: async (id: string) => {
    try {
      const requester = await getUserFromRequest();
      if (!requester) {
        return jsonResponse({ message: "Illegal access" }, 400);
      } else {
        if (requester.role !== "admin") {
          return jsonResponse({ message: "Illegal access" }, 400);
        } else {
          const users = await userServices.getUserByUserid(id);
          if (users.length) {
            return jsonResponse({
              message: "User found",
              data: users[0],
            });
          } else {
            return jsonResponse(
              {
                message: "User not found",
                data: null,
              },
              400
            );
          }
        }
      }
    } catch (err) {
      return jsonResponse({ message: "Something error", err }, 500);
    }
  },
  // Admin
  getAllUser: async (offset: number) => {
    try {
      const decoded = await checkToken("session");
      if (decoded) {
        const users = await userServices.getUserByUserid(
          decoded.userid as string
        );
        const user: User = users[0];
        if (user.role !== "admin") {
          return jsonResponse(
            {
              messaeg: "Illegal access",
            },
            400
          );
        } else {
          const allUser = await userServices.getAllUser(offset);
          return jsonResponse({
            message: "User found",
            data: allUser,
          });
        }
      } else {
        return jsonResponse({
          message: "Unauthorized token",
        });
      }
    } catch (err) {
      console.log(err);
      return jsonResponse(
        {
          message: "Something error",
          err,
        },
        500
      );
    }
  },
  // Admin
  searchUser: async (searchQuery: string, offset: number) => {
    try {
      if (!searchQuery) {
        return jsonResponse(
          {
            message: "No query provided",
            data: null,
          },
          400
        );
      }
      const decoded = await checkToken("session");
      if (decoded) {
        const users = await userServices.getUserByUserid(
          decoded.userid as string
        );
        const user: User = users[0];
        if (user.role !== "admin") {
          return jsonResponse(
            {
              messaeg: "Illegal access",
            },
            400
          );
        } else {
          const allUser = await userServices.searchUser(searchQuery, offset);

          return jsonResponse({
            message: "User found",
            data: allUser,
          });
        }
      } else {
        return jsonResponse({
          message: "Unauthorized token",
        });
      }
    } catch (error) {
      console.log(error);
      return jsonResponse(
        {
          message: "Something error",
          err: error,
        },
        500
      );
    }
  },
  // Admin
  createUser: async ({
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
    // cek userid
    // cek role yang merequest
    // Cek user yang sudah ada
    // insert user
    const user = await getUserFromRequest();
    if (user) {
      if (user.role !== "admin") {
        return jsonResponse(
          {
            message: "Illegal access",
          },
          400
        );
      }
      try {
        const existUser = await userServices.getUserByUserid(userid);
        if (existUser.length) {
          return jsonResponse(
            {
              message: `UserId '${userid}' already exist`,
            },
            400
          );
        }

        const newUser = await userServices.insertUser({
          userid,
          nama,
          role,
          password,
        });
        return jsonResponse({
          message: "User created",
          data: newUser,
        });
      } catch (err) {
        return jsonResponse({ message: "Something error", err }, 500);
      }
    } else {
      return jsonResponse(
        {
          message: "Unauthorized token",
        },
        400
      );
    }
  },
  // Admin
  updateUser: async (data: User) => {
    try {
      const user = await getUserFromRequest();
      if (user) {
        if (user.role !== "admin") {
          return jsonResponse(
            {
              message: "Illegal access",
            },
            400
          );
        }
        const updateUser: ResultSetHeader = await userServices.updateUser(
          data.userid as string,
          data
        );
        if (updateUser?.affectedRows > 0) {
          return jsonResponse({
            message: "User updated",
          });
        } else {
          return jsonResponse(
            {
              message: "User not found",
            },
            400
          );
        }
      } else {
        return jsonResponse(
          {
            message: "Unauthorized token",
          },
          400
        );
      }
    } catch (err) {
      return jsonResponse({ message: "Something error", err }, 500);
    }
  },
  // Admin
  deleteUser: async (userid: string) => {
    try {
      const user = await getUserFromRequest();
      if (user) {
        if (user.role !== "admin") {
          return jsonResponse(
            {
              message: "Illegal access",
            },
            400
          );
        }
        const deletedUser = await userServices.deleteUser(userid);
        if (deletedUser.affectedRows > 0) {
          return jsonResponse({
            message: "User deleted",
          });
        } else {
          return jsonResponse(
            {
              message: "User not found",
            },
            400
          );
        }
      } else {
        return jsonResponse(
          {
            message: "Unauthorized token",
          },
          400
        );
      }
    } catch (err) {
      console.log(err);
      return jsonResponse({ message: "Something error", err }, 500);
    }
  },
  // All role
  changeUserNama: async (nama: string) => {
    try {
      if (!nama) {
        return jsonResponse({ message: "Nama tidak boleh kosong" }, 400);
      }
      const user = await getUserFromRequest();
      if (!user) {
        return NextResponse.redirect("/auth");
      } else {
        const result = await userServices.changeNama(
          user.userid as string,
          nama
        );
        if (result.affectedRows > 0) {
          return jsonResponse({
            message: "User updated",
          });
        } else {
          return jsonResponse({ message: "User not found" }, 400);
        }
      }
    } catch (err) {
      console.log(err);
      return jsonResponse({ message: "Something went wrong", err }, 500);
    }
  },
  changeUserEmail: async (email: string) => {
    try {
      if (!email) {
        return jsonResponse({ message: "Email tidak boleh kosong" }, 400);
      }
      const user = await getUserFromRequest();
      if (!user) {
        return NextResponse.redirect("/auth");
      } else {
        const result = await userServices.changeEmail(
          user.userid as string,
          email
        );
        if (result.affectedRows > 0) {
          return jsonResponse({
            message: "User updated",
          });
        } else {
          return jsonResponse({ message: "User not found" }, 400);
        }
      }
    } catch (err) {
      console.log(err);
      return jsonResponse({ message: "Something went wrong", err }, 500);
    }
  },
  changeUserPassword: async (oldPassword: string, newPassword: string) => {
    try {
      if (!oldPassword || !newPassword) {
        return jsonResponse({ message: "Input invalid" }, 400);
      }
      const user = await getUserFromRequest();
      if (!user) {
        return NextResponse.redirect("/auth");
      } else {
        const result = await userServices.changePassword(
          user.userid as string,
          oldPassword,
          newPassword
        );
        if (!result) {
          return jsonResponse({ message: "Old password incorrect" }, 400);
        }
        if (result.affectedRows > 0) {
          return jsonResponse({
            message: "User updated",
          });
        } else {
          return jsonResponse({ message: "Old password incorrect." }, 400);
        }
      }
    } catch (err) {
      console.log(err);
      return jsonResponse({ message: "Something went wrong", err }, 500);
    }
  },
  changeUserPhone: async (phone: string) => {
    try {
      if (!phone) {
        return jsonResponse(
          { message: "Nomor telepon tidak boleh kosong" },
          400
        );
      }
      const user = await getUserFromRequest();
      if (!user) {
        return NextResponse.redirect("/auth");
      } else {
        const result = await userServices.changePhone(
          user.userid as string,
          phone
        );
        if (result.affectedRows > 0) {
          return jsonResponse({
            message: "User updated",
          });
        } else {
          return jsonResponse({ message: "User not found" }, 400);
        }
      }
    } catch (err) {
      console.log(err);
      return jsonResponse({ message: "Something went wrong", err }, 500);
    }
  },
};
