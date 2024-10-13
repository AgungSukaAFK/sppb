import { userController } from "@/api/controllers/userController";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest, NextResponse } from "next/server";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    data: "anjay",
  });
}

export async function PUT(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch (error) {
    let errorMessage = "Invalid JSON body";
    if (error instanceof Error || error instanceof SyntaxError) {
      errorMessage = error.message;
    }
    return jsonResponse(
      { message: "Invalid JSON body", error: errorMessage },
      400
    );
  }
  if (body) {
    switch (body.action) {
      case "nama":
        return userController.changeUserNama(body.data || "");
      case "email":
        return userController.changeUserEmail(body.data || "");
      case "phone":
        return userController.changeUserPhone(body.data || "");
      case "password":
        return userController.changeUserPassword(
          body.data.old || "",
          body.data.new || ""
        );
      default:
        return jsonResponse({ message: "Invalid action" }, 400);
    }
  } else {
    return jsonResponse({ message: "Test", body: null }, 400);
  }
}
