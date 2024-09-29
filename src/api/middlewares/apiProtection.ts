import { decrypt } from "@/lib/jose";
import jsonResponse from "@/utils/jsonResponse";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;
export default async function apiProtector(req: NextRequest) {
  try {
    if (!secret) {
      return jsonResponse(
        {
          message: "Server error: no secret provided",
        },
        500
      );
    }

    if (req.cookies) {
      const token = (await cookies()).get("session")?.value;
      if (token) {
        const decoded = await decrypt(token).catch((err) => {
          return jsonResponse(
            {
              message: "Unauthorized, invalid token",
              err
            },
            400
          );
        });
        if (!decoded) {
          return jsonResponse(
            {
              message: "Unauthorized, expired token",
            },
            400
          );
        } else {
          return NextResponse.next();
        }
      } else {
        return jsonResponse(
          {
            message: "Unauthorized",
          },
          400
        );
      }
    } else {
      return jsonResponse(
        {
          message: "Unauthorized, no token",
        },
        400
      );
    }
  } catch (err) {
    return jsonResponse(
      {
        message: "Internal server error",
        error: err,
      },
      500
    );
  }
}
