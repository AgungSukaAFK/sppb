import { userController } from "@/api/controllers/userController";

export async function GET() {
  return userController.getUserByUserid();
}
