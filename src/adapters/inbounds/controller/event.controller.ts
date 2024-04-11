import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DisconnectValidation } from 'src/adapters/validations/events/disconnect.validation';
import { MadeConnectionValidation } from 'src/adapters/validations/events/madeConnection.validation';
import { DisconnectUseCase } from 'src/applications/usecases/events/disconnect.usecase';
import { MadeConnectionUseCase } from 'src/applications/usecases/events/madeConnection.usecase';

@Controller('events')
export class EventController {
  constructor(
    private readonly madeConnectionUseCase: MadeConnectionUseCase,
    private readonly disconnectUseCase: DisconnectUseCase,
  ) {}

  @Post('made-connection')
  @HttpCode(HttpStatus.OK)
  public async madeConnection(@Body() payload: MadeConnectionValidation) {
    this.madeConnectionUseCase.handle(payload);
  }

  @Post('disconnect')
  @HttpCode(HttpStatus.OK)
  public async disconnect(@Body() payload: DisconnectValidation) {
    this.disconnectUseCase.handle(payload);
  }
}
