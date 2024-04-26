import { Injectable } from '@nestjs/common';
import { Journal } from 'src/domain/journal';

@Injectable()
export class JournalController {
  constructor() {}

  stream(data: Journal[]) {
    console.log(data);
  }
}
