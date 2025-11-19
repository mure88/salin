import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const useTemplateSchema = z.object({
  assignedToId: z.string().optional(),
  dueDate: z.string().optional(),
});

// POST /api/templates/[id]/use - Create tasks from a template
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = useTemplateSchema.parse(body);

    // Get template with tasks
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        templateTasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create tasks from template
    const createdTasks = [];
    const taskMap = new Map(); // Map order to created task ID for dependencies

    for (const templateTask of template.templateTasks) {
      // Calculate due date based on order (each task gets +1 day)
      let taskDueDate = null;
      if (data.dueDate) {
        const baseDate = new Date(data.dueDate);
        baseDate.setDate(baseDate.getDate() + templateTask.order - 1);
        taskDueDate = baseDate;
      }

      // Determine dependency
      let dependsOnId = null;
      if (templateTask.dependsOnOrder) {
        dependsOnId = taskMap.get(templateTask.dependsOnOrder) || null;
      }

      const task = await prisma.task.create({
        data: {
          title: templateTask.title,
          description: templateTask.description,
          category: templateTask.category,
          priority: templateTask.priority,
          points: templateTask.points,
          dueDate: taskDueDate,
          assignedToId: data.assignedToId,
          dependsOnId,
          templateId: template.id,
          createdById: session.userId,
          status: 'PENDING',
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
      });

      taskMap.set(templateTask.order, task.id);
      createdTasks.push(task);
    }

    return NextResponse.json({ 
      tasks: createdTasks,
      count: createdTasks.length,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Use template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
