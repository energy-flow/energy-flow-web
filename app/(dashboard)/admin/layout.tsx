import { MinterRoleGuard } from '@/components/auth/MinterRoleGuard';

type Props = { children: React.ReactNode };

export default function AdminLayout({ children }: Props) {
    return (
        <MinterRoleGuard>
            {children}
        </MinterRoleGuard>
    );
}
