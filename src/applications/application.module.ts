import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { exportedRunners } from 'src/applications/schedules';
import exportedUseCases from 'src/applications/usecases';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...exportedUseCases, ...exportedRunners],
  exports: [...exportedUseCases],
})
export class ApplicationModule {}
