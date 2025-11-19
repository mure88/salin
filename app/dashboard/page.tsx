import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardContent from '@/components/dashboard-content';

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

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getStats();
  const recentTasks = await getRecentTasks();

  return (
    <DashboardContent 
      username={session?.username || 'User'}
      stats={stats}
      recentTasks={recentTasks}
    />
  );
}
