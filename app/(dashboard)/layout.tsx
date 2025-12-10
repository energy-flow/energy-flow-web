import {RoleGuard} from "@/components/auth/RoleGuard";

type Props = { children: React.ReactNode };

export default function DashboardLayout({children}: Props) {
    return (
        <RoleGuard allowedRoles={['pmo', 'consumer', 'producer', 'admin']}>
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 lg:px-0">
                {children}
            </div>
        </RoleGuard>
    );
}