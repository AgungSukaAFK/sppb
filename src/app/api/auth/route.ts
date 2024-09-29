import jsonResponse from "@/utils/jsonResponse";

export async function POST() {
  return jsonResponse({
    message: "welcome to auth",
  });
}
