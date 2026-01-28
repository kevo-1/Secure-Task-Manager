import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { LogService } from '../log/log.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dto/task.dto';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; username: string };
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(
    private taskService: TaskService,
    private logService: LogService,
  ) {}

  @Post()
  async createTask(
    @Body() dto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.createTask(dto, req.user.id);
    await this.logService.createLog(req.user.id, `TASK_CREATED: ${task.id}`);
    return task;
  }

  @Get()
  async getUserTasks(
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto[]> {
    return this.taskService.getAllUserTasks(req.user.id);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (task.userId !== req.user.id) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (task.userId !== req.user.id) {
      throw new ForbiddenException('You do not have access to this task');
    }
    const updatedTask = await this.taskService.updateTask(id, dto);
    await this.logService.createLog(req.user.id, `TASK_UPDATED: ${id}`);
    return updatedTask;
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (task.userId !== req.user.id) {
      throw new ForbiddenException('You do not have access to this task');
    }
    const deletedTask = await this.taskService.deleteTask(id);
    await this.logService.createLog(req.user.id, `TASK_DELETED: ${id}`);
    return deletedTask;
  }
}
