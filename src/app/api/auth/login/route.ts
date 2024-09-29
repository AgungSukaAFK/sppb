import { authController } from "@/api/controllers/authController";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userid, password } = await req.json();
    if (!userid || !password) {
      return jsonResponse(
        {
          message: "Missing username or password",
        },
        400
      );
    } else {
      return authController.login({ userid, password });
    }
  } catch {
    return jsonResponse(
      {
        message: "Invalid body",
      },
      400
    );
  }
}
