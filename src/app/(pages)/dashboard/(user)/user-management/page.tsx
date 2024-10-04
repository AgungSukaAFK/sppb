import RoleProtectorProvider from "@/pages/component/provider/RoleProtectorProvider";
import UserManagement from "@/pages/view/UserManagement/UserManagement";

export const dynamic = "force-dynamic";

export default function UserManagementPage() {
  return (
    <RoleProtectorProvider toProtect="admin">
      <UserManagement />
    </RoleProtectorProvider>
  );
}
