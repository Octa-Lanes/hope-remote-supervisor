import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MadeConnectionValidation } from 'src/adapters/validations/events/madeConnection.validation';
import { MadeConnectionUseCase } from 'src/applications/usecases/events/madeConnection.usecase';

@Controller('events')
export class EventController {
  constructor(private readonly madeConnectionUseCase: MadeConnectionUseCase) {}

  @Post('made-connection')
  @HttpCode(HttpStatus.OK)
  public async madeConnection(@Body() payload: MadeConnectionValidation) {
    this.madeConnectionUseCase.handle(payload);
  }
}
