import { Approval, Pengajuan, User } from "@/types";
import jsonResponse from "@/utils/jsonResponse";
import { pengajuanServices } from "../services/pengajuanServices";
import { getUserFromRequest } from "./userController";
import { approvalController, validateApproval } from "./approvalController";

function validatePengajuan(data: Pengajuan) {
  return data.id && data.barang && data.barang?.length > 0;
}

async function validateUserRole(role: User["role"]) {
  const user = await getUserFromRequest();
  return user && user.role === role;
}

export const pengajuanController = {
  buatPengajuanBaru: async (data: Pengajuan) => {
    try {
      if (!(await validateUserRole("user"))) {
        return jsonResponse({ message: "Illegal access" }, 400);
      }
      if (validatePengajuan(data)) {
        const pengajuan = await pengajuanServices.create(data);
        if (pengajuan.affectedRows > 0) {
          return jsonResponse({ message: "Pengajuan created" });
        } else {
          return jsonResponse({ message: "Failed to create pengajuan" }, 500);
        }
      } else {
        return jsonResponse({ message: "Invalid input data" }, 400);
      }
    } catch (e) {
      return jsonResponse({ message: "Server error", error: e }, 500);
    }
  },
  cancelPengajuan: async (idPengajuan: Pengajuan["id"]) => {
    try {
      const user = await getUserFromRequest();
      if (!(await validateUserRole("user")) || !user) {
        return jsonResponse({ message: "Illegal access" }, 400);
      }
      if (!idPengajuan) {
        return jsonResponse({ message: "Invalid parameter" }, 400);
      }
      const pengajuan = await pengajuanServices.get(idPengajuan);
      if (pengajuan.length < 1) {
        return jsonResponse({ message: "Pengajuan tidak ditemukan" }, 400);
      }
      const pengajuanData: Pengajuan = pengajuan[0];
      if (pengajuanData.level !== "purchasing") {
        return jsonResponse(
          { message: "Pengajuan tahap ini tidak dapat di cancel" },
          400
        );
      }
      if (pengajuanData.requester!.userid !== user.userid) {
        return jsonResponse(
          { message: "Illegal access, you are not the requester" },
          400
        );
      }
      const result = await pengajuanServices.cancel(idPengajuan);
      if (result.affectedRows > 0) {
        return jsonResponse({ message: "Pengajuan cancelled" });
      } else {
        return jsonResponse({ message: "Failed to cancel pengajuan" }, 500);
      }
    } catch (e) {
      return jsonResponse({ message: "Server error", error: e }, 500);
    }
  },
  editPengajuan: async (data: Pengajuan) => {
    /*
    Cek user
    Cek input
    Cek apakah pengajuan ada
    Cek pengajuan = purchasing
    Cek user = requester
    */
    try {
      const user = await getUserFromRequest();
      if (!user) {
        return jsonResponse({ message: "Illegal access" }, 400);
      }
      if (!validatePengajuan(data)) {
        return jsonResponse({ message: "Invalid input data" }, 400);
      }
      const peng = await pengajuanServices.get(data.id!);
      if (peng.length < 1) {
        return jsonResponse({ message: "Pengajuan tidak ditemukan" }, 400);
      }
      const pengajuan: Pengajuan = peng[0];
      if (pengajuan.level !== "purchasing") {
        return jsonResponse(
          { message: "Tidak bisa edit pengajuan di tahap ini" },
          400
        );
      }
      const allowedStatus: Pengajuan["status"][] = ["pending", "review"];
      if (!allowedStatus.includes(pengajuan.status)) {
        return jsonResponse(
          { message: "Tidak bisa edit pengajuan dengan status tahap ini" },
          400
        );
      }
      if (pengajuan.requester!.userid !== user.userid) {
        return jsonResponse(
          { message: "Illegal access, you are not the requester" },
          400
        );
      }
      // Validasi selesai
      const newPengajuan = { ...pengajuan };
      if (data.judul && data.judul !== newPengajuan.judul) {
        newPengajuan.judul = data.judul;
      }
      if (data.barang && data.barang !== newPengajuan.barang) {
        newPengajuan.barang = data.barang;
      }
      if (data.lampiran && data.lampiran !== newPengajuan.lampiran) {
        newPengajuan.lampiran = data.lampiran;
      }
      const editPengajuan = await pengajuanServices.edit(newPengajuan);
      if (editPengajuan.affectedRows > 0) {
        return jsonResponse({ message: "Pengajuan updated" });
      } else {
        return jsonResponse({ message: "Failed to update pengajuan" }, 500);
      }
    } catch (e) {
      return jsonResponse({ message: "Server error", error: e }, 500);
    }
  },
  approvalPurchasing: async ({
    pengajuan,
    approval,
  }: {
    pengajuan: Pengajuan;
    approval: Approval;
  }) => {
    try {
      const user: User | false = await getUserFromRequest();
      // Cek apakah ada user (1)
      if (user) {
        approval.userid = user.userid;
        approval.nama = user.nama;
        approval.role = user.role;
        if (!approval.comment) {
          approval.comment = "";
        }
        const allowedStatus = ["review", "approved", "denied"];
        if (!approval.status || !allowedStatus.includes(approval.status)) {
          return jsonResponse({ message: "Invalid approval" }, 400);
        }
      } else {
        return jsonResponse({ message: "Illegal access" }, 400);
      }
      // Cek apakah user adalah purchasing (4)
      if (user.role === "purchasing") {
        // Validasi pengajuan dan approval (2, 3)
        if (validatePengajuan(pengajuan) && validateApproval(approval)) {
          // Tambahkan data ke table approval
          const pengajuanFromDb = await pengajuanServices.get(
            pengajuan.id as number
          );
          pengajuanFromDb[0].barang = pengajuan.barang;
          approval.pengajuanid = pengajuanFromDb[0].id;
          const updated = await pengajuanServices.approvalPurchasing(
            pengajuanFromDb[0],
            approval,
            "purchasing"
          );
          if (updated.affectedRows > 0) {
            // Tambahkan approval
            const approv = await approvalController.createApproval(approval);
            console.log(await approv.json());
            if (approv.status === 200) {
              return jsonResponse({
                message: "Pengajuan approved by purchasing",
              });
            }
            return jsonResponse({
              message:
                "Pengajuan approved by purchasing, failed to add approval",
            });
          } else {
            return jsonResponse(
              { message: "Failed to approve pengajuan" },
              500
            );
          }
        } else {
          return jsonResponse({ message: "Input tidak sesuai" }, 400);
        }
      } else {
        return jsonResponse({ message: "Illegal access" }, 400);
      }
    } catch (e) {
      return jsonResponse({ message: "Server error", error: e }, 500);
    }
  },
};
