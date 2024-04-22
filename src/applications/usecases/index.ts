import { ServiceExecUseCase } from 'src/applications/usecases/exec/serviceExec.usecase';

import { MadeConnectionUseCase } from './events/madeConnection.usecase';

const execUseCases = [ServiceExecUseCase];

const eventUseCases = [MadeConnectionUseCase];

export default [...execUseCases, ...eventUseCases];
