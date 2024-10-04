import { userController } from "@/api/controllers/userController";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  const offset = req.nextUrl.searchParams.get("offset");
  return userController.getAllUser(parseInt(offset as string) || 0);
}
