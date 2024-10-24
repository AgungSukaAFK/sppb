import { Approval } from "@/types";
import jsonResponse from "@/utils/jsonResponse";
import { approvalServices } from "../services/approvalServices";

export function validateApproval({ userid, nama, role, status }: Approval) {
  return userid && nama && role && status;
}

export const approvalController = {
  createApproval: async ({
    userid,
    nama,
    role,
    status,
    comment = "",
  }: Approval) => {
    try {
      if (userid && nama && role && status) {
        const approval = await approvalServices.create({
          userid,
          nama,
          role,
          status,
          comment,
        });
        if (approval.affectedRows > 0) {
          return jsonResponse({ message: "Approval created" });
        } else {
          return jsonResponse({ message: "Failed to create approval" }, 500);
        }
      } else {
        return jsonResponse({ message: "Input tidak lengkap" }, 400);
      }
    } catch (e) {
      return jsonResponse({ message: "Server error", error: e }, 500);
    }
  },
};
