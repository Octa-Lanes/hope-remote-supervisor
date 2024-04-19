import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import exportedUseCases from 'src/applications/usecases';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...exportedUseCases],
  exports: [...exportedUseCases],
})
export class ApplicationModule {}
