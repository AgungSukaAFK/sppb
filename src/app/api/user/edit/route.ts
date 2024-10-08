import { userController } from "@/api/controllers/userController";
import { User } from "@/types";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  // only admin
  const body = (await req.json()) as User;
  if (Object.keys(body).length < 2) {
    return jsonResponse({ message: "Input tidak lengkap" }, 400);
  } else if (!body.hasOwnProperty("userid")) {
    return jsonResponse(
      { message: "Input tidak lengkap, missing user id" },
      400
    );
  } else {
    return userController.updateUser(body);
  }
}
