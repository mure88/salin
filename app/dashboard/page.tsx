import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardContent from '@/components/dashboard-content';
import UserStats from '@/components/user-stats';

async function getStats() {
  const [
    totalTasks,
    activeTasks,
    completedTasks,
    urgentTasks,
    todayTasks,
    overdueTasks,
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
    }),
    prisma.task.count({
      where: { status: 'COMPLETED' },
    }),
    prisma.task.count({
      where: {
        priority: 'URGENT',
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.task.count({
      where: {
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.task.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    }),
  ]);

  return {
    totalTasks,
    activeTasks,
    completedTasks,
    urgentTasks,
    todayTasks,
    overdueTasks,
  };
}

async function getRecentTasks() {
  return prisma.task.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: { username: true, displayName: true },
      },
      assignedTo: {
        select: { username: true, displayName: true },
      },
    },
  });
}

async function getUserStats() {
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

  return userStats;
}

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getStats();
  const recentTasks = await getRecentTasks();
  const userStats = await getUserStats();

  return (
    <>
      <DashboardContent 
        username={session?.username || 'User'}
        stats={stats}
        recentTasks={recentTasks}
      />
      <div className="mt-6 px-4 md:px-0">
        <UserStats stats={userStats} />
      </div>
    </>
  );
}
