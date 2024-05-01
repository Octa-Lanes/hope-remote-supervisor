import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { spawn } from 'child_process';
import * as _ from 'lodash';
import { JournalController } from 'src/adapters/inbounds/controller/journal.controller';
import { Journal } from 'src/domain/journal';

@Global()
@Module({})
export class JournalModule implements OnModuleInit {
  private readonly logger = new Logger(JournalModule.name);

  constructor(private readonly discoveryService: DiscoveryService) {}

  static forRoot(): DynamicModule {
    return {
      module: JournalModule,
      imports: [DiscoveryModule],
      providers: [JournalController],
      exports: [JournalController],
    };
  }

  onModuleInit() {
    const journalctl = spawn('journalctl', ['-f']);

    const journalController = this.discoveryService
      .getProviders()
      .find((provider) => provider.name === JournalController.name);

    if (_.isEmpty(journalController) || !journalController?.instance) return;

    journalctl.stdout.on('data', (data) => {
      try {
        const formatData = data.toString();
        if (journalController.instance?.stream)
          journalController.instance?.stream(formatData);
      } catch (error) {
        this.logger.error(error);
      }
    });

    journalctl.stderr.on('data', (data) => {
      this.logger.error(`stderr: ${data}`);
    });

    journalctl.on('error', (error) => {
      this.logger.error(error);
    });

    journalctl.on('close', (code) => {
      this.logger.error(`child process exited with code ${code}`);
    });

    journalctl.on('spawn', () => {
      this.logger.log('Journalctl started');
    });
  }
}
