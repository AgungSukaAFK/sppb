import { pengajuanController } from "@/api/controllers/pengajuanController";
import { Pengajuan } from "@/types";
import jsonResponse from "@/utils/jsonResponse";
import { NextRequest } from "next/server";

// User membuat pengajuan baru
export async function POST(request: Request) {
  const body = await request.json();
  if (body) {
    return pengajuanController.buatPengajuanBaru(body as Pengajuan);
  } else {
    return jsonResponse({ message: "Invalid input data" }, 400);
  }
}

// User revisi (edit) pengajuan
export async function PUT(request: Request) {
  const body = await request.json();
  if (body) {
    return pengajuanController.editPengajuan(body as Pengajuan);
  } else {
    return jsonResponse({ message: "Invalid input data" }, 400);
  }
}

// User edit pengajuan
export async function DELETE(request: NextRequest) {
  const idPengajuan = request.nextUrl.searchParams.get("id");
  if (idPengajuan && !isNaN(parseInt(idPengajuan))) {
    return pengajuanController.cancelPengajuan(parseInt(idPengajuan));
  } else {
    return jsonResponse({ message: "Invalid parameter" }, 400);
  }
}
