import { ServiceExecUseCase } from 'src/applications/usecases/exec/serviceExec.usecase';
import { WriteLogPermanentUseCase } from 'src/applications/usecases/log/writeLogPermanent.usecase';
import { SelfRegisterUseCase } from 'src/applications/usecases/selfRegister/selfRegister.usecase';

import { MadeConnectionUseCase } from './events/madeConnection.usecase';

const execUseCases = [ServiceExecUseCase];

const eventUseCases = [MadeConnectionUseCase];

const logUseCases = [WriteLogPermanentUseCase];

const selfRegisterUseCases = [SelfRegisterUseCase];

export default [
  ...execUseCases,
  ...eventUseCases,
  ...logUseCases,
  ...selfRegisterUseCases,
];
