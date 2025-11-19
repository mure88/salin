import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/tasks/stats - Get task statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Optional: filter by user

    const where: any = {};
    if (userId) {
      where.OR = [
        { createdById: userId },
        { assignedToId: userId },
      ];
    }

    // Get all counts in parallel
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      cancelledTasks,
      urgentTasks,
      todayTasks,
      overdueTasks,
    ] = await Promise.all([
      // Total tasks
      prisma.task.count({ where }),
      
      // Pending tasks
      prisma.task.count({
        where: { ...where, status: 'PENDING' },
      }),
      
      // In progress tasks
      prisma.task.count({
        where: { ...where, status: 'IN_PROGRESS' },
      }),
      
      // Completed tasks
      prisma.task.count({
        where: { ...where, status: 'COMPLETED' },
      }),
      
      // Cancelled tasks
      prisma.task.count({
        where: { ...where, status: 'CANCELLED' },
      }),
      
      // Urgent tasks (high priority, not completed)
      prisma.task.count({
        where: {
          ...where,
          priority: 'URGENT',
          status: { not: 'COMPLETED' },
        },
      }),
      
      // Today's tasks (due today)
      prisma.task.count({
        where: {
          ...where,
          dueDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: { not: 'COMPLETED' },
        },
      }),
      
      // Overdue tasks
      prisma.task.count({
        where: {
          ...where,
          dueDate: {
            lt: new Date(),
          },
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      }),
    ]);

    // Get tasks by category
    const tasksByCategory = await prisma.task.groupBy({
      by: ['category'],
      where,
      _count: true,
    });

    // Get tasks by priority
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      where,
      _count: true,
    });

    const stats = {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      cancelledTasks,
      urgentTasks,
      todayTasks,
      overdueTasks,
      activeTasks: pendingTasks + inProgressTasks,
      completionRate: totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0,
      tasksByCategory: tasksByCategory.map((item: any) => ({
        category: item.category,
        count: item._count,
      })),
      tasksByPriority: tasksByPriority.map((item: any) => ({
        priority: item.priority,
        count: item._count,
      })),
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
