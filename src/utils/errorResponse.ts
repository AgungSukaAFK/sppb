import { NextResponse } from "next/server";

export default function errorResponse(err: Error) {
  return NextResponse.json(
    {
      message: "Something is error from server",
      version: "SPPB API v1.0",
      error: err,
    },
    { status: 500 }
  );
}
