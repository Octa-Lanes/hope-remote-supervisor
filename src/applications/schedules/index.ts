import { LogRunner } from 'src/applications/schedules/runner/logRunner.schedule';
import { PulseRunner } from 'src/applications/schedules/runner/pulseRunner.schedule';

export const exportedRunners = [PulseRunner, LogRunner];
