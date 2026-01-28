import { Injectable } from '@nestjs/common';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    dto: CreateTaskDto,
    userId: number,
  ): Promise<TaskResponseDto> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        userId,
      },
    });
  }

  async getAllTasks(): Promise<TaskResponseDto[]> {
    return this.prisma.task.findMany();
  }

  async getTaskById(id: number): Promise<TaskResponseDto | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async getAllUserTasks(userId: number): Promise<TaskResponseDto[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async deleteTask(id: number): Promise<TaskResponseDto> {
    return this.prisma.task.delete({ where: { id } });
  }
}
