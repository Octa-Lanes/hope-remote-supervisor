import { Module } from '@nestjs/common';
import { AdapterModule } from 'src/adapters/adapter.module';

@Module({
  imports: [AdapterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
