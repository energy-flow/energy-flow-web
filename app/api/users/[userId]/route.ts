import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    const user = { id: userId, name: 'Alice' };

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
}