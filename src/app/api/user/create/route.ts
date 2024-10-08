import { userController } from "@/api/controllers/userController";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Only admin
  try {
    const { userid, nama, password, role } = await req.json();
    if (!userid || !nama || !password || !role) {
      return jsonResponse({ message: "Bad request" }, 400);
    }
    return userController.createUser({ userid, nama, password, role });
  } catch (err) {
    return jsonResponse({ message: "Something error", err }, 500);
  }
}
