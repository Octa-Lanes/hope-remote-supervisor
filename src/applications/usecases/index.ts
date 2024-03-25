import { SshShutdownUseCase } from 'src/applications/usecases/exec/sshShutdown.usecase';
import { SshStartUpUseCase } from 'src/applications/usecases/exec/sshStartUp.usecase';

const execUseCases = [SshStartUpUseCase, SshShutdownUseCase];

export default [...execUseCases];
