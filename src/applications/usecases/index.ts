import { ServiceExecUseCase } from 'src/applications/usecases/exec/serviceExec.usecase';
import { WriteLogPermanentUseCase } from 'src/applications/usecases/log/writeLogPermanent.usecase';

import { MadeConnectionUseCase } from './events/madeConnection.usecase';

const execUseCases = [ServiceExecUseCase];

const eventUseCases = [MadeConnectionUseCase];

const logUseCases = [WriteLogPermanentUseCase];

export default [...execUseCases, ...eventUseCases, ...logUseCases];
