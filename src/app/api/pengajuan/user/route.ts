import { pengajuanController } from "@/api/controllers/pengajuanController";
import { Pengajuan } from "@/types";
import jsonResponse from "@/utils/jsonResponse";

export async function POST(request: Request) {
  const body = await request.json();
  if (body) {
    return pengajuanController.buatPengajuanBaru(body as Pengajuan);
  } else {
    return jsonResponse({ message: "Invalid input data" }, 400);
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (body) {
    return jsonResponse({ message: "TODO" });
  } else {
    return jsonResponse({ message: "Invalid input data" }, 400);
  }
}
