import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TelegramGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO: Add your Telegram authentication logic here
    return true;
  }
} 