import { User, Task, Category, Role, Priority, TaskStatus } from '@prisma/client';

export type { User, Task, Category, Role, Priority, TaskStatus };

export interface TaskWithRelations extends Task {
  createdBy: User;
  assignedTo: User | null;
}

export interface UserWithStats extends User {
  _count?: {
    createdTasks: number;
    assignedTasks: number;
  };
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  urgentTasks: number;
  todayTasks: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  dueDate?: Date;
  assignedToId?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
  completedAt?: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
  displayName?: string;
  role?: Role;
}

export interface LoginInput {
  username: string;
  password: string;
}
