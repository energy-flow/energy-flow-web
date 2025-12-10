import {UserRole} from "@/hooks/useUserRole";

export const PROTECTED_ROUTES = [
    '/consumer',
    '/producer',
    '/pmo',
    '/admin'
];

export const ROLE_ROUTES: Record<UserRole, string[]> = {
    admin: ['/admin', '/pmo'],  // Admin can access admin AND pmo routes
    pmo: ['/pmo'],
    producer: ['/producer'],
    consumer: ['/consumer'],
    none: [],
};