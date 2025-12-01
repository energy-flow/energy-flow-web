import {RoleGuard} from "@/components/auth/RoleGuard";

type Props = { children: React.ReactNode };

export default function DashboardLayout({children}: Props) {
    return (
        <RoleGuard allowedRoles={['pmo']}>
            {children}
        </RoleGuard>
    );
}