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
  private buffer: string = '';

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
    const journalctl = spawn('journalctl', ['-f', '-o', 'json']);

    const journalController = this.discoveryService
      .getProviders()
      .find((provider) => provider.name === JournalController.name);

    if (_.isEmpty(journalController) || !journalController?.instance) return;

    journalctl.stdout.on('data', (data) => {
      try {
        const formatData = data.toString();
        const json = this.formatToJson(formatData);
        if (journalController.instance?.stream)
          journalController.instance?.stream(json);
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

  private formatToJson(jsonData: string): Journal[] {
    // Combine buffer with new data
    let combinedData = this.buffer + jsonData;
    let potentialObjects = combinedData.split('\n');
    let validJsonObjects = [];
    this.buffer = ''; // Reset buffer

    potentialObjects.forEach((obj, index) => {
      try {
        if (obj.trim().length === 0) return; // Skip empty lines
        let parsedObj = JSON.parse(obj); // Try to parse the object
        validJsonObjects.push(parsedObj); // Add to valid objects if successful
      } catch (error) {
        // If parsing fails, check if it's the last element and potentially incomplete
        if (index === potentialObjects.length - 1) {
          this.buffer = obj; // Save the incomplete fragment to the buffer
        } else {
          this.logger.error('Discarded malformed JSON object:', obj); // Log or handle middle malformed objects
        }
      }
    });

    // Return the array of valid JSON objects
    return validJsonObjects;
  }
}
