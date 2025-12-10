import { MinterRoleGuard } from './_components/MinterRoleGuard';

type Props = { children: React.ReactNode };

export default function AdminLayout({ children }: Props) {
    return (
        <MinterRoleGuard>
            {children}
        </MinterRoleGuard>
    );
}
