import { Module } from '@nestjs/common';
import { ScheduleModule as NativeScheduleModule } from '@nestjs/schedule';
import { LiveSchedule } from 'src/applications/schedules/live/live.schedule';

@Module({
  imports: [NativeScheduleModule.forRoot()],
  providers: [LiveSchedule],
})
export class ScheduleModule {}
