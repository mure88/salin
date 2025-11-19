import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/templates - List all templates
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.template.findMany({
      include: {
        templateTasks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
