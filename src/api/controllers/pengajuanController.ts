import { Approval, Pengajuan, User } from "@/types";
import jsonResponse from "@/utils/jsonResponse";
import { pengajuanServices } from "../services/pengajuanServices";
import { getUserFromRequest } from "./userController";
import { approvalController, validateApproval } from "./approvalController";

function validatePengajuan(data: Pengajuan) {
  return data.id && data.barang && data.barang?.length > 0;
}

export const pengajuanController = {
  buatPengajuanBaru: async (data: Pengajuan) => {
    try {
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
  /*
  Approval Purchasing
  - Mengubah status ke supervisor
  - Input harga barang dan vendor
  - Menambah history

  Alg:
  1. Cek apakah ada user
  2. Validasi inputApproval
  3. Validasi inputPengajuan
  4. Cek apakah user adalah purchasing
  5. Cek apakah pengajuan ada
  6. Tambahkan approval ke history
  */

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
