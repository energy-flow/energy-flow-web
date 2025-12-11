import {UserRole} from "@/hooks/useUserRole";

export const PROTECTED_ROUTES = [
    '/consumer',
    '/producer',
    '/pmo',
];

export const ROLE_ROUTES: Record<UserRole, string[]> = {
    pmo: ['/pmo'],
    producer: ['/producer'],
    consumer: ['/consumer'],
    none: [],
};