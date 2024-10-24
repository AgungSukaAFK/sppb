import { pengajuanController } from "@/api/controllers/pengajuanController";
import { Approval, Pengajuan } from "@/types";
import { NextRequest } from "next/server";

interface bodyProps {
  pengajuan: Pengajuan;
  approval: Approval;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return pengajuanController.approvalPurchasing(body as bodyProps);
}
