import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class LogRunner {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: LogRunner.name,
  })
  public async log() {}
}
