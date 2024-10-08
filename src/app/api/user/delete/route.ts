import { userController } from "@/api/controllers/userController";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  // only admin
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    return userController.deleteUser(id);
  } else {
    return jsonResponse({ message: "Bad request" }, 400);
  }
}
