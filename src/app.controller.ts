import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { isPublic } from './shared/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @isPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
