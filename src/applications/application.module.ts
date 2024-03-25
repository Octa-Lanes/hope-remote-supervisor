import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LiveSchedule } from 'src/applications/schedules/live/live.schedule';
import exportedUseCases from 'src/applications/usecases';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...exportedUseCases, LiveSchedule],
  exports: [...exportedUseCases],
})
export class ApplicationModule {}
