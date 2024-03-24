import { Global, Module } from '@nestjs/common';
import { InboundModule } from 'src/adapters/inbounds/inbound.module';
import { OutboundModule } from 'src/adapters/outbounds/outbound.module';

@Global()
@Module({
  imports: [InboundModule, OutboundModule],
})
export class AdapterModule {}
