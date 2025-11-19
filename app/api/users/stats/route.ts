import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users with their task statistics
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        _count: {
          select: {
            assignedTasks: true,
            createdTasks: true,
          },
        },
      },
    });

    // Get completed and pending tasks for each user
    const userStats = await Promise.all(
      users.map(async (user) => {
        const completedTasks = await prisma.task.count({
          where: {
            assignedToId: user.id,
            status: 'COMPLETED',
          },
        });

        const pendingTasks = await prisma.task.count({
          where: {
            assignedToId: user.id,
            status: {
              in: ['PENDING', 'IN_PROGRESS'],
            },
          },
        });

        return {
          username: user.username,
          displayName: user.displayName,
          assignedTasks: user._count.assignedTasks,
          createdTasks: user._count.createdTasks,
          completedTasks,
          pendingTasks,
        };
      })
    );

    return NextResponse.json({ stats: userStats });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
