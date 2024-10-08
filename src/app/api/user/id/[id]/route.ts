import { userController } from "@/api/controllers/userController";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // only admin
  const { id } = params;

  if (!id) {
    return jsonResponse({ message: "Bad request" }, 400);
  } else {
    return userController.searchUserById(id);
  }
}
