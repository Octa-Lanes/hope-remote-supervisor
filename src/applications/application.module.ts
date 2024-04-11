import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LogRunner } from 'src/applications/schedules/runner/logRunner.schedule';
import exportedUseCases from 'src/applications/usecases';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...exportedUseCases, LogRunner],
  exports: [...exportedUseCases],
})
export class ApplicationModule {}
