import {UserRole} from "@/hooks/useUserRole";

// TODO: enlever les PUBLIC ROUTES
export const PUBLIC_ROUTES = ['/', '/register'];

export const PROTECTED_ROUTES = [
    '/consumer',
    '/producer',
    '/pmo',
    '/admin'
];

export const ROLE_ROUTES: Record<UserRole, string[]> = {
    pmo: ['/pmo'],
    producer: ['/producer'],
    consumer: ['/consumer'],
    none: [],
};