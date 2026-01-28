import { Task as PrismaTask, TaskStatus, Priority } from '@prisma/client';

export { TaskStatus, Priority };

export class Task implements PrismaTask {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
