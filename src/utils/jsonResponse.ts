import { NextResponse } from "next/server";

export default function jsonResponse(data: object, status = 200) {
  return NextResponse.json(
    {
      ...data,
      version: "SPPB API v1.0",
    },
    { status: status }
  );
}
