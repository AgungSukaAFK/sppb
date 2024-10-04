import RoleProtectorProvider from "@/pages/component/(provider)/RoleProtectorProvider";
import UserManagement from "@/pages/view/UserManagement/UserManagement";

export default function UserManagementPage() {
  return (
    <RoleProtectorProvider toProtect="admin">
      <UserManagement />
    </RoleProtectorProvider>
  );
}
