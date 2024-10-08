import { userController } from "@/api/controllers/userController";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Only admin
  const params = req.nextUrl.searchParams;
  const searchQuery = params.get("s");
  const offset = params.get("offset");

  return userController.searchUser(
    searchQuery as string,
    parseInt(offset as string) || 0
  );
}
