import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async createLog(userId: number, action: string) {
    return this.prisma.log.create({
      data: { userId, action },
    });
  }

  async getUserLogs(userId: number) {
    return this.prisma.log.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllLogs() {
    return this.prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
