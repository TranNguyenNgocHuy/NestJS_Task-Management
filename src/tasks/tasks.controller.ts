import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() fillterDto: GetTasksFilterDto): Array<Task> {
    if (Object.keys(fillterDto).length) {
      return this.taskService.getTasksWithFilters(fillterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') taskId: string): Task {
    return this.taskService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): void {
    this.taskService.deleteTask(taskId);
  }
}
