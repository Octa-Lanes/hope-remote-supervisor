import { Injectable } from '@nestjs/common';
import { WriteLogPermanentUseCase } from 'src/applications/usecases/log/writeLogPermanent.usecase';

@Injectable()
export class JournalController {
  constructor(
    private readonly writeLogPermanentUseCase: WriteLogPermanentUseCase,
  ) {}

  stream(data: string) {
    this.writeLogPermanentUseCase.handle({ payload: data });
  }
}
