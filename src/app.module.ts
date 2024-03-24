import { Module } from '@nestjs/common';
import { AdapterModule } from 'src/adapters/adapter.module';
import { ApplicationModule } from 'src/applications/application.module';

@Module({
  imports: [AdapterModule, ApplicationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
