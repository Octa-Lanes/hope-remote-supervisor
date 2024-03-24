import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from 'src/applications/schedules/schedule.module';

@Global()
@Module({
  imports: [ScheduleModule],
})
export class ApplicationModule {}
