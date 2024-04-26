import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PulseRunner } from 'src/applications/schedules/runner/pulseRunner.schedule';
import exportedUseCases from 'src/applications/usecases';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...exportedUseCases, PulseRunner],
  exports: [...exportedUseCases],
})
export class ApplicationModule {}
