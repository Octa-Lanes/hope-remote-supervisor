import { SshShutdownUseCase } from 'src/applications/usecases/exec/sshShutdown.usecase';
import { SshStartUpUseCase } from 'src/applications/usecases/exec/sshStartUp.usecase';
import { MadeConnectionUseCase } from './events/madeConnection.usecase';

const execUseCases = [SshStartUpUseCase, SshShutdownUseCase];

const eventUseCases = [MadeConnectionUseCase];

export default [...execUseCases, ...eventUseCases];
