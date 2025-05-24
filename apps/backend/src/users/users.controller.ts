import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { TelegramGuard } from '../common/guards/telegram.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @UseGuards(TelegramGuard)
  async login(@Request() req) {
    const { id, username, first_name } = req.telegramUser;
    const user = await this.usersService.findOrCreate(
      id.toString(),
      username,
      first_name,
    );
    return { user };
  }

  @Post('api-keys')
  @UseGuards(TelegramGuard)
  async updateApiKeys(
    @Request() req,
    @Body() body: { apiKey: string; apiSecret: string },
  ) {
    const user = await this.usersService.updateBybitKeys(
      req.user.id,
      body.apiKey,
      body.apiSecret,
    );
    return { user };
  }
} 