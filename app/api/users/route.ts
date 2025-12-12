import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const users = [{ id: 1, name: 'Alice' }];
    return Response.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    return Response.json({ id: 2, ...body }, { status: 201 });
}


