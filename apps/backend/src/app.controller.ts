import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramGuard } from './common/guards/telegram.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(TelegramGuard)
  testAuth(@Request() req) {
    return {
      message: 'Authentication successful',
      user: req.telegramUser,
    };
  }
}
