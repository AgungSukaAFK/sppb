import { userController } from "@/api/controllers/userController";

export async function GET() {
  // Auth
  return userController.getUserByUserid();
}
