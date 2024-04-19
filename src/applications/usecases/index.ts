import { DisconnectUseCase } from 'src/applications/usecases/events/disconnect.usecase';
import { ServiceExecUseCase } from 'src/applications/usecases/exec/serviceExec.usecase';

import { MadeConnectionUseCase } from './events/madeConnection.usecase';

const execUseCases = [ServiceExecUseCase];

const eventUseCases = [MadeConnectionUseCase, DisconnectUseCase];

export default [...execUseCases, ...eventUseCases];
